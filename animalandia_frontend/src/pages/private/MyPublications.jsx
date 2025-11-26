import React, { useState, useEffect } from "react";
import { mockProducts } from "../../utils/mockData";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function MyPublications() {
  const [publications, setPublications] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Luego se reemplazará por una petición al backend
    setPublications(mockProducts);
  }, []);

  const handleDelete = (id) => {
    setPublications(publications.filter((p) => p.id !== id));
    toast.success("Publicación eliminada correctamente 🗑️");
  };

  return (
    <div className="container mt-5 mb-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>📦 Mis publicaciones</h3>
        <button
          className="btn secondary"
          onClick={() => navigate("/create-publications")}
        >
          ➕ Nueva publicación
        </button>
      </div>

      {publications.length === 0 ? (
        <p>No tienes publicaciones activas 😿</p>
      ) : (
        <div className="table-container">
          <table className="table striped">
            <thead>
              <tr>
                <th>Imagen</th>
                <th>Nombre</th>
                <th>Categoría</th>
                <th>Precio</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {publications.map((product) => (
                <tr key={product.id}>
                  <td>
                    <img
                      src={product.image}
                      alt={product.name}
                      style={{ width: 60, borderRadius: "6px" }}
                    />
                  </td>
                  <td>{product.name}</td>
                  <td>{product.category}</td>
                  <td>${product.price.toFixed(2)}</td>
                  <td>
                    <button
                      className="btn small blue me-2"
                      onClick={() => toast.info("Función de edición en desarrollo")}
                    >
                      ✏️ Editar
                    </button>
                    <button
                      className="btn small red"
                      onClick={() => handleDelete(product.id)}
                    >
                      🗑️ Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}