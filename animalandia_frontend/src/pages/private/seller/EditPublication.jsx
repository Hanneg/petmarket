import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { toast } from "react-toastify";

export default function EditPublication() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [categories, setCategories] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    category_id: "",
    price: "",
    stock: "",
    description: "",
    image_url: ""
  });

  // Cargar producto por ID
  useEffect(() => {
    const fetchPublication = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/seller/publications/${id}`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message);
        }

        setProduct(data);
        setFormData({
          name: data.name,
          description: data.description,
          price: data.price,
          stock: data.stock,
          category_id: data.category_id,
          image_url: data.image_url,
        });
      } catch (error) {
        toast.error("No se pudo cargar la publicación");
        navigate("/my-publications");
      }
    };

    if (user?.role === "seller") {
      fetchPublication();
    }
  }, [id, user]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/categories");
        const data = await res.json();

        if (!res.ok) {
          throw new Error("Error al cargar categorías");
        }

        setCategories(data);
      } catch (error) {
        toast.error("No se pudieron cargar las categorías");
      }
    };

    fetchCategories();
  }, []);

  // Manejar cambios en inputs de texto/number/textarea
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`http://localhost:3000/api/seller/publications/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }

      toast.success("Publicación actualizada correctamente");
      navigate("/my-publications");
    } catch (error) {
      toast.error("Error al actualizar publicación");
    }
  };

  if (!product) return <p className="text-center mt-5">Cargando...</p>;

  return (
    <div className="container mt-5 text-secondary" style={{ maxWidth: "600px" }}>
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
          <select
            className="form-control mb-3"
            name="category_id"
            value={formData.category_id}
            onChange={handleChange}
          >
            <option value="">Selecciona una categoría</option>

            {categories.map((cat) => {
              return (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              );
            })}
          </select>

          <label>Precio</label>
          <input
            type="number"
            className="form-control mb-3"
            name="price"
            value={formData.price}
            onChange={handleChange}
          />

          <label>Stock</label>
          <input 
            type="number"
            min="0"
            className="form-control mb-3"
            name="stock"
            value={formData.stock}
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

          <label>Imagen (URL)</label>
          <input
            type="text"
            className="form-control mb-3"
            name="image_url"
            value={formData.image_url}
            onChange={handleChange}  
          />
          {formData.image_url && (
            <img 
              src={formData.image_url}
              alt="preview"
              style={{ width: "200px", borderRadius: "8px" }}
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
                onClick={() => navigate("/my-publications")}
            >
                Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}