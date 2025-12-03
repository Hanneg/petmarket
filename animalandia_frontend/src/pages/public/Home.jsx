import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import CategoryCard from "../../components/CategoryCard";
import ProductCard from "../../components/ProductCard";
import { mockProducts } from "../../utils/mockData";

export default function Home() {
  const navigate = useNavigate();
  const scrollRef = useRef(null);

  // Rutas de imágenes desde /public/images
  const categories = [
    { id: 1, name: "Perros", image: "/src/assets/images/categoria_perros.jpg" },
    { id: 2, name: "Gatos", image: "/src/assets/images/categoria_gato.jpg" },
    { id: 3, name: "Accesorios", image: "/src/assets/images/categoria_accesorios.jpg" },
    { id: 4, name: "Comida", image: "/src/assets/images/categoria_comida.jpg" },
    { id: 5, name: "Salud e higiene", image: "/src/assets/images/categoria_higiene.jpg" },
  ];

  const featured = mockProducts.slice(0, 8);

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
      <section className="bg-grey text-center py-2 shadow-1 accent text-secondary font-w800">
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
            <span>🚚 Envíos gratis a partir de $50</span>
            <span>📞 Atención 24/7</span>
            <span>💳 Pagos seguros</span>
        </div>
      </section>

      {/* Categorías destacadas */}
      <section className="container mt-6 mb-6">
        <h3 className="text-center mb-4 text-secondary">Categorías destacadas</h3>
        <div className="categories-grid">
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
      </section>


      {/* Productos destacados */}
      <section className="container mt-6 mb-6">
        {/* Encabezado */}
        <h3 className="text-secondary mb-3 text-center">Productos destacados</h3>
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
                style={{ minWidth: "250px", flex: "0 0 auto" }}
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

        <div className="text-center text-background justify-content-center align-items-center mb-4">    
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