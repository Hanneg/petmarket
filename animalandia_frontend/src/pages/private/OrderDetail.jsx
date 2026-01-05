import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
//import { getMockOrders } from "../../utils/mockData";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-toastify";

export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  
  const [order, setOrder] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // =====================
  // PROTECCION
  // =====================
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  // =====================
  // FETCH DETALLE PEDIDO
  // =====================
  useEffect(() => {
    if (!user || user.role !== "client") return;

    const fetchOrder = async () => {
      setLoading(true);

      try {
        const res = await fetch(`http://localhost:3000/api/orders/${id}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });

        const data = await res.json();

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

  // Función para asignar color según estado
  const getBadgeColor = (status) => {
    switch (status) {
      case "completed":
        return "green";
      case "pending":
        return "yellow";
      case "cancelled":
        return "red";
      default:
        return "primary";
    }
  };

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
              <span className={`badge ${getBadgeColor(order.status)}`}>
                {order.status}
              </span>
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