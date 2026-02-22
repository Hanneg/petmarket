import pkg from "pg";
import "dotenv/config";
const { Pool } = pkg;

const isProduction = process.env.NODE_ENV === "production";

// Configuración de postgres
export const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: isProduction
        ? { rejectUnauthorized: false }
        : false,
});

console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("isProduction:", isProduction);