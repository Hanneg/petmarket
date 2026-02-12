import { pool } from "../database/connection.js";
import { getStatusIdByName } from "../utils/orderStatus.js";

export const getAllOrders = async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const orders = await pool.query(
        `
        SELECT 
            o.id, 
            o.created_at, 
            o.total, 
            o.address, 
            o.payment_method, 
            os.name AS status, 
            u.name AS client
        FROM orders o
        JOIN users u ON u.id = o.user_id
        JOIN order_status os ON os.id = o.status_id
        ORDER BY o.created_at DESC
        LIMIT $1 OFFSET $2
        `,
        [limit, offset]
    );

    const total = await pool.query(`SELECT COUNT(*) FROM orders`);

    res.json({
        data: orders.rows,
        total: Number(total.rows[0].count),
        page: Number(page),
        totalPages: Math.ceil(total.rows[0].count / limit)
    });
};

export const updateOrderStatus = async (req, res) => {
    const { status } = req.body;
    const orderId = req.params.id;

    const statusId = await getStatusIdByName(pool, status);

    await pool.query(
        `UPDATE orders SET status_id = $1 WHERE id = $2`,
        [statusId, orderId]
    );

    res.json({ message: "Estado actualizado" });
};

export const deleteOrder = async (req, res) => {
    try {
        const orderId = req.params.id

        await pool.query(
            `
            DELETE FROM orders
            WHERE id = $1
            `,
            [orderId]
        );

        res.json({ message: "Pedido cancelado correctamente" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message })
    }
}