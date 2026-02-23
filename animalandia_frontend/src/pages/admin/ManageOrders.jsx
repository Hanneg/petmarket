import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";

export default function ManageOrders() {
  const [viewOrder, setViewOrder] = useState(null);
  const [editOrder, setEditOrder] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);  

  const { user } = useAuth();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}api/admin/orders?page=${page}&limit=10`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );

        const data = await res.json();
        setOrders(data.data);
        setTotalPages(data.totalPages);
      } catch (error) {
        toast.error("Error al cargar pedidos");
      }
    };

    fetchOrders();
  }, [page]);

  const handleEditSave = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}api/admin/orders/${editOrder.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({ status: editOrder.status })
        }
      );

      if (!res.ok) throw new Error();

      setOrders((prev) => 
        prev.map((o) => 
          o.id === editOrder.id ? { ...o, status: editOrder.status } : o
        )
      );

      toast.success("Estado actualizado");
      setEditOrder(null);
    } catch {
      toast.error("No se pudo actualizar el pedido");
    }
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}api/admin/orders/${confirmDelete.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${user.token}`,
          }
        }
      );

      if (!res.ok) throw new Error();

      setOrders((prev) => 
        prev.filter((o) => o.id !== confirmDelete.id)
      );

      toast.success("Pedido eliminado");
      setConfirmDelete(null);
    } catch {
      toast.error("No se pudo eliminar el pedido");
    }
  };

  return (
    <div className="manage-orders-wrapper text-secondary">
      <h3 className="mb-4">📦 Gestión de pedidos</h3>

      <div className="orders-table-wrapper">
        <table className="table striped">
          <thead>
            <tr>
              <th>ID</th>
              <th>Fecha</th>
              <th>Cliente</th>
              <th>Total</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td data-label="ID">#{order.id}</td>
                <td>{new Date(order.created_at).toLocaleDateString()}</td>
                <td data-label="Cliente">{order.client}</td>
                <td data-label="Total">${order.total}</td>
                <td>
                  {(() => {
                    const status = typeof order.status === "string"
                        ? order.status
                        : order.status?.name;

                    const getStatusBadge = (status) => {
                      switch (status) {
                        case "PENDING":
                          return { text: "Pendiente", className: "yellow" };
                        case "APPROVED":
                          return { text: "Aprobado", className: "blue" };
                        case "SHIPPED":
                          return { text: "Enviado", className: "accent" };
                        case "COMPLETED":
                          return { text: "Completado", className: "green" };
                        case "CANCELLED":
                          return { text: "Cancelado", className: "red" };
                        default:
                          return { text: status, className: "gray" };
                      }
                    };

                    const badge = getStatusBadge(status);

                    return (
                      <span className={`badge ${badge.className}`}> 
                        {badge.text}
                      </span>
                    );
                  })()}
                </td>
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
                  {(() => {
                    const status = 
                      typeof order.status === "string"
                        ? order.status
                        : order.status?.name

                    return status === "CANCELLED" ? (
                      <button
                        className="btn small red rounded-2"
                        onClick={() => setConfirmDelete(order)}
                      >
                        Eliminar
                      </button>
                    ) : null;
                  })()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-2 text-secondary flex">
        <button
          className="mr-2 primary btn btn-small rounded-2"
          disabled = {page === 1}
          onClick={() => setPage(page - 1)} 
        >
          ◀ Anterior
        </button>

        <span className="text-center">Página {page} de {totalPages}</span>

        <button
          className="ml-2 primary btn btn-small rounded-2"
          disabled = {page === totalPages}
          onClick={() => setPage(page + 1)}
        >
          Siguiente ▶
        </button>
      </div>

      {/* ---------- VER PEDIDO ---------- */}
      {viewOrder && (
        <div className="modal-overlay text-secondary">
          <div className="modal-box">
            <h4>📦 Pedido #{viewOrder.id}</h4>
            <p><b>Fecha: </b>{new Date(viewOrder.created_at).toLocaleDateString()}</p>
            <p><b>Cliente: </b>{viewOrder.client}</p>
            <p><b>Total: </b> ${viewOrder.total}</p>
            <p><b>Dirección: </b>{viewOrder.address}</p>
            <p><b>Método de pago: </b>{viewOrder.payment_method}</p>
            <p><b>Estado: </b> 
              {(() => {
                const status = typeof viewOrder.status === "string"
                    ? viewOrder.status
                    : viewOrder.status?.name;

                const getStatusBadge = (status) => {
                  switch (status) {
                    case "PENDING":
                      return { text: "Pendiente", className: "yellow" };
                    case "APPROVED":
                      return { text: "Aprobado", className: "blue" };
                    case "SHIPPED":
                      return { text: "Enviado", className: "accent" };
                    case "COMPLETED":
                      return { text: "Completado", className: "green" };
                    case "CANCELLED":
                      return { text: "Cancelado", className: "red" };
                    default:
                      return { text: status, className: "gray" };
                  }
                };

                const badge = getStatusBadge(status);

                return (
                  <span className={`badge ${badge.className}`}> 
                    {badge.text}
                  </span>
                );
              })()}
            </p>
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
            <label className="mt-2">Estado</label>
            <select
              className="form-control"
              value={editOrder.status}
              onChange={(e) =>
                setEditOrder({ ...editOrder, status: e.target.value })
              }
            >
              <option value="PENDING">Pendiente</option>
              <option value="APPROVED">Aprovado</option>
              <option value="SHIPPED">Enviado</option>
              <option value="CANCELLED">Cancelado</option>
              <option value="COMPLETED">Completado</option>
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