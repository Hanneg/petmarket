import React, { useState } from "react";
import { mockOrders } from "../../utils/mockData";

export default function ManageOrders() {
  const [viewOrder, setViewOrder] = useState(null);
  const [editOrder, setEditOrder] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [orders, setOrders] = useState(mockOrders);

  // Función para actualizar el pedido
  const handleEditSave = () => {
    const updated = orders.map((o) =>
      o.id === editOrder.id ? editOrder : o
    );
    setOrders(updated);
    setEditOrder(null);
  };

  // Función para eliminar un pedido
  const handleDelete = () => {
    const filtered = orders.filter((o) => o.id !== confirmDelete.id);
    setOrders(filtered);
    setConfirmDelete(null);
  };

  return (
    <div className="manage-orders-wrapper">
      <h3 className="mb-4">📦 Gestión de pedidos</h3>

      <div className="orders-table-wrapper">
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
            {orders.map((order) => (
              <tr key={order.id}>
                <td data-label="ID">#{order.id}</td>
                <td data-label="Fecha">{order.date}</td>
                <td data-label="Total">${order.total.toFixed(2)}</td>
                <td data-label="Estado">{order.status}</td>
                <td data-label="Acciones">
                  <button
                    className="btn small primary me-2 rounded-2 mr-1"
                    onClick={() => setViewOrder(order)}
                  >
                    Ver
                  </button>
                  <button
                    className="btn small secondary me-2 rounded-2 mr-1"
                    onClick={() => setEditOrder({ ...order })}
                  >
                    Actualizar
                  </button>
                  <button
                    className="btn small red rounded-2"
                    onClick={() => setConfirmDelete(order)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ---------- VER PEDIDO ---------- */}
      {viewOrder && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h4>📦 Pedido #{viewOrder.id}</h4>
            <p><b>Fecha:</b> {viewOrder.date}</p>
            <p><b>Total:</b> ${viewOrder.total.toFixed(2)}</p>
            <p><b>Estado:</b> {viewOrder.status}</p>
            <button
              className="btn secondary mt-3 rounded-2"
              onClick={() => setViewOrder(null)}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* ---------- EDITAR PEDIDO ---------- */}
      {editOrder && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h4>✏ Actualizar Pedido #{editOrder.id}</h4>

            <label>Fecha</label>
            <input
              type="date"
              className="form-control mb-1"
              value={editOrder.date}
              onChange={(e) =>
                setEditOrder({ ...editOrder, date: e.target.value })
              }
            />

            <label className="mt-2">Total</label>
            <input
              type="number"
              className="form-control mb-1"
              value={editOrder.total}
              onChange={(e) =>
                setEditOrder({ ...editOrder, total: Number(e.target.value) })
              }
            />

            <label className="mt-2">Estado</label>
            <select
              className="form-control"
              value={editOrder.status}
              onChange={(e) =>
                setEditOrder({ ...editOrder, status: e.target.value })
              }
            >
              <option value="pendiente">Pendiente</option>
              <option value="procesando">Procesando</option>
              <option value="completado">Completado</option>
              <option value="cancelado">Cancelado</option>
            </select>

            <div className="d-flex mt-3">
              <button
                className="btn primary me-2 rounded-2 mr-1"
                onClick={handleEditSave}
              >
                Guardar
              </button>
              <button
                className="btn secondary rounded-2"
                onClick={() => setEditOrder(null)}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------- ELIMINAR PEDIDO ---------- */}
      {confirmDelete && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h4>❗Eliminar pedido</h4>
            <p>¿Seguro que deseas eliminar el pedido #{confirmDelete.id}?</p>
            <button className="btn red me-2 rounded-2 mr-1" onClick={handleDelete}>
              Eliminar
            </button>
            <button
              className="btn secondary rounded-2"
              onClick={() => setConfirmDelete(null)}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}