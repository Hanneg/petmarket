import { pool } from "../database/connection.js";

// Crear categoría (solo admin)
export const createCategory = async (req, res) => {
    try {
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ message: "El nombre es obligatorio"})
        }

        const result = await pool.query(
            "INSERT INTO categories (name) VALUES ($1) RETURNING *",
            [name]
        );

        res.status(201).json(result.rows[0]);

    } catch (error) {
        if (error.code === "23505") {
            return res.status(400).json({ message: "La categoria ya existe"})
        }

        console.error("CREATE CATEGORY ERROR ", error)
        res.status(500).json({ message: "Error creando categoria" });
    }
};

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