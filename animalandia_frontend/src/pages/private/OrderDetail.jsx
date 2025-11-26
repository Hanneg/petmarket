import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getMockOrders } from "../../utils/mockData";
import { toast } from "react-toastify";

export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const orders = getMockOrders();
    const found = orders.find((o) => Number(o.id) === Number(id));

    if (!found) {
      toast.error("El pedido no existe");
      navigate("/orders");
      return;
    }

    setOrder(found);
  }, [id, navigate]);

  if (!order)
    return (
      <div className="container mt-5">
        <p className="text-center text-secondary">Cargando pedido...</p>
      </div>
    );

  // Función para asignar color según estado
  const getBadgeColor = (status) => {
    switch (status) {
      case "Completado":
        return "success";
      case "Pendiente":
        return "warning";
      case "Cancelado":
        return "danger";
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
            <div className="col s12 m8">{order.date}</div>
          </div>
          <div className="row mb-2">
            <div className="col s12 m4 fw-semibold">Estado:</div>
            <div className="col s12 m8">
              <span className={`badge ${getBadgeColor(order.status)}`}>
                {order.status}
              </span>
            </div>
          </div>
          <div className="row">
            <div className="col s12 m4 fw-semibold">Total:</div>
            <div className="col s12 m8 fw-bold">${order.total.toFixed(2)}</div>
          </div>
        </div>
      </div>

      {/* Productos */}
      <div className="card shadow">
        <div className="card-header">
          <h5 className="card-title mb-0">🛒 Productos del pedido</h5>
        </div>
        <div className="card-content p-3">
          {order.items && order.items.length > 0 ? (
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
                  {order.items.map((item, index) => (
                    <tr key={index}>
                      <td>{item.name}</td>
                      <td>{item.quantity}</td>
                      <td>${item.price.toFixed(2)}</td>
                      <td>${(item.price * item.quantity).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-muted mb-0">Este pedido no tiene productos (mock).</p>
          )}
        </div>
      </div>

      {/* Botón volver */}
      <div className="text-center mt-4">
        <button
          className="btn secondary"
          onClick={() => navigate("/orders")}
        >
          ← Volver a mis pedidos
        </button>
      </div>
    </div>
  );
}