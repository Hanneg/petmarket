import { pool } from "../database/connection.js";
import { insertOrderStatusHistory } from "../utils/orderHistory.js";
import { ORDER_STATUS, getStatusIdByName } from "../utils/orderStatus.js";

export const createOrder = async (req, res) => {
    const userId = req.user.id;
    const { address, payment_method, items } = req.body;

    if (!items || items.length === 0) {
        return res.status(400).json({ message: "No hay items en el pedido" })
    }

    const client = await pool.connect();

    const statusRes = await client.query(
        "SELECT id FROM order_status WHERE name = 'PENDING'"
    );

    const pendingStatusId = statusRes.rows[0].id;

    // Obtener seller_id de cada producto
    const itemsWithSeller = [];

    for (const item of items) {
        const productRes = await client.query(
            `SELECT seller_id FROM products WHERE id = $1`,
            [item.product_id]
        );

        if (productRes.rows.length === 0) {
            return res.status(400).json({ message: "Producto no encontrado" });
        }

        itemsWithSeller.push({
            ...item,
            seller_id: productRes.rows[0].seller_id,
        });
    }

    // Agrupar por seller
    const itemsBySeller = {};

    for (const item of itemsWithSeller) {
        if (!itemsBySeller[item.seller_id]) {
            itemsBySeller[item.seller_id] = [];
        }
        itemsBySeller[item.seller_id].push(item);
    }

    const createdOrders = [];

    try {
        await client.query("BEGIN");

        for (const sellerId in itemsBySeller) {
            const sellerItems = itemsBySeller[sellerId];

            // Calcular total por vendedor
            let total = 0;
            sellerItems.forEach(item => {
                total += item.price * item.quantity;
            });

            // Crear order
            const orderResult = await client.query(
                `
                INSERT INTO orders (user_id, total, address, payment_method, status_id)
                VALUES ($1, $2, $3, $4, $5)
                RETURNING id
                `,
                [userId, total, address, payment_method, pendingStatusId]
            );

            const orderId = orderResult.rows[0].id;

            // Insertar items
            for (const item of sellerItems) {
                await client.query(
                    `
                    INSERT INTO order_items
                    (order_id, product_id, product_name, price, quantity, subtotal, seller_id)
                    VALUES ($1, $2, $3, $4, $5, $6, $7)
                    `,
                    [
                        orderId,
                        item.product_id,
                        item.product_name,
                        item.price,
                        item.quantity,
                        item.price * item.quantity,
                        item.seller_id,
                    ]
                );
            }

            // Historial
            await insertOrderStatusHistory({
                client,
                orderId,
                fromStatusId: null,
                toStatusId: pendingStatusId,
                userId,
                role: "client",
            });

            createdOrders.push(orderId);
        }

        // Confirmar transacción
        await client.query("COMMIT");

        res.status(201).json({
            message: "Pedidos creados correctamente",
            orders: createdOrders,
        });

    } catch (error) {
        await client.query("ROLLBACK");
        console.error(error);
        res.status(500).json({ message: "Error al crear el pedido" });
    } finally {
        client.release();
    }
};

// Obtener los pedidos del usuario logueado
export const getUserOrders = async (req, res) => {
    try {
        const userId = req.user.id;

        const result = await pool.query(
            `
            SELECT 
                o.id, 
                o.total, 
                os.name AS status, 
                o.created_at
            FROM orders o
            JOIN order_status os ON os.id = o.status_id
            WHERE o.user_id = $1
            ORDER BY o.created_at DESC
            `,
            [userId]
        );

        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al mostrar los pedidos" });
    }
};

