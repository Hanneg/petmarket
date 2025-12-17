import { pool } from "./connection.js";
import bcrypt from "bcrypt";

const createAdmin = async () => {
    try {
        const name = "Admin";
        const email = "admin@animalandia.com";
        const password = "admin123";
        const role = "admin";

        // Verificar si ya existe
        const exists = await pool.query(
            "SELECT id FROM Users WHERE email = $1",
            [email]
        );

        if (exists.rowCount > 0) {
            console.log("⚠️ Admin ya existe");
            process.exit();
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await pool.query(
            `INSERT INTO Users (name, email, password, role)
             VALUES ($1, $2, $3, $4)`,
            [name, email, hashedPassword, role]
        );

        console.log("✅ Admin creado correctamente");
        process.exit();
    } catch (error) {
        console.error("❌ Error creando admin:", error);
        process.exit(1);
    }
};

createAdmin();