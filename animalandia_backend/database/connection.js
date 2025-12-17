import pkg from "pg";
import "dotenv/config";
const { Pool } = pkg;

// Configuración de postgres
export const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT,
    allowExitOnIdle: true
});

try {
    await pool.query("SELECT NOW()");
    console.log("Database connected");
} catch (error) {
    console.log(error)
}