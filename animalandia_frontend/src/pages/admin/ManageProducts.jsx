import React, { useEffect, useState } from "react";
import { mockProducts } from "../../utils/mockData";

export default function ManageProducts() {
  const [products, setProducts] = useState([]);
  const [viewProduct, setViewProduct] = useState(null);
  const [editProduct, setEditProduct] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  // Cargar productos desde localStorage o usar mockProducts
  useEffect(() => {
    const stored = localStorage.getItem("products");
    if (stored) {
      setProducts(JSON.parse(stored));
    } else {
      setProducts(mockProducts);
      localStorage.setItem("products", JSON.stringify(mockProducts));
    }
  }, []);

  // Guardar cambios en localStorage
  const saveProducts = (newProducts) => {
    setProducts(newProducts);
    localStorage.setItem("products", JSON.stringify(newProducts));
  };

  const handleEditSave = () => {
    const updated = products.map((p) =>
      p.id === editProduct.id ? editProduct : p
    );

    saveProducts(updated);
    setEditProduct(null);
  };

  const handleDelete = () => {
    const filtered = products.filter(p => p.id !== confirmDelete.id);
    saveProducts(filtered);
    setConfirmDelete(null);
  };

  return (
    <div className="manage-products-wrapper">
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
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>
                  <img
                    src={p.image}
                    alt={p.name}
                    style={{ width: 55, borderRadius: 6 }}
                  />
                </td>
                <td>{p.name}</td>
                <td>{p.category}</td>
                <td>${p.price.toFixed(2)}</td>

                <td>
                  <button
                    className="btn primary btn-sm me-2 mr-1 rounded-2"
                    onClick={() => setViewProduct(p)}
                  >
                    Ver
                  </button>

                  <button
                    className="btn secondary btn-sm me-2 mr-1 rounded-2"
                    onClick={() => setEditProduct({ ...p })}
                  >
                    Editar
                  </button>

                  <button
                    className="btn red btn-sm rounded-2"
                    onClick={() => setConfirmDelete(p)}
                  >
                    Eliminar
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
                src={viewProduct.image}
                alt={viewProduct.name}
                style={{ width: 150, borderRadius: 8 }}
              />
              <p><b>Nombre:</b> {viewProduct.name}</p>
              <p><b>Categoría:</b> {viewProduct.category}</p>
              <p><b>Precio:</b> ${viewProduct.price}</p>

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
                className="form-control"
                value={editProduct.name}
                onChange={(e) =>
                  setEditProduct({ ...editProduct, name: e.target.value })
                }
              />

              <label className="mt-2">Categoría</label>
              <input
                className="form-control"
                value={editProduct.category}
                onChange={(e) =>
                  setEditProduct({ ...editProduct, category: e.target.value })
                }
              />

              <label className="mt-2">Precio</label>
              <input
                type="number"
                className="form-control"
                value={editProduct.price}
                onChange={(e) =>
                  setEditProduct({
                    ...editProduct,
                    price: Number(e.target.value),
                  })
                }
              />

              <label className="mt-2">Imagen (URL)</label>
              <input
                type="file"
                className="form-control"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0]; // Tomamos el primer archivo
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      // Guardamos la imagen en base64
                      setEditProduct({ ...editProduct, image: reader.result });
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />

              {/* Previsualización */}
              {editProduct.image && (
                <img
                  src={editProduct.image}
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

        {/* ---------- ELIMINAR PRODUCTO ---------- */}
        {confirmDelete && (
          <div className="modal-overlay">
            <div className="modal-box">
              <h4>❗Eliminar producto</h4>
              <p>
                ¿Seguro que deseas eliminar <b>{confirmDelete.name}</b>?
              </p>

              <button className="btn red me-2 mr-2 rounded-2" onClick={handleDelete}>
                Eliminar
              </button>

              <button
                className="btn accent rounded-2"
                onClick={() => setConfirmDelete(null)}
              >
                Cancelar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}