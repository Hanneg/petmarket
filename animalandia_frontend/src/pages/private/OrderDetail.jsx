import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-toastify";

export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  
  const [order, setOrder] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  useEffect(() => {
    if (!user || user.role !== "client") return;

    const fetchOrder = async () => {
      setLoading(true);

      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}api/orders/${id}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });

        const data = await res.json();

        console.log("DATA ORDER DETAIL:", data);

        if (!res.ok) {
          throw new Error(data.message || "Pedido no encontrado");
        }

        setOrder(data.order);
        setItems(data.items);
      } catch (error) {
        console.error(error);
        toast.error("No se pudo cargar el pedido");
        navigate("/orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id, user, navigate]);

  if (loading) {
    return (
      <div className="container mt-5">
        <p className="text-center text-muted">Cargando pedidos...</p>
      </div>
    )
  }

  if (!order) return null;

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

  // Acciones del cliente
  const handleCancelOrder = async () => {
    if (!window.confirm("Seguro que deseas cancelar este pedido")) return;

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}api/orders/${order.id}/cancel`,
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
      
      toast.success("Pedido cancelado")
      setOrder((prev) => ({ ...prev, status: "CANCELLED"}))
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Marcar pedido como recibido (solo si está shipped)
  const handleCompleteOrder = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}api/orders/${order.id}/complete`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "No se pudo completar el pedido")
      }

      toast.success("Pedido marcado como recibido");
      setOrder((prev) => ({ ...prev, status: "COMPLETED"}));
    } catch (error) {
      toast.error(error.message);
    }
  };

  console.log("STATUS ACTUAL:", status);

  const normalizedStatus = status?.toUpperCase();

  return (
    <div className="container mt-5 mb-5 text-secondary">
      {/* Título */}
      <h3 className="text-center mb-4">📦 Detalle del Pedido #{order.id}</h3>

      {/* Card info del pedido */}
      <div className="card shadow mb-4">
        <div className="card-header">
          <h5 className="card-title mb-0">Información del pedido</h5>
        </div>
        <div className="card-content p-4">
          <div className="row mb-2">
            <div className="col s12 m4 fw-semibold">Fecha:</div>
            <div className="col s12 m8">{new Date(order.created_at).toLocaleDateString()}</div>
          </div>
          <div className="row mb-2">
            <div className="col s12 m4 fw-semibold">Estado:</div>
            <div className="col s12 m8">
              {(() => {
                  const badge = getStatusBadge(status);
                  return (
                    <span className={`badge ${badge.className}`}> 
                      {badge.text}
                    </span>
                  );
              })()}
            </div>
          </div>
          <div className="row mb-2">
            <div className="col s12 m4 fw-semibold">Dirección:</div>
            <div className="col s12 m8">{order.address}</div>
          </div>
          <div className="row mb-2">
            <div className="col s12 m4 fw-semibold">Método de pago:</div>
            <div className="col s12 m8">{order.payment_method}</div>
          </div>
          <div className="row">
            <div className="col s12 m4 fw-semibold">Total:</div>
            <div className="col s12 m8 fw-bold">${order.total}</div>
          </div>
        </div>
      </div>

      {/* Acciones del cliente */}
      <div className="text-center mt-4 d-flex justify-content-center gap-3">
        {normalizedStatus === "PENDING" && (
          <button
            className="btn red rounded-2"
            onClick={handleCancelOrder}
          >
            ❌ Cancelar pedido
          </button>
        )}

        {normalizedStatus === "SHIPPED" && (
          <button
            className="btn primary rounded-2"
            onClick={handleCompleteOrder}
          >
            📦 Marcar como recibido
          </button>
        )}
      </div>

      {/* Productos */}
      <div className="card shadow">
        <div className="card-header">
          <h5 className="card-title mb-0">🛒 Productos del pedido</h5>
        </div>
        <div className="card-content p-3">
          {items.length > 0 ? (
            <div className="table-responsive">
              <table className="table striped bordered hover">
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Cantidad</th>
                    <th>Precio unitario</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, index) => (
                    <tr key={index}>
                      <td>{item.product_name}</td>
                      <td>{item.quantity}</td>
                      <td>${item.price}</td>
                      <td>${(item.price * item.quantity)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-muted mb-0">Este pedido no tiene productos.</p>
          )}
        </div>
      </div>

      {/* Botón volver */}
      <div className="text-center mt-4">
        <button
          className="btn secondary rounded-2"
          onClick={() => navigate("/orders")}
        >
          ← Volver a mis pedidos
        </button>
      </div>
    </div>
  );
}