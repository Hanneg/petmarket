import React, { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function SellerOrders() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!user || user.role !== "seller") {
            navigate("/login");
            return;
        }

        const fetchSellerOrders = async () => {
            setLoading(true);
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/seller/orders`, {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                });

                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.message || "Error al obtener pedidos")
                }

                setOrders(data);
            } catch (error) {
                console.error(error);
                toast.error("Error al cargar pedidos");
                setOrders([]);
            } finally {
                setLoading(false);
            }
        };

        fetchSellerOrders();
    }, [user, navigate]);

    const approveOrder = async (orderId) => {
        try {
            const res = await fetch(
                `${import.meta.env.VITE_API_URL}/api/seller/orders/${orderId}/approve`,
                {
                    method: "PATCH",
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                }
            );

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "No se pudo aprobar el pedido")
            }

            toast.success("Pedido aprobado")
            setOrders((prev) =>
                prev.map((o) => 
                    o.order_id === orderId ? { ...o, status: "APPROVED" } : o
                )
            );
        } catch (error) {
            toast.error(error.message);
        }
    };

    const shipOrder = async (orderId) => {
        try {
            const res = await fetch(
                `${import.meta.env.VITE_API_URL}/api/seller/orders/${orderId}/ship`,
                {
                    method: "PATCH",
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                }
            );

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "No se pudo enviar el pedido");
            }

            toast.success("Pedido enviado");

            setOrders((prev) =>
                prev.map((o) =>
                    o.order_id === orderId ? { ...o, status: "SHIPPED" } : o
                )
            );
        } catch (error) {
            toast.error(error.message);
        }
    };

    const cancelOrder = async (orderId) => {
        if (!window.confirm("¿Seguro que deseas cancelar este pedido")) return;

        try {
            const res = await fetch(
                `${import.meta.env.VITE_API_URL}/api/seller/orders/${orderId}/cancel`,
                {
                    method: "PATCH",
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                }
            );

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "No se pudo cancelar el pedido");
            }

            toast.success("Pedido cancelado");

            setOrders((prev) => 
                prev.map((o) => 
                    o.order_id === orderId ? { ...o, status: "CANCELLED" } : o
                )
            );
        } catch (error) {
            toast.error(error.message);
        }
    };

    return (
        <div className="text-secondary container mt-5 mb-5">
            <h3 className="text-center mb-4">📦 Pedidos de mis productos</h3>

            {loading ? (
                <p className="text-center text-muted">Cargando pedidos ...</p>
            ) : orders.length === 0 ? (
                <div className="card p-4 text-center text-secondary">
                    <p>No tienes pedidos aún</p>
                    <p className="text-muted">(cuando un cliente compre tus productos aparecerán aquí)</p>
                </div>
            ) : (
                <div className="card p-4">
                    <table className="table striped">
                        <thead>
                            <tr>
                                <th>Pedidos</th>
                                <th>Fecha</th>
                                <th>Cliente</th>
                                <th>Stock</th>
                                <th>Pedido</th>
                                <th>Total</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(order => (
                                <tr key={order.order_item_id}>
                                    <td>#{order.order_id}</td>
                                    <td>{new Date(order.created_at).toLocaleDateString()}</td>
                                    <td>{order.client_name}</td>
                                    <td>{order.total_stock}</td>
                                    <td>{order.product_name}</td>
                                    <td>${order.seller_total}</td>
                                    <td>
                                        {(() => {
                                            const status = typeof order.status === "string"
                                                ? order.status
                                                : order.status?.name;

                                            const getStatusBadge = (status) => {
                                                switch (status) {
                                                    case "PENDING":
                                                        return { text: "Pendiente", className: "yellow" };
                                                    case "APPROVED":
                                                        return { text: "Aprobado", className: "blue" };
                                                    case "SHIPPED":
                                                        return { text: "Enviado", className: "accent" };
                                                    case "COMPLETED":
                                                        return { text: "Completado", className: "green" };
                                                    case "CANCELLED":
                                                        return { text: "Cancelado", className: "red" };
                                                    default:
                                                        return { text: status, className: "gray" };
                                                }
                                            };

                                            const badge = getStatusBadge(status);

                                            return (
                                                <span className={`badge ${badge.className}`}> 
                                                    {badge.text}
                                                </span>
                                            );
                                        })()}
                                    </td>
                                    <td>
                                        <div className="d-flex gap-2">
                                            {order.status === "PENDING" && (
                                                <>
                                                    <button
                                                        className="btn primary btn-small rounded-2 mr-2"
                                                        onClick={() => approveOrder(order.order_id)}
                                                    >
                                                        Aprobar
                                                    </button>

                                                    <button
                                                        className="btn red btn-small rounded-2"
                                                        onClick={() => cancelOrder(order.order_id)}
                                                    >
                                                        Cancelar
                                                    </button>
                                                </>
                                            )}

                                            {order.status === "APPROVED" && (
                                                <>
                                                    <button
                                                        className="btn accent btn-small rounded-2 mr-2"
                                                        onClick={() => shipOrder(order.order_id)}
                                                    >
                                                        Enviar
                                                    </button>

                                                    <button
                                                        className="btn red btn-small rounded-2"
                                                        onClick={() => cancelOrder(order.order_id)}
                                                    >
                                                        Cancelar
                                                    </button>
                                                </>
                                            )}

                                            {order.status === "SHIPPED" && (
                                                <button
                                                    className="btn red btn-small rounded-2"
                                                    onClick={() => cancelOrder(order.order_id)}
                                                >
                                                    Cancelar
                                                </button>
                                            )}

                                            {order.status === "COMPLETED" && (
                                                <span
                                                    className="text-gray"
                                                >
                                                    Pedido completado
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Botón volver */}
            <button
                className="btn primary rounded-2 me-3 mt-2"
                onClick={() => navigate("/profile")}
            >
                ⬅ Volver al Perfil
            </button>
        </div>
    );
}