import React from "react";
import { useNavigate } from "react-router-dom";

export default function ThankYou() {
  const navigate = useNavigate();

  return (
    <div className="container mt-5 text-center text-secondary">
      <h2>🎉 ¡Gracias por tu compra!</h2>
      <p className="mt-3 mb-4">
        Tu pedido ha sido procesado con éxito. Recibirás una confirmación por correo.
      </p>
      <button className="btn secondary rounded-2" onClick={() => navigate("/catalog")}>
        Volver al catálogo
      </button>
    </div>
  );
}
