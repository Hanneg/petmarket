import React from "react";
import { useCart } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Cart() {
    const { cartItems, updateQuantity, removeFromCart, total, clearCart } = useCart();
    const navigate = useNavigate();

    const handleCheckout = () => {
        if (cartItems.length === 0) {
            toast.warning("Tu carrito está vacío 😿");
            return;
        }
        navigate("/checkout");
    };

    return (
        <div className="container mt-5 mb-5">
            <div className="text-center mb-4 text-secondary">
                <h3 className="fw-bold">🛒 Tu carrito</h3>
                <p className="text-muted">Revisa tus productos antes de finalizar la compra</p>
            </div>

            {cartItems.length === 0 ? (
                <div className="text-center mt-5 text-secondary">
                    <p className="flow-text">Tu carrito está vacío 😿</p>
                    <button className="btn primary mt-3 rounded-2" onClick={() => navigate("/catalog")}>
                        <i className="iconify" data-icon="mdi:shopping-outline"></i> Ver productos
                    </button>
                </div>
            ) : (
                <>
                    <div className="card p-3 mb-4 shadow-1 hoverable">
                        <div className="responsive-table">
                            <table className="table striped centered">
                                <thead>
                                    <tr className="text-secondary">
                                        <th>Producto</th>
                                        <th>Precio</th>
                                        <th>Cantidad</th>
                                        <th>Subtotal</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cartItems.map((item) => (
                                        <tr key={item.id}>
                                            <td>
                                                <div className="d-flex align-items-center">
                                                    {item.image && (
                                                        <img
                                                            src={item.image}
                                                            alt={item.name}
                                                            className="rounded mr-2"
                                                            style={{ width: "60px", height: "60px", objectFit: "cover" }}
                                                        />
                                                    )}
                                                    <span className="fw-bold text-secondary">{item.name}</span>
                                                </div>
                                            </td>
                                            <td className="text-secondary">${item.price.toFixed(2)}</td>
                                            <td>
                                                <div className="cart-qty-wrapper">
                                                    <button
                                                        className="qty-btn"
                                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                        disabled={item.quantity <= 1}
                                                    >
                                                        -
                                                    </button>
                                                    <span className="qty-value text-secondary">{item.quantity}</span>
                                                    <button
                                                        className="qty-btn"
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </td>
                                            <td className="text-secondary">${(item.price * item.quantity).toFixed(2)}</td>
                                            <td>
                                                <button
                                                    className="btn small hover lighten-1 text-background rounded-2"
                                                    onClick={() => removeFromCart(item.id)}
                                                    title="Eliminar producto"
                                                >
                                                    <i className="iconify" data-icon="mdi:delete-outline">X</i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Total y botones */}
                    <div className="container">
                        <div className="grix xs1 sm2 md2 between vcenter">
                            <div className="col">
                                <h5 className="fw-bold text-secondary">Total: ${total.toFixed(2)}</h5>
                            </div>
                            <div className="col text-right text-center-xs">
                                <button className="btn secondary light me-2 mr-2 rounded-2" onClick={clearCart}>
                                    <i className="iconify" data-icon="mdi:cart-remove"></i> Vaciar carrito
                                </button>
                                <button className="btn primary rounded-2" onClick={handleCheckout}>
                                    <i className="iconify" data-icon="mdi:credit-card-outline"></i> Ir al checkout
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}