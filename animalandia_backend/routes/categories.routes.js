import { Router } from "express";
import {
    getCategories
} from "../controllers/categories.controller.js";
//import { isAdmin, verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();

// Público (para filtros y formularios)
router.get("/", getCategories);

export default router;