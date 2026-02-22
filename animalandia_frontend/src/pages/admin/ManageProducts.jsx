import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";

export default function ManageProducts() {
  const [products, setProducts] = useState([]);
  const [viewProduct, setViewProduct] = useState(null);
  const [editProduct, setEditProduct] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [categories, setCategories] = useState([]);

  const { user } = useAuth();

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/products`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      setProducts([]);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/categories`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      const data = await res.json();
      setCategories(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      setCategories([]);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [user.token]);

  const handleEditSave = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/products/${editProduct.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify({
          name: editProduct.name,
          price: Number(editProduct.price),
          stock: Number(editProduct.stock),
          image_url: editProduct.image_url,
          category_id: Number(editProduct.category_id),
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        toast.error(error.message || "Error al actualizar producto");
        return;
      }

      await fetchProducts();

      setEditProduct(null);
      toast.success("Producto actualizado correctamente");
    } catch (error) {
      console.error(error);
      toast.error("Error al actualizar producto");
    }
  };

  const handleToggleStatus = async (product) => {
    const newStatus = product.status === "active" ? "inactive" : "active";

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/products/${product.id}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!res.ok) {
        toast.error("Error al cambiar estado");
        return;
      }

      await fetchProducts();
      toast.success(
        newStatus === "active"
          ? "Producto activado"
          : "Producto desactivado"
      );

    } catch (error) {
      console.error(error);
      toast.error("Error al cambiar estado");
    }
  }

  return (
    <div className="manage-products-wrapper text-secondary">
      <h3 className="mb-4">🛍️ Gestión de productos</h3>
      <div className="products-table-wrapper">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>ID</th>
              <th>Imagen</th>
              <th>Nombre</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th>Vendedor</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td data-label="Id">{p.id}</td>
                <td>
                  <img
                    src={p.image_url}
                    alt={p.name}
                    style={{ width: 55, borderRadius: 6 }}
                  />
                </td>
                <td data-label="Nombre">{p.name}</td>
                <td data-label="Categoría">{p.category}</td>
                <td data-label="Precio">${p.price}</td>
                <td data-label="Vendedor">{p.seller}</td>
                <td>
                  <span
                    className={`badge ${
                      p.status === "active" ? "bg-success" : "bg-danger"
                    }`}
                  >
                    {p.status}
                  </span>
                </td>
                <td data-label="Acciones">
                  <button
                    className="btn primary btn-sm me-2 mr-1 rounded-2"
                    onClick={() => setViewProduct(p)}
                  >
                    Ver
                  </button>

                  <button
                    className="btn secondary btn-sm me-2 mr-1 rounded-2"
                    onClick={() => {
                      const categoryFound = categories.find(c => c.name === p.category);

                      setEditProduct({
                        ...p,
                        image_url: p.image_url || "",
                        category_id: categoryFound ? categoryFound.id : ""
                      });
                    }}
                  >
                    Editar
                  </button>

                  <button
                    className={`btn btn-sm rounded-2 ${
                      p.status === "active" ? "red" : "primary"
                    }`}
                    onClick={() => handleToggleStatus(p)}
                  >
                    {p.status === "active" ? "Desactivar" : "Activar"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
          </table>

        {/* ---------- VER PRODUCTO ---------- */}
        {viewProduct && (
          <div className="modal-overlay text-secondary">
            <div className="modal-box">
              <h4>📦 Producto</h4>
              <img
                src={viewProduct.image_url}
                alt={viewProduct.name}
                style={{ width: 150, borderRadius: 8 }}
              />
              <p><b>Nombre: </b> {viewProduct.name}</p>
              <p><b>Stock: </b> {viewProduct.stock}</p>
              <p><b>Categoría: </b> {viewProduct.category}</p>
              <p><b>Precio: </b> ${viewProduct.price}</p>
              <p><b>Vendedor: </b>{viewProduct.seller}</p>
              <button
                className="btn accent mt-3 rounded-2"
                onClick={() => setViewProduct(null)}
              >
                Cerrar
              </button>
            </div>
          </div>
        )}

        {/* ---------- EDITAR PRODUCTO ---------- */}
        {editProduct && (
          <div className="modal-overlay text-secondary">
            <div className="modal-box">
              <h4>✏ Editar Producto</h4>

              <label>Nombre</label>
              <input
                className="form-control mb-2"
                value={editProduct.name}
                onChange={(e) =>
                  setEditProduct({ ...editProduct, name: e.target.value })
                }
              />

              <label>Categoría:</label>
              <select
                className="form-control mb-2"
                value={editProduct.category_id || ""}
                onChange={(e) =>
                  setEditProduct({ ...editProduct, category_id: Number(e.target.value) })
                }
              >
                <option value="">Selecciona categoría</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
                ))}
              </select>

              <label>Imagen (URL)</label>
              <input
                type="text"
                className="form-control"
                value={editProduct.image_url || ""}
                onChange={(e) =>
                  setEditProduct({
                    ...editProduct,
                    image_url: e.target.value,
                  })
                }
              />

              {/* Previsualización */}
              {editProduct.image && (
                <img
                  src={editProduct.image_url}
                  alt="preview"
                  style={{ width: 120, marginTop: 10, borderRadius: 8 }}
                />
              )}
              <div className="d-flex">
                <button className="btn primary mt-3 me-2 mr-2 rounded-2" onClick={handleEditSave}>
                  Guardar
                </button>
                <button
                  className="btn accent mt-3 rounded-2"
                  onClick={() => setEditProduct(null)}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}