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
    <div className="container mt-5 mb-5" style={{ maxWidth: "1000px" }}>
      <div className="publication-header">
        <h3 className="text-secondary">📦 Mis publicaciones</h3>
        <button
          className="btn accent rounded-2"
          onClick={() => navigate("/create-publications")}
        >
          + Nueva publicación
        </button>
      </div>

      {publications.length === 0 ? (
        <p>No tienes publicaciones activas 😿</p>
      ) : (
        <div className="table-responsive">
          <table className="table striped">
            <thead>
              <tr>
                <th>Imagen</th>
                <th>Nombre</th>
                <th>Categoría</th>
                <th>Precio</th>
                <th style={{ width: "240px" }}>Acciones</th>
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
                    <div className="publications-table">
                      <button
                        className="btn small primary rounded-2 mr-1"
                        onClick={() => navigate(`/view-publication/${product.id}`)}
                      >
                        Ver
                      </button>
                      <button
                        className="btn small secondary rounded-2 mr-1"
                        onClick={() => navigate(`/edit-publication/${product.id}`)}
                      >
                        Editar
                      </button>
                      <button
                        className="btn small red rounded-2"
                        onClick={() => handleDelete(product.id)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            className="btn primary rounded-2 me-3 mt-2"
            onClick={() => navigate("/profile")}
          >
            ⬅ Volver al Perfil
          </button>
        </div>
      )}
    </div>
  );
}