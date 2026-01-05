import React, { useContext, useEffect, useState } from "react";
// import { getMockOrders } from "../../utils/mockData";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-toastify";

export default function Orders() {
  const { user } = useContext(AuthContext); 
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  // ======================
  // PROTECCION
  // ======================
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  useEffect(() => {
    if (!user || user.role !== "client") return;

    const fetchOrders = async () => {
      setLoading(true);

      try {
        const res = await fetch("http://localhost:3000/api/orders", {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Error al obtener pedidos");
        }

        setOrders(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error(error);
        toast.error("No se pudieron cargar los pedidos");
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  return (
    <div className="container mt-5 mb-5 text-secondary">
      <h3 className="mb-4 text-center">📦 Mis pedidos</h3>

      {loading ? (
        <p className="text-center text-muted">Cargando pedidos...</p>
      ) : orders.length === 0 ? (
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
                  <td>{new Date(order.created_at).toLocaleDateString()}</td>
                  <td>${order.total}</td>
                  <td>
                    <span
                      className={`badge ${
                        order.status === "completed"
                          ? "green"
                          : order.status === "pending"
                          ? "yellow"
                          : "gray"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn primary rounded-2"
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