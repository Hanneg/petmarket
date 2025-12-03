import React, { useEffect, useState } from "react";
import { mockProducts } from "../../utils/mockData";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

export default function Catalog() {
  const location = useLocation();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todos");
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth(); // Para saber si el usuario esta logueado
  const navigate = useNavigate();

  const categories = ["Todos", "Comida", "Accesorios", "Salud e higiene", "Perros", "Gatos"];

  // Leer categoría desde query params al cargar la página
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const cat = params.get("category");
    if (cat) setCategory(cat);
  }, [location.search]);

  const filteredProducts = mockProducts.filter((product) => {
    const matchCategory = category === "Todos" || product.category === category;
    const matchSearch = product.name.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  // Al hacer clic en "agregar al carrito"
  const handleAddToCart = (product) => {
    // Si no esta logueado
    if (!isAuthenticated) {
      toast.info("Inicia sesión para agregar productos 🐾", {
        position: "bottom-right",
        autoClose: 2000
      });
      navigate("/login"); 
      return;
    } else {
      // Si esta logueado
    addToCart(product);
    toast.success(`${product.name} agregado al carrito 🛒`, {
      position: "bottom-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "colored"
    });
    }
  };

  return (
    <div className="container mt-5">
      <h3 className="mb-4 text-center text-secondary">🛒 Catálogo de productos</h3>

      {/* Filtros */}
      <div className="grix xs1 sm2 gutter-xs">
        <div className="form-field">
          <input
            type="text"
            placeholder="Buscar producto..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-control"
          />
        </div>
        <div className="form-field">
          <select
            value={category}
            onChange={(e) => {setCategory(e.target.value); navigate(`/catalog?category=${e.target.value}`)}}
            className="form-control"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid de productos */}
      <div className="grix xs1 sm2 md3 lg4 mt-4 mb-4">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div key={product.id} className="card p-2 shadow-1 mr-2">
              <div className="card-image">
                <img
                  src={product.image}
                  alt={product.name}
                  style={{
                    width: "100%",
                    height: "180px",
                    objectFit: "cover",
                    borderRadius: "4px",
                  }}
                />
              </div>
              <div className="card-content">
                <h5 className="mt-2 text-secondary">{product.name}</h5>
                <p className="mb-1 grey-text text-accent font-w800">Precio: ${product.price.toFixed(2)}</p>
                <p className="text-small text-secondary">{product.description}</p>
              </div>
              <div className="card-footer d-flex justify-content-center">
                <button className="btn primary mr-2 rounded-2 text-background" onClick={() => navigate(`/product/${product.id}`)}>
                  Ver más
                </button>
                <button className="btn secondary rounded-2 text-background" onClick={() => handleAddToCart(product)}>
                  Agregar
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center mt-5">No se encontraron productos 😢</p>
        )}
      </div>
    </div>
  );
}