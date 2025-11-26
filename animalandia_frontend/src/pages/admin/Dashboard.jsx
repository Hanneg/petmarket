import React, { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="dashboard-container">
      
      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-header">
          <h5>⚙️ Panel <br/>Administrativo</h5>
        </div>

        <ul className="sidebar-menu">
          <li>
            <Link to="/dashboard" className="sidebar-link">
              📊 Dashboard
            </Link>
          </li>

          <li>
            <Link to="/manage-users" className="sidebar-link">
              👥 Manejo de Usuarios
            </Link>
          </li>

          <li>
            <Link to="/manage-orders" className="sidebar-link">
              📦 Manejo de Pedidos
            </Link>
          </li>

          <li>
            <Link to="/manage-products" className="sidebar-link">
              🐾 Manejo de Productos
            </Link>
          </li>
        </ul>
      </aside>

      {/* Main content */}
      <main className="dashboard-content">
        <div className="card p-4">
          <h4>Bienvenido, {user?.name || "Administrador"}</h4>
          <p className="text-muted">Selecciona una sección del menú lateral.</p>
        </div>

        {/* Para más páginas internas */}
        <Outlet />
      </main>
    </div>
  );
}
