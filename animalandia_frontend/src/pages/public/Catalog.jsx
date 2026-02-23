import React, { useContext, useEffect, useState } from "react";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

export default function Catalog() {
  const location = useLocation();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState("Todos");
  
  const { addToCart } = useCart();
  const { isAuthenticated, user } = useAuth();

  // Leer categoría desde query params al cargar la página
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const cat = params.get("category");
    if (cat) setCategory(cat);
  }, [location.search]);

  // Obtener productos desde el backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}api/products`);
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error("ERROR FETCH PRODUCTS", error);
        toast.error("Error cargando productos");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}api/categories`);
        const data = await res.json();
        setCategories([{ id: 0, name: "Todos" }, ...data]);
      } catch (error) {
        console.error("ERROR FETCH CATEGORIES", error);
        toast.error("Error cargando categorías");
      }
    };

    fetchCategories();
  }, []);

  const filteredProducts = products.filter((product) => {
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
            onChange={(e) => {
              const value = e.target.value;
              setCategory(value); 
              
              if (value === "Todos") {
                navigate("/catalog");
              } else {
                navigate(`/catalog?category=${value}`)}}
              }
            className="form-control"
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.name}>
                {cat.name}
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
                  src={product.image_url}
                  alt={product.name}
                  style={{
                    width: "100%",
                    height: "180px",
                    objectFit: "cover",
                    borderRadius: "4px",
                  }}
                />
              </div>
              <div className="card-body">
                <h5 className="product-title mt-2 text-secondary">{product.name}</h5>
                <p className="text-small text-primary">{product.category}</p>
                <p className="product-price mb-1 grey-text text-accent font-w800">Precio: ${product.price}</p>
                <p className="product-description text-small text-secondary">{product.description}</p>
              </div>
              <div className="card-footer d-flex justify-content-center">
                <button className="btn primary mr-2 rounded-2 text-background" onClick={() => navigate(`/product/${product.id}`)}>
                  Ver más
                </button>
                {user?.role !== "seller" && user?.role !== "admin" && product.status === "active" && (
                  <button className="btn secondary rounded-2 text-background" onClick={() => handleAddToCart(product)}>
                    Agregar
                  </button>
                )}
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