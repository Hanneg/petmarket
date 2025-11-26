import React from "react";
import { mockOrders } from "../../utils/mockData";

export default function ManageOrders() {
  return (
    <div className="container mt-5">
      <h3 className="mb-4">📦 Gestión de pedidos</h3>

      <table className="table striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Fecha</th>
            <th>Total</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {mockOrders.map((order) => (
            <tr key={order.id}>
              <td>#{order.id}</td>
              <td>{order.date}</td>
              <td>${order.total.toFixed(2)}</td>
              <td>{order.status}</td>
              <td>
                <button className="btn small blue me-2">Actualizar</button>
                <button className="btn small red">Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
