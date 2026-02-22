import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-toastify";

export default function ManageUsers() {
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [action, setAction] = useState(null);
  const [editform, setEditform] = useState({
    name: "",
    email: "",
    role: "",
    password: ""
  })

  const openModal = (user, actionType) => {
    setSelectedUser(user);
    setEditform({
      name: user?.name || "",
      email: user?.email || "",
      role: user?.role || "",
      password: ""
    });
    setAction(actionType);
  };


  const closeModal = () => {
    setSelectedUser(null);
    setAction(null);
  };

  // Traer usuarios desde el backend
  useEffect(() => {
    const fetchUsers = async () => {
      if (!user || !user.token) return;
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/users`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        setUsers(response.data);
      } catch (error) {
        console.error("FETCH USERS ERROR ", error);
        toast.error(
          error.response?.data?.message || "Error al cargar los usuarios"
        );
      }
    };

    if (user?.role === "admin") fetchUsers();
  }, [user]);

  const handleDelete = async () => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/admin/users/${selectedUser.id}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      setUsers(users.filter(u => u.id !== selectedUser.id));

      toast.success("Usuario eliminado correctamente");
      closeModal();

    } catch (error) {
      console.error("DELETE USER ERROR ", error);
      toast.error(
        error.response?.data?.message || "Error eliminando usuario"
      );
    }
  };

  const handleEditUser = async () => {
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/admin/users/${selectedUser.id}`,
        editform,
        {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        }
      );

      // Actualizar lista sin recargar
      setUsers(
        users.map((u) => u.id === selectedUser.id ? res.data : u)
      );

      toast.success("Usuario actualizado correctamente");
      closeModal();
    } catch (error) {
      console.error("EDIT USER ERROR ", error)
      toast.error(error.response?.data?.message || "Error al editar usuario");
    }
  };

  return (
    <div className="manage-users-wrapper text-secondary">

      <h3 className="mb-4">👥 Gestión de usuarios</h3>
      <button className="btn primary mb-3 rounded-2"
        onClick={() => openModal(null, "create")}
      >
        ➕ Nuevo Usuario
      </button>

      {/* Tabla con scroll */}
      <div className="table-wrapper">
        <table className="table striped">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td data-label="ID">{user.id}</td>
                <td data-label="Nombre">{user.name}</td>
                <td data-label="Email">{user.email}</td>
                <td data-label="Rol">{user.role}</td>
                <td data-label="Acciones">
                  <button 
                    className="btn primary btn-sm me-2 mr-1 rounded-2"
                    onClick={() => openModal(user, "view")}
                  >
                    Ver
                  </button>

                  <button 
                    className="btn secondary btn-sm me-2 mr-1 rounded-2"
                    onClick={() => openModal(user, "edit")}
                  >
                    Editar
                  </button>

                  {user.role !== "admin" && (
                    <button 
                      className="btn red btn-sm rounded-2"
                      onClick={() => openModal(user, "delete")}
                    >
                      Eliminar
                    </button>    
                  )}
                  
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ========== MODAL ========== */}
      {selectedUser && (action === "view" || action === "edit" || action === "delete") && (
        <div className="modal-overlay">
          <div className="modal-box">

            {action === "view" && (
              <>
                <h4>👁 Ver usuario</h4>
                <p><b>ID:</b> {selectedUser.id}</p>
                <p><b>Nombre:</b> {selectedUser.name}</p>
                <p><b>Email:</b> {selectedUser.email}</p>
                <p><b>Rol:</b> {selectedUser.role}</p>
              </>
            )}

            {action === "edit" && (
              <>
                <h4>✏️ Editar usuario</h4>
                <label>Nombre</label>

                <input
                  className="form-control mb-2"
                  value={editform.name}
                  onChange={(e) => setEditform({ ...editform, name: e.target.value })}
                />

                <label>Email</label>
                <input
                  className="form-control mb-2"
                  value={editform.email}
                  onChange={(e) => setEditform({ ...editform, email: e.target.value })}
                />

                {/* 🔒 ROL: solo si NO es admin */}
                {selectedUser.role !== "admin" && (
                  <>
                    <label>Rol</label>
                    <select
                      className="form-control mb-2"
                      value={editform.role}
                      onChange={(e) => setEditform({ ...editform, role: e.target.value })}
                    >
                      <option value="client">Cliente</option>
                      <option value="seller">Vendedor</option>
                      <option value="admin">Administrador</option>
                    </select>
                  </>
                )}

                {/* Mensaje informativo */}
                {selectedUser.role === "admin" && (
                  <p className="text-muted">
                    El rol de administrador no puede modificarse
                  </p>
                )}

                <label>Nueva contraseña (opcional)</label>
                <input
                  type="password"
                  className="form-control mb-3"
                  value={editform.password}
                  onChange={(e) => setEditform({ ...editform, password: e.target.value })}
                />

                <button
                  className="btn primary w-100 rounded-2 mr-2"
                  onClick={handleEditUser}
                >
                  Guardar cambios
                </button>
              </>
            )}

            {action === "delete" && (
              <>
                <h4>🗑 Eliminar usuario</h4>
                <p>¿Estás seguro de eliminar a <b>{selectedUser.name}</b>?</p>

                <button className="btn red me-2 rounded-2 mr-2" onClick={handleDelete}>
                  Sí, eliminar
                </button>
              </>
            )}

            <button className="btn secondary mt-3 rounded-2" onClick={closeModal}>
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* ====================== MODAL Crear Usuario ============================== */}
      {action === "create" && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h4>➕ Crear Nuevo Usuario</h4>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const form = e.target;
                const name = form.name.value;
                const email = form.email.value;
                const password = form.password.value;
                const role = form.role.value;

                try {
                  const res = await axios.post(
                    `${import.meta.env.VITE_API_URL}/api/admin/users`,
                    { name, email, password, role },
                    { headers: { Authorization: `Bearer ${user.token}` } }
                  );

                  toast.success("Usuario creado correctamente");
                  setUsers([...users, res.data]);
                  closeModal();
                } catch (error) {
                  console.error("CREATE USER ERROR ", error);
                  toast.error(error.response?.data?.message || "Error creando usuario");
                }
              }}
            >
              <label>Nombre</label>
              <input name="name" type="text" className="form-control mb-2" required />

              <label>Email</label>
              <input name="email" type="email" className="form-control mb-2" required />

              <label>Contraseña</label>
              <input name="password" type="password" className="form-control mb-2" required />

              <label>Rol</label>
              <select name="role" className="form-control mb-3" required>
                <option value="">Seleccionar rol</option>
                <option value="admin">Admin</option>
                <option value="seller">Vendedor</option>
                <option value="client">Cliente</option>
              </select>

              <button className="btn primary w-100 rounded-2 mr-2" type="submit">Crear</button>
              <button type="button" className="btn secondary w-100 mt-2 rounded-2" onClick={closeModal}>Cancelar</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}