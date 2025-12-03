import React, { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false); // <-- estado sidebar móvil

  return (
    <div className="admin-dashboard">

      {/* Botón hamburguesa (solo visible en móvil) */}
      <button 
        className="sidebar-toggle"
        onClick={() => setOpen(!open)}
      >
        ☰
      </button>

      {/* Sidebar */}
      <aside className={`admin-sidebar ${open ? "open" : ""}`}>
        <div className="sidebar-header">
          <h5>⚙️ Panel <br />Administrativo</h5>
        </div>

        <ul className="sidebar-menu">
          <li><Link to="" className="sidebar-link" onClick={() => setOpen(false)}>📊 Dashboard</Link></li>
          <li><Link to="users" className="sidebar-link" onClick={() => setOpen(false)}>👥 Manejo de Usuarios</Link></li>
          <li><Link to="orders" className="sidebar-link" onClick={() => setOpen(false)}>📦 Manejo de Pedidos</Link></li>
          <li><Link to="products" className="sidebar-link" onClick={() => setOpen(false)}>🐾 Manejo de Productos</Link></li>
        </ul>
      </aside>

      {/* Main content */}
      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
}