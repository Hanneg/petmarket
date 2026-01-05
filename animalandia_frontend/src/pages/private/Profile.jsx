import React, { useContext, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-toastify";

export default function Profile() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // Client
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  
  // Seller
  const [publications, setPublications] = useState([]);

  // =======================
  // PROTECCIÓN GENENRAL
  // =======================
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  // =======================
  // CLIENT -> Pedidos
  // =======================
  useEffect(() => {
    if (!user || user.role !== "client") return;

    const fetchOrders = async () => {
      setOrdersLoading(true);

      try {
        const res = await fetch("http://localhost:3000/api/orders", {
          headers: {
            Authorization: `Bearer ${user.token}`
          },
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Error al obtener pedidos");
        }

        setOrders(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error(error);
        toast.error("Error al cargar pedidos");
        setOrders([]);
      } finally {
        setOrdersLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  if (!user) return <p>No has iniciado sesión</p>

  // Cliente
  if (user?.role === "client") {
    return (
      <div className="container mt-5">
        <h3 className="text-center mb-4">👤 Mi Perfil</h3>

        <div className="card p-4 mx-auto" style={{ maxWidth: 600 }}>
          <div className="text-center mb-3">
            <img
              src="https://i.pravatar.cc/100"
              alt="avatar"
              className="rounded-circle mb-2"
            />
            <h5>{user.name}</h5>
            <p className="text-muted">{user.email}</p>
            <span className="badge blue">Cliente</span>
          </div>

          <div className="profile-btn-container">
            <button 
              className="btn primary rounded-2"
              onClick={() => navigate("/edit-profile")}
            >
                Editar Perfil
            </button>
            <button 
              className="btn secondary rounded-2"
              onClick={() => navigate("/change-password")}  
            >
              Cambiar Contraseña
            </button>
          </div>

          <h5 className="mb-2">🛍️ Últimos pedidos</h5>

          {ordersLoading ? (
            <p className="text-muted">Cargando pedidos...</p>
          ) : orders.length === 0 ? (
            <p className="text-muted">No tienes pedidos aún.</p>
          ) : (
            <table className="table table-sm mt-3">
              <thead>
                <tr>
                  <th>N° Pedido</th>
                  <th>Total</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 5).map((order) => (
                <tr key={order.id}>
                  <td>#{order.id}</td>
                  <td>${order.total}</td>
                  <td>
                    <span className={`badge ${
                      order.status === "completed"
                        ? "green"
                        : order.status === "pending"
                        ? "yellow"
                        : "gray"
                    }`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}  
              </tbody>
            </table>
          )}
          <Link to="/orders" className="btn primary rounded-2 light mt-3 full-width">
            Ver todos los pedidos
          </Link>
      </div>
    </div>
    );
  }

  // Vendedor
  if (user.role === "seller") {
    return (
      <div className="container mt-5">
        <h3 className="text-center mb-4">👤 Mi Perfil</h3>

        <div className="card p-4 mx-auto" style={{ maxWidth: 650 }}>
          <div className="text-center mb-3">
            <img src="https://i.pravatar.cc/100" className="rounded-circle mb-2" />
            <h5>{user.name}</h5>
            <p className="text-muted">{user.email}</p>
            <span className="badge green">Vendedor</span>
          </div>

          <div className="profile-btn-container">
            <button 
              className="btn primary rounded-2"
              onClick={() => navigate("/edit-profile")}
            >
              Editar Perfil
            </button>
            <button 
              className="btn secondary rounded-2"
              onClick={() => navigate("/change-password")
              }
            >
              Cambiar Contraseña
            </button>
          </div>

          <h5 className="mb-2">📦 Últimas publicaciones</h5>

          {publications.length === 0 ? (
            <p className="text-muted">No tienes publicaciones aún.</p>
          ) : (
            <ul className="list">
              {publications.slice(0, 3).map((pub) => (
                <li key={pub.id} className="list-item">
                  {pub.title} — {pub.date}
                </li>
              ))}
            </ul>
          )}

          <div className="d-flex justify-content-between mt-3">
            <Link to="/my-publications" className="btn primary rounded-2 light mr-3">Ver todas</Link>
            <Link to="/create-publications" className="btn secondary rounded-2">Crear publicación</Link>
          </div>
        </div>
      </div>
    );
  }

  // ------------------- ADMINISTRADOR -------------------
  if (user.role === "Admin") {
    navigate("/dashboard");
    return null;
  }

  return null;
}