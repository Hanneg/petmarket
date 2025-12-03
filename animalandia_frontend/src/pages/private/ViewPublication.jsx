import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { mockProducts } from "../../utils/mockData";

export default function ViewPublication() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const found = mockProducts.find((item) => item.id === Number(id));
    setProduct(found);
  }, [id]);

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
            <p className="text-accent font-w600">{product.category}</p>

            <h3 className="price mt-3 mb-3">${product.price}</h3>

            <p className="description">
              {product.description || "Sin descripción disponible."}
            </p>

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