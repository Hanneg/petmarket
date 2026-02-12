import { pool } from "../database/connection.js";

// GRÁFICO: USUARIOS POR ROL
export const getUsersSummary = async (req, res) => {
    try {
        const result = await pool.query(
            `
            SELECT role, COUNT(*) AS total
            FROM users
            GROUP BY role
            `
        );

        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error obteniendo resumen de usuarios" });
    }
};

// GRÁFICO: CANTIDAD DE PRODUCTOS POR CATEGORÍA
export const getProductsByCategory = async (req, res) => {
    try {
        const result = await pool.query(
            `
            SELECT c.name AS category, COUNT(p.id) AS total
            FROM categories c
            LEFT JOIN products p ON p.category_id = c.id
            GROUP BY c.name
            ORDER BY total DESC
            `
        );

        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error obteniendo productos por categoría" });
    }
};

// GRÁFICO: VENTAS TOTALES POR VENDEDOR
export const getSalesBySeller = async (req, res) => {
    try {
        const result = await pool.query(
            `
            SELECT u.name AS seller, SUM(oi.subtotal) AS total_sales
            FROM order_items oi
            JOIN users u ON u.id = oi.seller_id
            GROUP BY u.name
            ORDER BY total_sales DESC
            `
        );

        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error obteniendo ventas por vendedor" });
    }
};

// GRÁFICO: VENTAS AGRUPADAS POR MES
export const getSalesByMonth = async (req, res) => {
    try {
        const result = await pool.query(
            `
            SELECT TO_CHAR(o.created_at, 'YYYY-MM') AS month, SUM(oi.subtotal) AS total_sales
            FROM orders o
            JOIN order_items oi ON oi.order_id = o.id
            GROUP BY month
            ORDER BY month
            `
        );

        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error obteniendo ventas por mes" });
    }
};

// GRÁFICO: CANTIDAD DE PEDIDOS POR ESTADO
export const getOrdersByStatus = async (req, res) => {
    try {
        const result = await pool.query(
            `
            SELECT os.name AS status, COUNT(o.id) AS total
            FROM orders o
            JOIN order_status os ON os.id = o.status_id
            GROUP BY os.name
            `
        );

        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error obteniendo pedidos por estado" })
    }
};