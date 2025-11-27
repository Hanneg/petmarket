import React, { useState } from "react";

const mockUsers = [
  { id: 1, name: "Juan Pérez", email: "juan@mail.com", role: "cliente" },
  { id: 2, name: "Ana López", email: "ana@mail.com", role: "vendedor" },
  { id: 3, name: "Carlos Ruiz", email: "admin@mail.com", role: "admin" },
];

export default function ManageUsers() {
  const [users, setUsers] = useState(mockUsers);
  const [selectedUser, setSelectedUser] = useState(null);
  const [action, setAction] = useState(null);

  const openModal = (user, actionType) => {
    setSelectedUser(user);
    setAction(actionType);
  };

  const closeModal = () => {
    setSelectedUser(null);
    setAction(null);
  };

  const handleDelete = () => {
    setUsers(users.filter((u) => u.id !== selectedUser.id));
    closeModal();
  };

  return (
    <div className="manage-users-wrapper">

      <h3 className="mb-4">👥 Gestión de usuarios</h3>

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
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
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

                  <button 
                    className="btn red btn-sm rounded-2"
                    onClick={() => openModal(user, "delete")}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ========== MODAL ========== */}
      {selectedUser && (
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
                <p>(Aquí luego pones el formulario de edición)</p>
              </>
            )}

            {action === "delete" && (
              <>
                <h4>🗑 Eliminar usuario</h4>
                <p>¿Estás seguro de eliminar a <b>{selectedUser.name}</b>?</p>

                <button className="btn red me-2 rounded-2 mr-1" onClick={handleDelete}>
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

    </div>
  );
}