import { Router } from "express";
import { verifyToken, isAdmin } from "../middlewares/auth.middleware.js";
import { 
    getUsersSummary,
    getProductsByCategory,
    getSalesBySeller,
    getSalesByMonth,
    getOrdersByStatus
} from "../controllers/admin.dashboard.controller.js";

const router = Router();

router.get("/users-summary", verifyToken, isAdmin, getUsersSummary);
router.get("/products-by-category", verifyToken, isAdmin, getProductsByCategory);
router.get("/sales-by-seller", verifyToken, isAdmin, getSalesBySeller);
router.get("/sales-by-month", verifyToken, isAdmin, getSalesByMonth);
router.get("/orders-by-status", verifyToken, isAdmin, getOrdersByStatus);

export default router;