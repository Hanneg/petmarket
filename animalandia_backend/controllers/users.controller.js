import { pool } from "../database/connection.js";
import bcrypt from "bcrypt";

export const createUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        if (!["admin", "seller", "client"].includes(role)) {
            return res.status(403).json({ message: "Rol inválido" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await pool.query(
            `INSERT INTO users (name, email, password, role)
             VALUES ($1, $2, $3, $4)`,
            [name, email, hashedPassword, role]
        );

        res.status(201).json({ message: "Usuario creado por admin" });

    } catch (error) {
        res.status(500).json({ message: "Error creando usuario" });
    }
};