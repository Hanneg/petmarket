import { pool } from "../database/connection.js";
import { insertOrderStatusHistory } from "../utils/orderHistory.js";
import { getStatusIdByName, ORDER_STATUS } from "../utils/orderStatus.js";

export const getSellerOrders = async (req, res) => {
    try {
        const sellerId = req.user.id;

        const result = await pool.query(
            `
            SELECT
                oi.id AS order_item_id,
                o.id AS order_id,
                os.name AS status,
                o.created_at,
                u.name AS client_name,
                p.name AS product_name,
                SUM(oi.subtotal) AS seller_total,
                SUM(p.stock) AS total_stock
            FROM order_items oi
            JOIN orders o ON o.id = oi.order_id
            JOIN users u ON u.id = o.user_id
            JOIN order_status os ON os.id = o.status_id
            JOIN products p ON p.id = oi.product_id
            WHERE oi.seller_id = $1
            GROUP BY oi.id, o.id, os.name, o.created_at, u.name, p.stock, p.name
            ORDER BY o.created_at DESC
            `,
            [sellerId]
        );
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al obtener pedido del vendedor" });
    }
};

export const getSellerPublications = async (req, res) => {
    try {
        const sellerId = req.user.id;

        const result = await pool.query(
            `
            SELECT
                p.id,
                p.name,
                p.description,
                p.price,
                p.stock,
                c.name AS category,
                p.image_url,
                p.status,
                p.created_at
            FROM products p
            JOIN categories c ON c.id = p.category_id
            WHERE p.seller_id = $1
            ORDER BY p.created_at DESC
            `,
            [sellerId]
        );

        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al obtener publicaciones" });
    }
};

export const createPublication = async (req, res) => {
    try {
        const sellerId = req.user.id;
        const { name, description, price, image_url, category_id, stock } = req.body;

        const result = await pool.query(
            `
            INSERT INTO products (name, description, price, image_url, category_id, seller_id, stock)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *
            `,
            [name, description, price, image_url, category_id, sellerId, stock]
        );

        if (!name || !category_id || !price || stock == null) {
            return res.status(400).json({
                message: "Faltan campos obligatorios"
            });
        }

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al crear publications" });
    }
};

export const deletePublication = async (req, res) => {
    try {
        const sellerId = req.user.id;
        const productId = req.params.id;

        const result = await pool.query(
            `
            DELETE FROM products
            WHERE id = $1 AND seller_id = $2
            RETURNING id
            `,
            [productId, sellerId]
        );

        if (result.rowCount === 0) {
            return res.status(403).json({ message: "No autorizado o producto inexistente" });
        }

        res.json({ message: "Publicación eliminada"})
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al eliminar publicación" })
    }
};

