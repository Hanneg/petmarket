import { Router } from "express";
import { 
    getUserById, 
    updateUser, 
    changePassword, 
} from "../controllers/users.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();

// USER
// Obtener datos del usuario (autenticado)
router.get("/:id", verifyToken, getUserById);
// Actualizar perfil del usuario
router.put("/:id", verifyToken, updateUser);
// Cambiar contraseña
router.put("/:id/change-password", verifyToken, changePassword);

export default router;