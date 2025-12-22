import { pool } from "../database/connection.js";

// Crear productos (admin / seller)
export const createProduct = async (req, res) => {
    const { name, description, price, image_url, category_id } = req.body;

    try {
        if (!["admin", "seller"].includes(req.user.role)) {
            return res.status(403).json({ message: "No autorizado"})
        }

        const result = await pool.query(
            `INSERT INTO products
            (name, description, price, image_url, category_id, seller_id)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *`,
            [
                name,
                description,
                price,
                image_url,
                category_id,
                req.user.id
            ]
        );

        res.status(201).json(result.rows[0]);

    } catch (error) {
        console.error("CREATE PRODUCT ERROR ", error);
        res.status(500).json({ message: "Error creado producto" });
    }
};

// Listar todos los productos (público)
export const getAllProducts = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT 
                p.id, 
                p.name, 
                p.description, 
                p.price, 
                p.image_url, 
                p.status,
                c.name AS category
            FROM products p
            JOIN categories c ON p.category_id = c.id
            WHERE p.status = 'active'
            ORDER BY p.created_at DESC
        `);

        res.json(result.rows);
    } catch (error) {
        console.error("GET PRODUCTS ERROR ", error);
        res.status(500).json({ message: "Error listando los productos" });
    }
};

// Listar productos del vendedor
export const getMyProducts = async (req, res) => {
    try {
        const result = await pool.query (
            "SELECT * FROM products WHERE seller_id = $1",
            [req.user.id]
        );

        res.json(result.rows);
    } catch (error) {
        console.error("GET MY PRODUCTS ERROR ", error);
        res.status(500).json({ message: "Error obteniendo tus productos" });
    }
};

// Ver detalle de cada producto
export const getProductById = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query(
            `SELECT
                p.*,
                c.name AS category,
                u.name AS seller
            FROM products p
            JOIN categories c ON p.category_id = c.id
            JOIN users u ON p.seller_id = u.id
            WHERE p.id = $1`,
            [id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error("GET PRODUCT BY ID ERROR ", error);
        res.status(500).json({ message: "Error obteniendo producto" })
    }
};

// Editar producto
export const updateProduct = async (req, res) => {
    const { id } = req.params;
    const { name, description, price, image_url, category_id, status } = req.body;

    try {
        const product = await pool.query(
            "SELECT * FROM products WHERE id = $1",
            [id]
        );

        if (product.rowCount === 0) {
            return res.status(404).json({ message: "Producto no encontrado"})
        }

        const productData = product.rows[0];

        // Permisos
        if (
            req.user.role !== "admin" && 
            productData.seller_id !== req.user.id
        ) {
            return res.status(403).json({ message: "No autorizado" });
        }

        const result = await pool.query(
            `UPDATE products SET
                name=$1
                description=$2
                price=$3
                image_url=$4
                category_id=$5
                status=$6
            WHERE id=$7
            RETURNING *`,
            [
                name,
                description,
                price,
                image_url,
                category_id,
                status,
                id
            ]
        );
        
        res.json(result.rows[0]);
    } catch (error) {
        console.error("UPDATE PRODUCT ERROR ", error);
        res.status(500).json({ message: "Error actualizando producto" })
    }
};

// Eliminar producto
export const deleteProduct = async (req, res) => {
    const { id } = req.params;

    try {
        const product = await pool.query(
            "SELECT * FROM products WHERE id = $1",
            [id]
        );

        if (product.rowCount === 0) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }

        const productData = product.rows[0];

        if (
            req.user.role !== "admin" &&
            productData.seller_id !== req.user.id
        ) {
            return res.status(403).json({ message: "No autorizado"})
        }

        await pool.query(
            "DELETE FROM products WHERE ID=$1",
            [id]
        );

        res.json({ message: "Producto eliminado" });
    
    } catch (error) {
        console.error("DELETE PRODUCT ERROR ", error);
        res.status(500).json({ message: "Error eliminando producto" });
    }
};