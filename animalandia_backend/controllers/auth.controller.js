import { pool } from "../database/connection.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// REGISTRO PÚBLICO (client o seller)
export const register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password || !role) {
            return res.status(400).json({ message: "Datos incompletos" });
        }

        if (!["client", "seller"].includes(role)) {
            return res.status(403).json({
                message: "Rol no permitido"
            });
        }

        const exists = await pool.query(
            "SELECT id FROM users WHERE email = $1",
            [email]
        );

        if (exists.rowCount > 0) {
            return res.status(409).json({ message: "Usuario ya existe" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await pool.query(
            `INSERT INTO users (name, email, password, role)
             VALUES ($1, $2, $3, $4)`,
            [name, email, hashedPassword, role]
        );

        res.status(201).json({ message: "Usuario registrado correctamente" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error en registro" });
    }
};

// LOGIN
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const result = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );

        if (result.rowCount === 0) {
            return res.status(401).json({ message: "Credenciales inválidas" });
        }

        const user = result.rows[0];

        const valid = await bcrypt.compare(password, user.password);

        if (!valid) {
            return res.status(401).json({ message: "Credenciales inválidas" });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.DB_JWT,
            { expiresIn: "8h" }
        );

        res.json({
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            },
            token
        });

    } catch (error) {
       console.error("LOGIN ERROR 👉", error);
        res.status(500).json({
            message: "Error interno",
            error: error.message
    });
    }
};