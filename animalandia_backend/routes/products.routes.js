import { Router } from "express";
import {
    createProduct,
    getAllProducts,
    getMyProducts,
    getProductById,
    updateProduct,
    deleteProduct
} from "../controllers/products.controller.js"
import { verifyToken, isAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

// Público
router.get("/", getAllProducts);
router.get("/:id", getProductById);

// Seller / Admin
router.post("/", verifyToken, createProduct);
router.get("/mine", verifyToken, getMyProducts);
router.put("/:id", verifyToken, updateProduct);
router.delete("/:id", verifyToken, deleteProduct);

export default router;