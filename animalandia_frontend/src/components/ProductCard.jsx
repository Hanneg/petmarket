import React from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext"; 
import { toast } from "react-toastify";

export default function ProductCard({ product }) {
    const navigate = useNavigate();
    const { addToCart } = useCart();

    const handleAddToCart = () => {
        addToCart(product);
        toast.success(`${product.name} agregado al carrito`);
    };

    return (
        <div className="card shadow-1 p-3">
            <img 
                src={product.image}
                alt={product.name}
                className="responsive-img rounded mb-2"
                style={{ height: "180px", objectFit: "cover", width: "100%"}}
            />

            <h6 className="mb-1 text-secondary">{product.name}</h6>
            <p className="text-muted mb-1 text-accent font-w800">${product.price.toFixed(2)}</p>

            <div className="d-flex justify-content-between">
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