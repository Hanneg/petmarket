import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const schema = yup.object().shape({
  title: yup.string().required("El título es obligatorio"),
  description: yup.string().required("La descripción es obligatoria"),
  price: yup.number().positive().required("El precio es obligatorio"),
  category: yup.string().required("Selecciona una categoría"),
  image: yup.mixed().required("Sube una imagen del producto"),
});

export default function CreatePublication() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data) => {
    console.log("Nueva publicación:", data);
    toast.success("Publicación creada con éxito 🐾");
    reset();
    setTimeout(() => navigate("/my-publications"), 1500);
  };

  return (
    <div className="container mt-5 mb-5">
      <h3 className="text-center mb-4">🛍️ Crear nueva publicación</h3>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="card p-4 mx-auto"
        style={{ maxWidth: 600 }}
      >
        <div className="form-field mb-3">
          <label>Título</label>
          <input type="text" {...register("title")} className="form-control" />
          <p className="text-danger">{errors.title?.message}</p>
        </div>

        <div className="form-field mb-3">
          <label>Descripción</label>
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
          <select {...register("category")} className="form-control">
            <option value="">Selecciona una categoría</option>
            <option value="Perros">Perros</option>
            <option value="Gatos">Gatos</option>
            <option value="Accesorios">Accesorios</option>
            <option value="Comida">Comida</option>
          </select>
          <p className="text-danger">{errors.category?.message}</p>
        </div>

        <div className="form-field mb-3">
          <label>Imagen del producto</label>
          <input type="file" {...register("image")} className="form-control" />
          <p className="text-danger">{errors.image?.message}</p>
        </div>

        <button type="submit" className="btn secondary full-width">
          Guardar publicación
        </button>
      </form>
    </div>
  );
}