import express from "express";
import cors from "cors";
import morgan from "morgan";

import authRoutes from "./routes/auth.routes.js";
import usersRoutes from "./routes/users.routes.js";
import categoriesRoutes from "./routes/categories.routes.js";
import productsRoutes from "./routes/products.routes.js";
import orderRoutes from "./routes/order.routes.js";
import sellerRoutes from "./routes/seller.routes.js";
import adminOrderRoutes from "./routes/admin.orders.routes.js";
import adminProductsRoutes from "./routes/admin.products.routes.js";
import adminUsersRoutes from "./routes/admin.users.routes.js";
import adminDashboardRoutes from "./routes/admin.dashboard.routes.js";

const app = express();

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));
app.use(morgan("dev"));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/categories", categoriesRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/seller", sellerRoutes);
app.use("/api/admin/orders", adminOrderRoutes);
app.use("/api/admin/products", adminProductsRoutes);
app.use("/api/admin/users", adminUsersRoutes);
app.use("/api/admin/dashboard", adminDashboardRoutes);

export default app;