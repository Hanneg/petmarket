import { Router } from "express";
import {
    createCategory,
    getCategories
} from "../controllers/categories.controller.js";
import { isAdmin, verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();

// Público (para filtros y formularios)
router.get("/", getCategories);

// Admin
router.post("/", verifyToken, isAdmin, createCategory);

export default router;