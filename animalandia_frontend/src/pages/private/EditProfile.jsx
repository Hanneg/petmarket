import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

export default function EditProfile() {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  // Redirigir si no hay usuario
  useEffect(() => {
    if (!user) return navigate("/login");
  }, [user, navigate]);  

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || ""
  });

  const handleChange = (e) => {
    setFormData({ 
      ...formData, 
      [e.target.name]: e.target.value 
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // PUT al backend con el token
      const storedUser = JSON.parse(localStorage.getItem("user"));
      const token = storedUser?.token;

      if (!token) {
        toast.error("No hay token de autenticación");
        return;
      }

      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/users/${user.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      // Actualizar contexto y localStorage con los datos que devuelve el backend
      setUser({ ...user, ...response.data });
      localStorage.setItem("user", JSON.stringify({ ...user, ...response.data, token }));

      toast.success("Perfil actualizado correctamente");
      navigate("/profile");
    } catch (error) {
      console.error("EDIT USER ERROR ", error);
      toast.error(error.response?.data?.message || "Error actualizando perfil");
    }
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