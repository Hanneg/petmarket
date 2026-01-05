import { pool } from "../database/connection.js";

export const createOrder = async (req, res) => {
    const userId = req.user.id;
    const { address, payment_method, items } = req.body;

    if (!items || items.length === 0) {
        return res.status(400).json({ message: "No hay items en el pedido" })
    }

    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        // Calculat total
        let total = 0;
        items.forEach(item => {
            total += item.price * item.quantity;
        });

        // Crear order
        const orderResult = await client.query(
            `
            INSERT INTO orders (user_id, total, address, payment_method)
            VALUES ($1, $2, $3, $4)
            RETURNING id
            `,
            [userId, total, address, payment_method]
        );

        const orderId = orderResult.rows[0].id;

        // Crear order_items
        for (const item of items) {
            await client.query(
                `
                INSERT INTO order_items
                (order_id, product_id, product_name, price, quantity, subtotal)
                VALUES ($1, $2, $3, $4, $5, $6)
                `,
                [orderId, item.product_id, item.product_name, item.price, item.quantity, item.price * item.quantity]
            )
        };

        // Confirmar transacción
        await client.query("COMMIT");

        res.status(201).json({
            message: "Pedido creado correctamente",
            order_id: orderId
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
            SELECT id, total, status, created_at
            FROM orders
            WHERE user_id = $1
            ORDER BY created_at DESC
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
            SELECT id, total, status, address, payment_method, created_at
            FROM orders
            WHERE id = $1 AND user_id = $2
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