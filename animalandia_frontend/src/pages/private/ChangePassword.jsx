import React, { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

export default function ChangePassword() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  if (!user) return navigate("/login");

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones básicas
    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      toast.error("Todos los campos son obligatorios");
      return;
    }

    if (formData.newPassword.length < 6) {
      toast.error("La nueva contraseña debe tener al menos 6 caracteres");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("Las contraseñas no coinciden");
      return;
    }

    try {
      await axios.put(
        `http://localhost:3000/api/users/${user.id}/change-password`,
        {
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        }
      );

      toast.success("Contraseña cambiada. Iniciar sesión nuevamente");
      logout();
      navigate("/login");

    } catch (error) {
      console.error("CHANGE PASSWORD ERROR ", error);
      toast.error(
        error.response?.data?.message || "Error al cambiar contraseña"
      );
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: 500 }}>
      <h3 className="text-center mb-4">🔒 Cambiar Contraseña</h3>

      <div className="card p-4">
        <form onSubmit={handleSubmit}>

          <label>Contraseña actual</label>
          <input
            type="password"
            name="currentPassword"
            className="form-control mb-3"
            value={formData.currentPassword}
            onChange={handleChange}
          />

          <label>Nueva contraseña</label>
          <input
            type="password"
            name="newPassword"
            className="form-control mb-3"
            value={formData.newPassword}
            onChange={handleChange}
          />

          <label>Confirmar nueva contraseña</label>
          <input
            type="password"
            name="confirmPassword"
            className="form-control mb-3"
            value={formData.confirmPassword}
            onChange={handleChange}
          />

          <button className="btn primary full-width rounded-2" type="submit">
            Guardar cambios
          </button>

          <button
            className="btn secondary full-width mt-2 rounded-2"
            type="button"
            onClick={() => navigate("/profile")}
          >
            Cancelar
          </button>

        </form>
      </div>
    </div>
  );
}