import { pool } from "../database/connection.js";

// Enlista todos los productos
export const getAllProducts = async (req, res) => {
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
            c.name AS category,
            u.name AS seller
        FROM products p
        JOIN users u ON u.id = p.seller_id
        JOIN categories c ON c.id = p.category_id
        ORDER BY p.created_at DESC
        `
    );

    res.json(result.rows);
}

// Edita el producto
export const updateProduct = async (req, res) => {
  try {
    const { name, price, stock, image_url, category_id } = req.body;

    const result = await pool.query(
      `
      UPDATE products 
      SET 
        name = $1, 
        price = $2, 
        stock = $3,
        image_url = $4,
        category_id = $5 
      WHERE id = $6
      RETURNING *
      `,
      [name, price, stock, image_url, category_id, req.params.id]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export const toggleProductStatus = async (req, res) => {
  try {
    const { status } = req.body;

    await pool.query(
      `
      UPDATE products 
      SET status = $1
      WHERE id = $2
      `,
      [status, req.params.id]
    );

    res.json({ message: "Estado actualizado" })
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al actualizar estado" })
  }
};