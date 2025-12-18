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

        const result = await pool.query(
            `INSERT INTO users (name, email, password, role)
             VALUES ($1, $2, $3, $4)
             RETURNING id, name, email, role`,
            [name, email, hashedPassword, role]
        );

        res.status(201).json(result.rows[0]);

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

// ----------------------------------ADMIN--------------------------------------------
// Obtener todos los usuarios (solo admin)
export const getAllUsers = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, name, email, role, created_at FROM users ORDER BY id ASC"
    );
    res.json(result.rows);
  } catch (error) {
    console.error("GET ALL USERS ERROR", error);
    res.status(500).json({ message: "Error obteniendo usuarios" });
  }
};

// Editar un usuario, incluyendo el mismo
export const adminUpdateUser = async (req, res) => {
    const { id } = req.params;
    const { name, email, role, password } = req.body;

    try {
        // Validar rol
        if (role && !["admin", "seller", "client"].includes(role)) {
            return res.status(400).json({ message: "Rol inválido"});
        }

        let query = "UPDATE users SET name=$1, email=$2, role=$3";
        let values = [name, email, role];

        // Si se envía nueva contraseña
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            query += `, password=$4`;
            values.push(hashedPassword);
        }

        query += ` WHERE id=$${values.length + 1} RETURNING id, name, email, role`;
        values.push(id);

        const result = await pool.query(query, values);

        if (result.rowCount === 0) {
            return res.status(404).json({ message: "Usuario no encontrado"});
        }

        res.json(result.rows[0]);

    } catch (error) {
        console.error("ADMIN UPDATE USER ERROR ", error);
        res.status(500).json({ message: "Error actualizando usuario" });
    }
};

// Eliminar usuarios, menos admins
export const deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        // No permitir eliminarse a si mismo
        if (Number(id) === req.user.id) {
            return res.status(403).json({
                message: "No puedes eliminar tu propio usuario"
            });
        }

        // Obtener rol del usuario a eliminar
        const result = await pool.query(
            "SELECT role FROM users WHERE id = $1",
            [id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ message: "Usuario no encontrado" })
        }

        const userToDelete = result.rows[0];

        // No eliminar admins
        if (userToDelete.role === "admin") {
            return res.status(403).json({
                message: "No se puede eliminar un administrador"
            });
        }

        await pool.query(
            "DELETE FROM users WHERE id = $1",
            [id]
        );

        res.json({ message: "Usuario eliminado correctamente" });

    } catch (error) {
        console.error("DELETE USER ERROR ", error)
        res.status(500).json({ message: "Error eliminando usuario" });
    }
};