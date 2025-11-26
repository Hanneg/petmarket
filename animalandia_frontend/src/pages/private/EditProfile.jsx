import React, { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function EditProfile() {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  if (!user) return navigate("/login");

  const [formData, setFormData] = useState({
    name: user.name || "",
    email: user.email || ""
  });

  const handleChange = (e) => {
    setFormData({ 
      ...formData, 
      [e.target.name]: e.target.value 
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const updatedUser = { ...user, ...formData };

    // Actualiza el contexto
    setUser(updatedUser);

    // Actualiza el localStorage mientras no hay backend
    localStorage.setItem("petmarket_user", JSON.stringify(updatedUser));

    toast.success("Perfil actualizado correctamente");
    navigate("/profile");
  };

  return (
    <div className="container mt-5" style={{ maxWidth: 500 }}>
      <h3 className="text-center mb-4">✏️ Editar Perfil</h3>

      <div className="card p-4">
        <form onSubmit={handleSubmit}>
          <label>Nombre</label>
          <input
            className="form-control mb-3"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />

          <label>Email</label>
          <input
            className="form-control mb-3"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />

          <button className="btn primary w-100 mr-2 rounded-2">Guardar cambios</button>

          <button
            type="button"
            className="btn secondary w-100 mt-2 rounded-2"
            onClick={() => navigate("/profile")}
          >
            Cancelar
          </button>
        </form>
      </div>
    </div>
  );
}