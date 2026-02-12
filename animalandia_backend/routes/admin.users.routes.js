import { Router } from "express";
import {
  getAllUsers,
  createUser,
  adminUpdateUser,
  deleteUser
} from "../controllers/users.controller.js";
import { verifyToken, isAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyToken, isAdmin);

// ADMIN
// Enliste todos los usuarios
router.get("/", getAllUsers);
// Crear usuario
router.post("/", createUser);
// Edita usuario
router.put("/:id", adminUpdateUser);
// Eliminar usuario
router.delete("/:id", deleteUser);

export default router;
