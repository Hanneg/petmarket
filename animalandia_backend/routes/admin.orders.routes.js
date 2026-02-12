import { Router } from "express";
import { verifyToken, isAdmin } from "../middlewares/auth.middleware.js";
import {
    getAllOrders,
    updateOrderStatus,
    deleteOrder
} from "../controllers/admin.orders.controller.js";

const router = Router();

router.get("/", verifyToken, isAdmin, getAllOrders)
router.patch("/:id", verifyToken, isAdmin, updateOrderStatus)
router.delete("/:id", verifyToken, isAdmin, deleteOrder)

export default router;