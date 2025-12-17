import { Router } from "express";
import { createUser, getUserById, updateUser, changePassword } from "../controllers/users.controller.js";
import { verifyToken, isAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

// Solo admin puede crear usuarios
router.post("/", verifyToken, isAdmin, createUser);

// Obtener datos del usuario (autenticado)
router.get("/:id", verifyToken, getUserById);

// Actualizar perfil del usuario
router.put("/:id", verifyToken, updateUser);

// Cambiar contraseña
router.put("/:id/change-password", verifyToken, changePassword);

export default router;