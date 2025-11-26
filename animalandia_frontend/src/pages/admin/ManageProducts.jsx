import React from "react";
import { mockProducts } from "../../utils/mockData";

export default function ManageProducts() {
  return (
    <div className="container mt-5">
      <h3 className="mb-4">🛍️ Gestión de productos</h3>

      <table className="table striped">
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
          {mockProducts.map((product) => (
            <tr key={product.id}>
              <td>{product.id}</td>
              <td>
                <img
                  src={product.image}
                  alt={product.name}
                  style={{ width: 50, borderRadius: "4px" }}
                />
              </td>
              <td>{product.name}</td>
              <td>{product.category}</td>
              <td>${product.price.toFixed(2)}</td>
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
