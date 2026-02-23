import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { toast } from "react-toastify";

export default function ViewPublication() {
  const { id } = useParams();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPublication = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}api/seller/publications/${id}`, 
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Error al cargar publicación");
        }

        setProduct(data);
      } catch (error) {
        console.error(error);
        toast.error("No se pudo cargar la publicación");
        navigate("/my-publications");
      } finally {
        setLoading(false);
      }
    };

    if (user?.role === "seller") {
      fetchPublication();
    }
  }, [id, user, navigate]);

  if (!product) return <p className="text-center mt-5">Cargando...</p>;

  return (
    <div className="container mt-5 mb-4" style={{ maxWidth: "900px" }}>
      <h3 className="text-secondary mb-4 text-center">Ver publicación</h3>
      <div className="viewpub-card shadow-1 p-4">
        <div className="viewpub-grid">
          {/* Imagen */}
          <div className="viewpub-image-wrapper">
            <img
              src={product.image}
              alt={product.name}
              className="viewpub-image"
            />
          </div>

          {/* Información */}
          <div className="viewpub-info">
            <h2 className="fw-bold text-secondary">{product.name}</h2>
            <p className="text-accent font-w600">{product.description}</p>
            <p className="text-accent font-w600">{product.category_name}</p>
            <h3 className="price mt-3 mb-3">${product.price}</h3>
            <p className="text-accent font-w600">Stock: {product.stock}</p>
            <div className="viewpub-actions">
              <button
                className="btn primary rounded-2"
                onClick={() => navigate(`/edit-publication/${product.id}`)}
              >
                Editar publicación
              </button>

              <button
                className="btn secondary rounded-2"
                onClick={() => navigate("/my-publications")}
              >
                Volver a mis publicaciones
              </button>
            </div>
          </div>

        </div>

      </div>
      
    </div>
  );
}