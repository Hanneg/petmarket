import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const schema = yup.object().shape({
    address: yup.string().required("La dirección es obligatoria"),
    payment: yup.string().required("Selecciona un método de pago"),
});

export default function Checkout() {
    const { user } = useAuth();
    const { cartItems, total, clearCart } = useCart();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({ resolver: yupResolver(schema) });

    const onSubmit = async (data) => {
        try {
            if (!user?.token) {
                toast.error("Debes iniciar sesión para comprar");
                navigate("/login");
                return;
            }

            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/orders`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.token}`
                },
                body: JSON.stringify({
                    address: data.address,
                    payment_method: data.payment,
                    items: cartItems.map(item => ({
                        product_id: item.id,
                        product_name: item.name,
                        price: item.price,
                        quantity: item.quantity
                    }))
                }),
            });

            if (!res.ok) throw new Error("Error al crear la orden");

            toast.success("Compra confirmada 🎉");
            clearCart();
            navigate("/thankyou");

        } catch (error) {
            console.error(error);
            toast.error("Error al procesar la compra 😿")
        }
    };

    if (cartItems.length === 0) {
        return (
            <div className="container mt-5 text-center">
                <h4 className="text-secondary font-w800">No tienes productos en el carrito 😿</h4>
                <button className="btn secondary mt-3" onClick={() => navigate("/catalog")}>
                    Volver al catálogo
                </button>
            </div>
        )
    }

    return (
        <div className="container mt-5 mb-5">
            <h3 className="mb-4 text-center text-secondary">🧾 Finalizar compra</h3>

            <form onSubmit={handleSubmit(onSubmit)} className="card p-4 mx-auto" style={{ maxwidth: 600 }}>
                {/* Dirección */}
                <div className="form-field mb-3">
                    <label className="text-secondary">Dirección de envío</label>
                    <input 
                        type="text"
                        {...register("address")}
                        className="form-control"
                        placeholder="Ej: Calle 123, Ciudad"
                    />
                    <p className="text-danger">{errors.address?.message}</p>
                </div>

                {/* Método de pago */}
                <div className="form-field mb-3 text-secondary">
                    <label className="text-secondary">Método de pago</label>
                    <select {...register("payment")} className="form-control">
                        <option value="">Selecciona una opción</option>
                        <option value="tarjeta">Tarjeta de crédito</option>
                        <option value="transferencia">Transferencia bancaria</option>
                        <option value="efectivo">Pago en efectivo</option>
                    </select>
                    <p className="text-danger">{errors.payment?.message}</p>
                </div>

                {/* Resumen */}
                <h5 className="mt-4 text-secondary">Resumen del pedido</h5>
                <ul className="mb-3">
                    {cartItems.map((item) => (
                        <li key={item.id} className="text-secondary">
                            {item.name} x {item.quantity} - ${(item.price * item.quantity)} 
                        </li>
                    ))}
                </ul>
                <h5 className="text-secondary">Total: ${total}</h5>

                {/* Botón */}
                <button 
                    type="submit" 
                    className="btn secondary full-width mt-3 rounded-2"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "Procesando..." : "Confirmar compra"}
                </button>
            </form>
        </div>
    );
}