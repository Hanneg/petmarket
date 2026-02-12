import { Router } from "express";
import { verifyToken, isAdmin } from "../middlewares/auth.middleware.js";
import {
    getAllProducts,
    updateProduct,
    toggleProductStatus
} from "../controllers/admin.products.controller.js";

const router = Router();

router.get("/", verifyToken, isAdmin, getAllProducts)
router.put("/:id", verifyToken, isAdmin, updateProduct)
router.put("/:id/status", verifyToken, isAdmin, toggleProductStatus)

export default router;