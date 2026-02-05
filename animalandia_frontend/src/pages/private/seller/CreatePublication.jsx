import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { AuthContext } from "../../../context/AuthContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const schema = yup.object().shape({
  name: yup.string().required("El título es obligatorio"),
  description: yup.string().required("La descripción es obligatoria"),
  price: yup.number().positive().required("El precio es obligatorio"),
  category_id: yup.string().required("Selecciona una categoría"),
  stock: yup.number().min(1).required(),
  image_url: yup.string().required("Sube una imagen del producto"),
});

export default function CreatePublication() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit =  async (data) => {
    try {
      const payload = {
        name: data.name,
        description: data.description,
        price: Number(data.price),
        image_url: "https://via.placeholder.com/300",
        category_id: Number(data.category_id),
        stock: Number(data.stock)

      }
      
      const res = await fetch("http://localhost:3000/api/seller/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Error al crear publicación");
      }

      toast.success("Publicación creada con éxito 🎉")
      reset();
      navigate("/my-publications");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="container mt-5 mb-5 text-secondary">
      <h3 className="text-center mb-4">🛍️ Crear nueva publicación</h3>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="card p-4 mx-auto"
        style={{ maxWidth: 600 }}
      >
        <div className="form-field mb-3">
          <label>Nombre del producto</label>
          <input type="text" {...register("name")} className="form-control" />
          <p className="text-danger">{errors.name?.message}</p>
        </div>

        <div className="form-field mb-3">
          <label>Descripción del producto</label>
          <textarea
            {...register("description")}
            className="form-control"
            rows={3}
          ></textarea>
          <p className="text-danger">{errors.description?.message}</p>
        </div>

        <div className="form-field mb-3">
          <label>Precio</label>
          <input type="number" {...register("price")} className="form-control" />
          <p className="text-danger">{errors.price?.message}</p>
        </div>

        <div className="form-field mb-3">
          <label>Categoría</label>
          <select {...register("category_id")} className="form-control">
            <option value="">Selecciona una categoría</option>
            <option value="1">Accesorios</option>
            <option value="2">Perros</option>
            <option value="3">Gatos</option>
            <option value="4">Otros animalitos</option>
            <option value="5">Comida</option>
          </select>
          <p className="text-danger">{errors.category_id?.message}</p>
        </div>

        <div className="form-field mb-3">
          <label>Stock</label>
          <input type="number" {...register("stock")} className="form-control" />
          <p className="text-danger">{errors.stock?.message}</p>
        </div>

        <div className="form-field mb-3">
          <label>Imagen del producto</label>
          <input type="text" placeholder="URL de la imagen" {...register("image_url")} className="form-control" />
          <p className="text-danger">{errors.image_url?.message}</p>
        </div>
        <button 
          type="submit" 
          className="btn primary full-width rounded-2 mb-2"
        >
          Guardar publicación
        </button>
        <button
          className="btn secondary full-width rounded-2"
          onClick={() => navigate("/my-publications")}
        >
          Cancelar
        </button>
      </form>
    </div>
  );
}