import "dotenv/config";
import app from "./app.js";
import { pool } from "./database/connection.js";

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    try {
        // Probar conexión a la BD
        await pool.query("SELECT 1");
        console.log("✅ Base de datos conectada");

        // Levantar servidor
        app.listen(PORT, () => {
            console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
        });
    } catch (error) {
        console.error("❌ Error iniciando servidor:", error);
        process.exit(1);
    }
};

startServer();