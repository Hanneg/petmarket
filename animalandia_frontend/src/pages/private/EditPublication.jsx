import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { mockProducts } from "../../utils/mockData";
import { toast } from "react-toastify";

export default function EditPublication() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    description: "",
    image: ""
  });

  // Cargar producto por ID
  useEffect(() => {
    const found = mockProducts.find((item) => item.id === Number(id));
    if (found) {
      setProduct(found);
      setFormData(found);
    }
  }, [id]);

  // Manejar cambios en inputs de texto/number/textarea
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Manejar envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();

    // Actualizar mockProducts en memoria
    const index = mockProducts.findIndex((p) => p.id === product.id);
    if (index !== -1) {
      mockProducts[index] = { ...formData, id: product.id };
    }

    toast.success("Publicación actualizada (modo mock)");
    navigate("/my-publications");
  };

  if (!product) return <p className="text-center mt-5">Cargando...</p>;

  return (
    <div className="container mt-5" style={{ maxWidth: "600px" }}>
      <div className="card p-4">
        <h3 className="text-secondary mb-4">✏️ Editar publicación</h3>

        <form onSubmit={handleSubmit}>
          <label>Nombre</label>
          <input
            type="text"
            className="form-control mb-3"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />

          <label>Categoría</label>
          <input
            type="text"
            className="form-control mb-3"
            name="category"
            value={formData.category}
            onChange={handleChange}
          />

          <label>Precio</label>
          <input
            type="number"
            className="form-control mb-3"
            name="price"
            value={formData.price}
            onChange={handleChange}
          />

          <label>Descripción</label>
          <textarea
            className="form-control mb-3"
            rows="4"
            name="description"
            value={formData.description}
            onChange={handleChange}
          ></textarea>

          <label>Imagen</label>
          <input
            type="file"
            className="form-control mb-3"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                const reader = new FileReader();
                reader.onloadend = () => {
                  setFormData({ ...formData, image: reader.result });
                };
                reader.readAsDataURL(file);
              }
            }}
          />

          {formData.image && (
            <img
              src={formData.image}
              alt="preview"
              style={{
                width: "200px",
                borderRadius: "8px",
                marginBottom: "15px",
              }}
            />
          )}
          <div className="d-flex">
            <button 
                className="btn primary w-100 rounded-2 mr-2" 
                type="submit"
            >
                Guardar cambios
            </button>
            <button
                type="button"
                className="btn secondary w-100 rounded-2"
                onClick={() => navigate("/view-publication/" + id)}
            >
                Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}