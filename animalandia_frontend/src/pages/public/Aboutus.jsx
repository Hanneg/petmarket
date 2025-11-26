import React from "react";

export default function AboutUs() {
  return (
    <div className="container mt-6 mb-6">
      {/* Título principal */}
      <h2 className="text-center text-secondary mb-4">🐾 Sobre Nosotros</h2>

      {/* Sección de introducción */}
      <section className="mb-5 text-center">
        <p className="lead text-secondary">
          En <span className="text-accent font-w800">AnimaLandia</span> nos apasionan los animales y creemos
          que merecen lo mejor. Ofrecemos productos de alta calidad para perros, gatos
          y otras mascotas, con el compromiso de brindar atención y amor en cada compra.
        </p>
      </section>

      {/* Misión, Visión y Valores */}
      <section className="grix xs1 sm3 gutter-md mt-6 mb-8 align-center">
        <div className="col">
          <div className="card shadow-1 p-3 center-align h-100">
            <h5 className="text-accent mb-2">Nuestra Misión</h5>
            <p className="text-secondary">
              Proveer productos y servicios que mejoren la calidad de vida de las mascotas y sus familias.
            </p>
          </div>
        </div>

        <div className="col">
          <div className="card shadow-1 p-3 center-align h-100">
            <h5 className="text-accent mb-2">Nuestra Visión</h5>
            <p className="text-secondary">
              Ser la tienda líder en bienestar animal, fomentando la tenencia responsable y el respeto por todas las especies.
            </p>
          </div>
        </div>

        <div className="col">
          <div className="card shadow-1 p-3 center-align h-100">
            <h5 className="text-accent mb-2">Nuestros Valores</h5>
            <ul className="text-left text-secondary">
              <li>❤️ Amor por los animales</li>
              <li>🌱 Sustentabilidad</li>
              <li>🤝 Compromiso y confianza</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Imagen con texto al costado */}
      <section className="container about-section">
        <div className="grix xs1 md2 align-center gutter-md">
          <div className="col order-md2 center-align">
            <img
              src="/src/assets/images/categoria_gato.jpg"
              alt="Equipo de AnimaLandia"
              className="responsive radius-3 shadow-2"
              style={{ maxWidth: "100%", height: "auto", display: "block", margin: "0 auto" }}
            />
          </div>
          <div className="col order-md1 p-3">
            <h4 className="text-accent mb-2">Conoce a nuestro equipo</h4>
            <p className="text-secondary">
              Somos un grupo de amantes de los animales que busca mejorar cada día la experiencia
              de nuestros clientes y sus mascotas. Creemos que cada pequeño detalle cuenta para crear
              un mundo más amigable con ellos.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}