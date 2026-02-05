import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { 
    getSellerOrders, 
    getSellerPublications, 
    createPublication, 
    deletePublication, 
    getSellerPublicationById, 
    updateSellerPublication,
    approveSellerOrder,
    shipSellerOrder,
    cancelSellerOrder
} from "../controllers/seller.controller.js";

const router = Router();

// Pedidos del cliente
router.get("/orders", verifyToken, getSellerOrders);

// Publicaciones del vendedor
router.get("/publications", verifyToken, getSellerPublications);

// Ver una publicación
router.get("/publications/:id", verifyToken, getSellerPublicationById);

// Crear una publicación
router.post("/products", verifyToken, createPublication);

// Borrar una publicación
router.delete("/publications/:id", verifyToken, deletePublication);

// Editar publicación
router.put("/publications/:id", verifyToken, updateSellerPublication);

// Flujo de un pedido
router.patch("/orders/:id/approve", verifyToken, approveSellerOrder);
router.patch("/orders/:id/ship", verifyToken, shipSellerOrder)
router.patch("/orders/:id/cancel", verifyToken, cancelSellerOrder)

export default router;