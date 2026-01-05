import { Router } from "express";
import { createOrder, getUserOrders, getOrderById } from "../controllers/order.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();

// Cliente crea una compra
router.post("/", verifyToken, createOrder);

// Cliente ve sus pedidos
router.get("/", verifyToken, getUserOrders);

// Cliente ve detalle de un pedido
router.get("/:id", verifyToken, getOrderById);

export default router;