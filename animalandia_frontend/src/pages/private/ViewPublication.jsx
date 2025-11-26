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
    <div className="container mt-5" style={{ maxWidth: "900px" }}>
      <h3 className="text-secondary mb-4 text-center">Ver publicación</h3>
      <div className="card shadow-sm p-4">
        
        <div className="publication-container">
          <div className="publication-image card shadow-2 rounded-2" >
            {/* Imagen del producto */}
            <img
                src={product.image}
                alt={product.name}
                className="publication-image-img"
            />
          </div>

          {/* Información del producto */}
          <div className="publication-info text-secondary">
            <h2 className="fw-bold">{product.name}</h2>
            <p className="text-accent font-w600">{product.category}</p>
            <h4 className="mt-3 mb-3">${product.price}</h4>

            <p className="mt-3">{product.description || "Sin descripción"}</p>

            <div className="d-flex flex-column flex-sm-row mt-4 gap-2">
              <button
                className="btn primary rounded-2 mr-2"
                onClick={() => navigate(`/edit-publication/${product.id}`)}
              >
                Editar publicación
              </button>

              <button
                className="btn secondary flex-grow-1 rounded-2"
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