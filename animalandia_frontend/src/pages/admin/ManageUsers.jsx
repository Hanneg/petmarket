import React from "react";

const mockUsers = [
  { id: 1, name: "Juan Pérez", email: "juan@mail.com", role: "cliente" },
  { id: 2, name: "Ana López", email: "ana@mail.com", role: "vendedor" },
  { id: 3, name: "Carlos Ruiz", email: "admin@mail.com", role: "admin" },
];

export default function ManageUsers() {
  return (
    <div className="container mt-5">
      <h3 className="mb-4">👥 Gestión de usuarios</h3>

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
          {mockUsers.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <button className="btn small blue me-2">Editar</button>
                <button className="btn small red">Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
