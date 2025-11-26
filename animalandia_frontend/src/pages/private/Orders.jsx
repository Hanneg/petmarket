import React, { useEffect, useState } from "react";
import { getMockOrders } from "../../utils/mockData";
import { useNavigate } from "react-router-dom";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // En un futuro esto será una petición al backend (axios)
    const data = getMockOrders();
    setOrders(data);
  }, []);

  return (
    <div className="container mt-5 mb-5">
      <h3 className="mb-4 text-center">📦 Mis pedidos</h3>

      {orders.length === 0 ? (
        <div className="text-center mt-5">
          <p>No tienes pedidos realizados 😿</p>
          <button
            className="btn secondary mt-3"
            onClick={() => navigate("/catalog")}
          >
            Ir al catálogo
          </button>
        </div>
      ) : (
        <div className="table-container">
          <table className="table striped">
            <thead>
              <tr>
                <th>ID Pedido</th>
                <th>Fecha</th>
                <th>Total</th>
                <th>Estado</th>
                <th>Detalle</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>#{order.id}</td>
                  <td>{order.date}</td>
                  <td>${order.total.toFixed(2)}</td>
                  <td>
                    <span
                      className={`badge ${
                        order.status === "Completado"
                          ? "primary"
                          : order.status === "Pendiente"
                          ? "accent"
                          : "red"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn secondary rounded-2"
                      onClick={() => navigate(`/orders/${order.id}`)}
                    >
                      Ver
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            className="btn primary rounded-2 mt-4"
            onClick={() => navigate("/profile")}
          >
            Ir a mi perfil
          </button>
        </div>
      )}
    </div>
  );
}