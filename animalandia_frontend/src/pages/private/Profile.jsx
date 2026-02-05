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
  const [sellerOrders, setSellerOrders] = useState([]);
  const [sellerOrderSloading, setSellerOrdersLoading] = useState(false);
  const [publications, setPublications] = useState([]);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  // =========
  // CLIENT
  // =========
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

  useEffect(() => {
    if (!user || user.role !== "seller") return;

    const fetchSellerOrders = async () => {
      setOrdersLoading(true);
      try {
        const res = await fetch("http://localhost:3000/api/seller/orders", {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Error al obtener pedidos");
        }

        setSellerOrders(data);
      } catch (error) {
        console.error(error);
        toast.error("Error al cargar pedidos");
        setSellerOrders([]);
      } finally {
        setSellerOrdersLoading(false);
      }
    };

    fetchSellerOrders();
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

          <h5 className="text-secondary mb-2">📦 Últimos pedidos</h5>

          {sellerOrderSloading ? (
            <p className="text-muted">Cargando pedidos...</p>
          ) : sellerOrders.length === 0 ? (
            <p className="text-muted">No tienes pedidos aún</p>
          ) : (
            <table className="text-secondary table table-sm mt-3">
              <thead>
                <tr>
                  <th>Pedidos</th>
                  <th>Cliente</th>
                  <th>Total</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {sellerOrders.slice(0, 5).map(order => (
                  <tr key={order.order_id}>
                    <td>#{order.order_id}</td>
                    <td>{order.client_name}</td>
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
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <div className="d-flex justify-content-between mt-3">
            <Link to="/seller-orders" className="btn primary rounded-2 light mt-3 full-width">Ver todos</Link>
          </div>
        </div>
      </div>
    );
  }

  // ------------------- ADMINISTRADOR -------------------
  if (user.role === "admin") {
    navigate("/dashboard");
    return null;
  }

  return null;
}