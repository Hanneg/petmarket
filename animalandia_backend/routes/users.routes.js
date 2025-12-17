import { Router } from "express";
import { createUser } from "../controllers/users.controller.js";
import { verifyToken, isAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/", verifyToken, isAdmin, createUser);

export default router;