export const getSellerPublicationById = async (req, res) => {
    try {
        const sellerId = req.user.id;
        const { id } = req.params;

        const result = await pool.query(
            `
            SELECT
                p.id,
                p.name,
                p.description,
                p.price,
                p.stock,
                p.image_url,
                p.status,
                p.created_at,
                p.category_id,
                c.name AS category_name
            FROM products p
            JOIN categories c ON c.id = p.category_id
            WHERE p.id = $1 AND p.seller_id = $2
            `,
            [id, sellerId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Publicación no encontrada" })
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al obtener publicación"});
    }
};

export const updateSellerPublication = async (req, res) => {
    try {
        const sellerId = req.user.id;
        const { id } = req.params;
        const { name, description, price, category_id, image_url, stock } = req.body;

        const result = await pool.query(
            `
            UPDATE products
            SET
                name = $1,
                description = $2,
                price = $3,
                category_id = $4,
                image_url = $5,
                stock = $6
            WHERE id = $7 AND seller_id = $8
            RETURNING *
            `,
            [name, description, price, category_id, image_url, stock, id, sellerId] 
        );

        if (result.rows.length === 0) {
            return res.status(403).json({ message: "No autorizado"})
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al actualizar publicación" });
    }
};

// Flujo de pedido
export const approveSellerOrder = async (req, res) => {
    try {
        const sellerId = req.user.id;
        const orderId = req.params.id;

        // Verificar pedido del seller y estado actual
        const orderResult = await pool.query(
            `
            SELECT o.id, o.status_id, os.name AS status
            FROM orders o
            JOIN order_items oi ON oi.order_id = o.id
            JOIN order_status os ON os.id = o.status_id
            WHERE o.id = $1 AND oi.seller_id = $2
            LIMIT 1
            `,
            [orderId, sellerId]
        );

        if (orderResult.rows.length === 0) {
            return res.status(404).json({ message: "Pedido no encontrado" });
        }

        if (orderResult.rows[0].status !== ORDER_STATUS.PENDING) {
            return res.status(400).json({
                message: "Solo se pueden aprobar pedidos pendientes"
            });
        }

        // Estado actual
        const fromStatusId = orderResult.rows[0].status_id;

        // Estado destino
        const approvedStatusId = await getStatusIdByName(
            pool,
            ORDER_STATUS.APPROVED
        );

        // Actualizar estado
        await pool.query(
            `
            UPDATE orders
            SET status_id = $1
            WHERE id = $2
            `,
            [approvedStatusId, orderId]
        );

        // Historial
        await insertOrderStatusHistory({
            client: pool,
            orderId,
            fromStatusId,
            toStatusId: approvedStatusId,
            userId: sellerId,
            role: "seller"
        });

        res.json({ message: "Pedido aprobado correctamente" })
    } catch(error) {
        console.error(error);
        res.status(500).json({ message: "Error al aprobar pedido" })
    }
}

export const shipSellerOrder = async (req, res) => {
    try {
        const sellerId = req.user.id;
        const orderId = req.params.id;

        // Verificar pedido del seller y estado actual
        const orderResult = await pool.query(
            `
            SELECT o.id, o.status_id, os.name AS status
            FROM orders o
            JOIN order_items oi ON oi.order_id = o.id
            JOIN order_status os ON os.id = o.status_id
            WHERE o.id = $1 AND oi.seller_id = $2
            LIMIT 1
            `,
            [orderId, sellerId]
        );

        if (orderResult.rows.length === 0) {
            return res.status(404).json({ message: "Pedido no encontrado" })
        }

        if (orderResult.rows[0].status !== ORDER_STATUS.APPROVED) {
            return res.status(400).json({
                message: "Solo se pueden enviar pedidos aprobados",
            });
        }

        const fromStatusId = orderResult.rows[0].status_id;

        // Obtener id del estado shipped
        const shippedStatusId = await getStatusIdByName(
            pool,
            ORDER_STATUS.SHIPPED
        );

        // Actualizar estado
        await pool.query(
            `
            UPDATE orders
            SET status_id = $1
            WHERE id = $2
            `,
            [shippedStatusId, orderId]
        );

        // Historial
        await insertOrderStatusHistory({
            client: pool,
            orderId,
            fromStatusId,
            toStatusId: shippedStatusId,
            userId: sellerId,
            role: "seller"
        });

        res.json({ message: "Pedido marcado como enviado" });
    } catch(error) {
        console.error(error);
        res.status(500).json({ message: "Error al enviar pedido" })
    }
};

export const cancelSellerOrder = async (req, res) => {
    try {
        const sellerId = req.user.id;
        const orderId = req.params.id;

        // Verificar que el pedido tengo productos del seller
        const orderResult = await pool.query(
            `
            SELECT o.id, os.name AS status
            FROM orders o
            JOIN order_items oi ON oi.order_id = o.id
            JOIN order_status os ON os.id = o.status_id
            WHERE o.id = $1 AND oi.seller_id = $2
            GROUP BY o.id, os.name
            `,
            [orderId, sellerId]
        );

        if (orderResult.rows.length === 0) {
            return res.status(404).json({ message: "Pedido no encontrado" });
        }

        // Validar estado
        if (![ORDER_STATUS.PENDING, ORDER_STATUS.APPROVED].includes(orderResult.rows[0].status)) {
            return res.status(400).json({
                message: "No puedes cancelar un pedido completado",
            });
        }

        const fromStatusId = orderResult.rows[0].status_id;

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
            userId: sellerId,
            role: "seller",
        });

        res.json({ message: "Pedido cancelado por el vendedor. Comuniquese con el vendedor para dudas." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al cancelar pedido" });
    }
};