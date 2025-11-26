import React from "react";
import { Link, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="admin-dashboard">
      
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <h5>⚙️ Panel <br />Administrativo</h5>
        </div>

        <ul className="sidebar-menu">
          <li><Link to="" className="sidebar-link">📊 Dashboard</Link></li>
          <li><Link to="users" className="sidebar-link">👥 Manejo de Usuarios</Link></li>
          <li><Link to="orders" className="sidebar-link">📦 Manejo de Pedidos</Link></li>
          <li><Link to="products" className="sidebar-link">🐾 Manejo de Productos</Link></li>
        </ul>
      </aside>

      {/* Main content */}
      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
}
