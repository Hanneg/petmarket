import { Router } from "express";
import { 
    createUser, 
    getUserById, 
    updateUser, 
    changePassword, 
    getAllUsers,
    adminUpdateUser,
    deleteUser } from "../controllers/users.controller.js";
import { verifyToken, isAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

// ADMIN
// Enliste todos los usuarios
router.get("/", verifyToken, isAdmin, getAllUsers);
// Crear usuario
router.post("/", verifyToken, isAdmin, createUser);
// Edita usuario
router.put("/admin/:id", verifyToken, isAdmin, adminUpdateUser);
// Eliminar usuario
router.delete("/:id", verifyToken, isAdmin, deleteUser);

// USER
// Obtener datos del usuario (autenticado)
router.get("/:id", verifyToken, getUserById);
// Actualizar perfil del usuario
router.put("/:id", verifyToken, updateUser);
// Cambiar contraseña
router.put("/:id/change-password", verifyToken, changePassword);

export default router;