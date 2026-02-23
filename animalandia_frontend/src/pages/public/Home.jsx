import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CategoryCard from "../../components/CategoryCard";
import ProductCard from "../../components/ProductCard";
import categoria_accesorios from "../../assets/images/categoria_accesorios.jpg";
import categorias_perros from "../../assets/images/categoria_perros.jpg";
import categorias_gatos from "../../assets/images/categoria_gato.jpg";
import categoria_otros from "../../assets/images/categoria_higiene.jpg";
import categoria_comida from "../../assets/images/categoria_comida.jpg";

export default function Home() {
  const navigate = useNavigate();
  const scrollRef = useRef(null);

  const [categories, setCategories] = useState([]);
  const [featured, setFeatured] = useState([]);

  const categoryImages = {
    Accesorios: categoria_accesorios,
    Perros: categorias_perros,
    Gatos: categorias_gatos,
    "Otros animalitos": categoria_otros,
    Comida: categoria_comida,
  }

  useEffect(() => {
    const fetchCategories = async () => {
      const res = await fetch(`${import.meta.env.VITE_API_URL}api/categories`);
      const data = await res.json();

      const withImages = data.map((cat) => ({
        ...cat,
        image: categoryImages[cat.name] || categoria_accesorios,
      }));

      setCategories(withImages);
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchFeatured = async () => {
      const res = await fetch(`${import.meta.env.VITE_API_URL}api/products`);
      const data = await res.json();
     setFeatured(data.slice(0, 8));
    };

    fetchFeatured();
  }, []);

  // Función para scroll del carrusel
  const scroll = (dir) => {
    const container = scrollRef.current;
    if (!container) return;
    container.scrollBy({ left: dir === "left" ? -300 : 300, behavior: "smooth" });
  };

  return (
    <div className="home-container">

      {/* Banner principal */}
      <section className="banner">
        <div className="container text-center">
          <h1 className="mb-3">
            🐾 Bienvenido a <span className="text-accent">AnimaLandia</span>
          </h1>
          <p className="lead mb-4">
            Todo lo que tu mascota necesita, en un solo lugar.
          </p>
          <button
            className="btn secondary large rounded-2"
            onClick={() => navigate("/catalog")}
          >
            Explorar productos
          </button>
        </div>
      </section>

      {/* Barra horizontal informativa */}
      <section className="bg-grey text-center py-2 shadow-1 accent text-background font-w800">
        <div 
          className="container text-dark"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            textAlign: 'center',
            maxWidth: '900px',
            margin: '0 auto'
          }}
        >
            <span>🚚 Envíos gratis a partir de $150</span>
            <span>📞 Atención 24/7</span>
            <span>💳 Pagos seguros</span>
        </div>
      </section>

      {/* Categorías destacadas */}
      <section className="container mt-6 mb-6">
        <h3 className="text-center mb-4 text-secondary">Categorías destacadas</h3>

        {categories.length >=5 && (
          <div className="category-grid">
            {/* Columna izquierda */}
            <div className="category-col">
              <CategoryCard
                {...categories[0]}
                onClick={() => navigate(`/catalog?category=${categories[0].name}`)}
              />
              <CategoryCard
                {...categories[1]}
                onClick={() => navigate(`/catalog?category=${categories[1].name}`)}
              />
          </div>

            {/* Columna central */}
            <div className="category-col middle">
              <CategoryCard
                {...categories[2]}
                onClick={() => navigate(`/catalog?category=${categories[2].name}`)}
                className="large"
              />
            </div>

            {/* Columna derecha */}
            <div className="category-col">
              <CategoryCard
                {...categories[3]}
                onClick={() => navigate(`/catalog?category=${categories[3].name}`)}
              />
              <CategoryCard
                {...categories[4]}
                onClick={() => navigate(`/catalog?category=${categories[4].name}`)}
              />
            </div>
          </div>
        )}
      </section>


      {/* Productos destacados */}
      <section className="container mt-6 mb-6">
        {/* Encabezado */}
        <h3 className="text-secondary mt-5 mb-3 text-center">Productos destacados</h3>
        {/* Carusel con botones laterales */}
        <div className="relative">
          <button
            className="scroll-btn left-0"
            onClick={() => scroll("left")}
          >
            ←
          </button>

          <div ref={scrollRef} className="products-carousel hide-scrollbar">
            {featured.map((product) => (
              <div
                key={product.id}
                style={{ minWidth: "250px", flex: "0 0 350px" }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>

          <button
            className="scroll-btn right-0"
            onClick={() => scroll("right")}
          >
            →
          </button>
        </div>

        <div className="text-center text-background justify-content-center align-items-center mb-4 mt-4">    
          <button
            className="btn small secondary rounded-2"
            onClick={() => navigate("/catalog")}
          >
            Ver todo →
          </button>
        </div>
      </section>
    </div>
  );
}