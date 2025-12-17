import jwt from "jsonwebtoken";
import "dotenv/config";

export const verifyToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    if (!authHeader) return res.status(401).json({ message: "No token proporcionado" });

    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.DB_JWT, (err, decoded) => {
        if (err) return res.status(403).json({ message: "Token inválido" });
        req.user = decoded; // contiene id, email, role
        next();
    });
};

// Solo admin
export const isAdmin = (req, res, next) => {
    if (req.user.role !== "admin") return res.status(403).json({ message: "Requiere rol admin" });
    next();
};