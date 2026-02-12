import { pool } from "../database/connection.js";

// Obtener todas las categorías (público)
export const getCategories = async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT id, name FROM categories ORDER BY name ASC"
        );
        res.json(result.rows);
    } catch (error) {
        console.error("GET CATEGORIES ERROR ", error);
        res.status(500).json({ message: "Error obteniendo categorias" });
    }
};