// Obtener el detalle de un pedido
export const getOrderById = async (req, res) => {
    try {
        const userId = req.user.id;
        const orderId = req.params.id;

        // Pedido
        const orderRes = await pool.query(
            `
            SELECT 
                o.id, 
                o.total, 
                os.name AS status, 
                o.address, 
                o.payment_method, 
                o.created_at
            FROM orders o
            JOIN order_status os ON os.id = o.status_id
            WHERE o.id = $1 AND o.user_id = $2
            `,
            [orderId, userId]
        );

        if (orderRes.rows.length === 0) {
            return res.status(404).json({ message: "Pedido no encontrado" })
        }

        // Items
        const ItemsRes = await pool.query(
            `
            SELECT product_name, price, quantity, subtotal
            FROM order_items
            WHERE order_id = $1
            `,
            [orderId]
        );

        res.json({
            order: orderRes.rows[0],
            items: ItemsRes.rows
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al obtener pedido" })
    }
};

// Flujo de pedido
export const completeOrder = async (req, res) => {
    const userId = req.user.id;
    const orderId = req.params.id;

    try {
        await pool.query("BEGIN");    

        // Verificar que el pedido pertenece al cliente
        const orderResult = await pool.query(
            `
            SELECT o.id, os.name AS status
            FROM orders o
            JOIN order_status os ON os.id = o.status_id
            WHERE o.id = $1 AND o.user_id = $2
            `,
            [orderId, userId]
        );

        if (orderResult.rows.length === 0) {
            return res.status(404).json({ message: "Pedido no encontrado" })
        }

        // Validar estado actual
        if (orderResult.rows[0].status !== ORDER_STATUS.SHIPPED) {
            return res.status(400).json({
                message: "Solo puedes marcar como recibido un pedido enviado"
            });
        }

        // Estado actual
        const fromStatusId = await getStatusIdByName(
            pool,
            ORDER_STATUS.SHIPPED
        );

        // Obtener id del estado completed
        const completedStatusId = await getStatusIdByName(
            pool,
            ORDER_STATUS.COMPLETED
        );

        // Descuento stock
        const itemsRes = await pool.query(
            `
            SELECT product_id, quantity
            FROM order_items
            WHERE order_id = $1
            `,
            [orderId]
        );

        // Validar y descontar stock
        for (const item of itemsRes.rows) {
            const stockRes = await pool.query(
                `
                SELECT stock
                FROM products
                WHERE id = $1
                FOR UPDATE
                `,
                [item.product_id]
            );

            const currentStock = stockRes.rows[0].stock;

            if (currentStock < item.quantity) {
                throw new Error("Stock insuficiente");
            }

            await pool.query(
                `
                UPDATE products
                SET stock = stock - $1
                WHERE id = $2
                `,
                [item.quantity, item.product_id]
            );
        }

        // Actualizar estado del pedido
        await pool.query(
            `
            UPDATE orders
            SET status_id = $1
            WHERE id = $2
            `,
            [completedStatusId, orderId]
        )

        // Historial
        await insertOrderStatusHistory({
            client: pool,
            orderId,
            fromStatusId,
            toStatusId: completedStatusId,
            userId,
            role: "client"
        });

        await pool.query("COMMIT");

        res.json({ message: "Pedido marcado como completado" });
    } catch (error) {
        await pool.query("ROLLBACK");
        console.error(error);
        res.status(500).json({ message: "Error al completar pedido" })
    } finally {
        pool.release();
    }
};

// Cancelación de un pedido
export const cancelOrderByClient = async (req, res) => {
    try {
        const userId = req.user.id;
        const orderId = req.params.id;

        // Verificar pedido
        const orderResult = await pool.query(
            `
            SELECT o.id, os.name AS status
            FROM orders o
            JOIN order_status os ON os.id = o.status_id
            WHERE o.id = $1 AND o.user_id = $2
            `,
            [orderId, userId]
        );

        if (orderResult.rows.length === 0) {
            return res.status(404).json({ message: "Pedido no encontrado" });
        }

        // Verificar estado
        if (orderResult.rows[0].status !== ORDER_STATUS.PENDING) {
            return res.status(400).json({
                message: "Solo puedes cancelar pedidos pendientes",
            });
        }

        const fromStatusId = await getStatusIdByName(
            pool,
            ORDER_STATUS.PENDING
        );

        // Cancelar
        const cancelledStatusId = await getStatusIdByName(
            pool,
            ORDER_STATUS.CANCELLED
        );

        await pool.query(
            `
            UPDATE orders
            SET status_id = $1
            WHERE id = $2
            `,
            [cancelledStatusId, orderId]
        );

        await insertOrderStatusHistory({
            client: pool,
            orderId,
            fromStatusId,
            toStatusId: cancelledStatusId,
            userId,
            role: "client"
        });

        res.json({ message: "Pedido cancelado correctamente" })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al cancelar pedido" })
    }
};