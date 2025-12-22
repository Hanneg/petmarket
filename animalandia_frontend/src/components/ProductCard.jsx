import React from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx"; 
import { toast } from "react-toastify";

export default function ProductCard({ product }) {
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const { isAuthenticated } = useAuth(); // Para saber si el usuario esta logueado

    const handleAddToCart = () => {
        if (!isAuthenticated) {
            toast.info("Inicia sesión para agregar productos 🐾")
            navigate("/login");
            return;
        }
        addToCart(product);
        toast.success(`${product.name} agregado al carrito`);
    };

    return (
        <div className="card product-card shadow-1 p-3">
            <div className="product-img-wrapper">
                <img 
                    src={product.image_url}
                    alt={product.name}
                    className="responsive-img rounded mb-2"
                    style={{ height: "180px", objectFit: "cover", width: "100%"}}
                />
            </div>

            <div className="card-body">
                <h6 className="product-title mb-1 text-secondary">{product.name}</h6>
                <p className="product-description text-secondary" >{product.description}</p>
                <p className="product-price text-muted mb-1 text-accent font-w800">${product.price}</p>
            </div>

            <div className="d-flex justify-content-between mt-2">
                <button className="btn small primary mr-2 rounded-2" onClick={() => navigate(`/product/${product.id}`)}>
                    Ver más
                </button>
                <button className="btn small secondary rounded-2" onClick={handleAddToCart}>
                    Agregar
                </button>
            </div>
        </div>
    );
}