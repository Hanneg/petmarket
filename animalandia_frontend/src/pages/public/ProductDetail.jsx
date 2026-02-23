import { useState, useEffect, React } from "react"
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { toast } from "react-toastify";
import ProductCard from "../../components/ProductCard";
import { useAuth } from "../../context/AuthContext";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { addToCart } = useCart();
  const { isAuthenticated, user } = useAuth();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState([]);

  const handleQuantityChange = (e) => {
    let value = Number(e.target.value);

    if (value < 1) value = 1;
    if (value > product.stock) value = product.stock;

    setQuantity(value);
  };

  // Obtener producto por ID
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}api/products/${id}`);
        if (!res.ok) throw new Error("Producto no encontrado");

        const data = await res.json();
        setProduct(data);

        // Obtener relacionados (misma categoría)
        const relRes = await fetch(`${import.meta.env.VITE_API_URL}api/products`);
        const allProducts = await relRes.json();

        const filtered = allProducts.filter(
          (p) => p.category === data.category && p.id !== data.id
        );

        setRelated(filtered);
      } catch (error) {
        console.error(error);
        setProduct(null);
      } finally {
        setLoading(false)
      }
    };

    fetchProduct();
  }, [id]);

  if (!product) {
    return (
      <div className="container mt-5 text-center">
        <h4 className="text-error text-secondary">Producto no encontrado 😿</h4>
        <button
          className="btn rounded-2 mt-3 btn-primary"
          onClick={() => navigate("/catalog")}
        >
          Volver al catálogo
        </button>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast.info("Debes inciar sesión para agregar productos");
      navigate("/login");
      return;
    }

    const qty = Number(
      document.getElementById("quantity-selector").value
    );

    addToCart(product, qty);
    toast.success(`${qty} x ${product.name} agregado al carrito 🛒`);
  };

  return (
    <div className="product-detail-wrapper container mt-5 mb-6">
      <h3 className="mb-4 text-center text-secondary">🛒 Detalles del producto</h3>
      <div className="product-detail-grid">
    
        {/* Información del producto (izquierda) */}
        <div className="product-info card shadow-1 rounded-3 p-4">
          <h2 className="mb-2 text-secondary">{product.name}</h2>
          <p className="text-accent text-sm mb-2">
            <i className="fas fa-tag me-1"></i> {product.category}
          </p>
          <p className="text-secondary mb-3">{product.description}</p>

          <h3 className="text-primary fw-bold mb-4">
            ${product.price}
          </h3>

          {product.stock <= 5 && product.stock > 0 && (
            <p className="text-red fw-bold">
              Solo quedan {product.stock} unidades
            </p>
          )}
          <div className="mb-3">
            <label className="text-secondary fw-bold">Cantidad:</label>
              {product.stock > 0 ? (
                <input
                  type="number"
                  min={1}
                  max={product.stock}
                  value={quantity}
                  onChange={handleQuantityChange}
                  className="quantity-input"
                  id="quantity-selector"
                  />
              ) : (
                <p className="text-red fw-bold">Producto agotado</p>
              )}
          </div>          

          <div className="d-flex flex-wrap gap-2 mt-4">
            {user?.role !== "seller" && user?.role !== "admin" && product.status === "active" && (
              <button
                className="btn btn-primary secondary rounded-2 mr-2"
                onClick={handleAddToCart}
                disabled={product.stock === 0}
              >
                <i className="fas fa-cart-plus me-1 text-background"></i>
                  Agregar al carrito
              </button>
            )}

            <button
              className="btn btn-outline-primary primary rounded-2"
              onClick={() => navigate("/catalog")}
            >
              <i className="fas fa-arrow-left me-1 text-background"></i>
                Volver al catálogo
            </button>
          </div>
        </div>

        {/* Imagen del producto (derecha) */}
        <div className="product-image card shadow-2 rounded-3 mb-4">
          <img
            src={product.image_url}
            alt={product.name}
            className="product-image-img"
          />
        </div>
      </div>

      {/* Productos relacionados */} 
      {related.length > 0 && ( 
        <div className="mt-8"> 
          <h4 className="mb-4 text-center text-secondary ">🛍️ Productos relacionados</h4> 
          <div className="grix xs1 sm2 md3 lg4 mt-4"> 
            {related.map((r) => ( 
              <div key={r.id} className="col s12 m6 l3"> 
                <ProductCard product={r} /> 
              </div> 
            ))} 
          </div> 
        </div> 
      )}
    </div>
  );
}