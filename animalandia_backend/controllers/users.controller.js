import { pool } from "../database/connection.js";
import bcrypt from "bcrypt";

// Crear usuario (solo admin)
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
        console.error("CREATE USER ERROR ", error);
        res.status(500).json({ message: "Error creando usuario" });
    }
};

// Obtener usuario por ID
export const getUserById = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query(
            "SELECT id, name, email, role FROM users WHERE id=$1",
            [id]
        );

        if (result.rowCount === 0 ) 
            return res.status(404).json({ message: "Usuario no encontrado" });

        res.json(result.rows[0]);
    } catch (error) {
        console.error("GET USER ERROR ", error);
        res.status(500).json({ message: "Error interno"});
    }
};

// Actualizar usuario (client o seller)
export const updateUser = async (req, res) => {
    const { id } = req.params;       // id del usuario que se quiere editar
    const { name, email, password } = req.body;

    try {
        // Validar que solo el dueño del perfil pueda editarlo
        if (parseInt(id) !== req.user.id) {
            return res.status(403).json({ message: "No tienes permisos para editar este perfil" });
        }

        let query = "UPDATE users SET name=$1, email=$2";
        const values = [name, email];

        // Si se envía nueva contraseña
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            query += `, password=$3`;
            values.push(hashedPassword);
        }

        query += ` WHERE id=$${values.length + 1} RETURNING id, name, email, role`;
        values.push(id);

        const result = await pool.query(query, values);

        if (result.rowCount === 0)
            return res.status(404).json({ message: "Usuario no encontrado" });

        res.json(result.rows[0]);

    } catch (error) {
        console.error("UPDATE USER ERROR ", error);
        res.status(500).json({ message: "Error actualizando usuario" });
    }
};

// Cambiar contraseña (client y seller)
export const changePassword = async (req, res) => {
    const { id } = req.params;
    const { currentPassword, newPassword } = req.body;

    try {
        // Solo puede cambiar su propia contraseña
        if (req.user.id !== Number(id)) {
            return res.status(403).json({ message: "No autorizado" });
        }

        // Obtener contraseña actual
        const result = await pool.query(
            "SELECT password, role FROM users WHERE id = $1",
            [id]
        );

        if (result.rowCount === 0)
            return res.status(404).json({ message: "Usuario no encontrado"});

        const user = result.rows[0];

        // Solo client y seller
        if (!["client", "seller"].includes(user.role)) {
            return res.status(403).json({ message: "Rol no permitido" });
        }

        // Verificar contraseña actual
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch)
            return res.status(400).json({ message: "Contraseña actual incorrecta"});

        // Hashear nueva contraseña
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await pool.query(
            "UPDATE users SET password=$1 WHERE id=$2",
            [hashedPassword, id]
        );

        res.json({ message: "Contraseña actualizada correctamente" });
    } catch (error) {
        console.error("CHANGE PASSWORD ERROR ", error)
        res.status(500).json({ message: "Error interno" });
    }
};