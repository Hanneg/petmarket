import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useCart } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const schema = yup.object().shape({
    address: yup.string().required("La dirección es obligatoria"),
    payment: yup.string().required("Selecciona un método de pago"),
});

export default function Checkout() {
    const { cartItems, total, clearCart } = useCart();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({ resolver: yupResolver(schema) });

    const onSubmit = (data) => {
        // Aquí luego se enviará el backend
        console.log("Datos de compra:", data);

        toast.success("Compra confirmada 🎉")
        clearCart();

        // Redirigir a página de agradecimiento
        setTimeout(() => {
            navigate("/thankyou");
        }, 1500);
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
                        placeholder="Ej: Calle 123, Cuidad"
                    />
                    <p className="text-danger">{errors.address?.message}</p>
                </div>

                {/* Método de pago */}
                <div className="form-field mb-3">
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
                            {item.name} x {item.quantity} - ${(item.price * item.quantity).toFixed(2)} 
                        </li>
                    ))}
                </ul>
                <h5 className="text-secondary">Total: ${total.toFixed(2)}</h5>

                {/* Botón */}
                <button type="submit" className="btn secondary full-width mt-3 rounded-2">
                    Confirmar compra
                </button>
            </form>
        </div>
    );
}