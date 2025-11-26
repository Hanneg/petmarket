import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="container mt-5 text-center">
      <h1>404</h1>
      <h3>Página no encontrada</h3>
      <p>La página que buscas no existe.</p>
      <Link to="/" className="btn primary mt-3">
        Volver al inicio
      </Link>
    </div>
  );
}