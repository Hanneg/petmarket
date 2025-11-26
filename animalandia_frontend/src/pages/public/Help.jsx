import React from "react";

export default function Help() {
  return (
    <div className="container mt-6 mb-6">
      {/* Título principal */}
      <h2 className="text-center text-secondary mb-2">❓ Centro de Ayuda</h2>
      <p className="text-center text-secondary mb-5">
        Encuentra respuestas rápidas a tus preguntas o contáctanos para más asistencia.
      </p>

      {/* Sección de Preguntas Frecuentes */}
      <section className="mt-5 mb-8">
        <h4 className="text-accent mb-3 text-center">Preguntas Frecuentes</h4>

        <div className="grix xs1 sm2 md3 gutter-md">
          <div className="col">
            <div className="card shadow-1 p-3 h-100">
              <h6 className="text-secondary mb-2">📦 ¿Dónde está mi pedido?</h6>
              <p className="text-secondary">
                Puedes rastrear tu pedido desde tu cuenta en la sección
                <span className="text-accent"> “Mis pedidos”</span>. Allí verás el estado y el número de seguimiento.
              </p>
            </div>
          </div>

          <div className="col">
            <div className="card shadow-1 p-3 h-100">
              <h6 className="text-secondary mb-2">💳 ¿Qué métodos de pago aceptan?</h6>
              <p className="text-secondary">
                Aceptamos tarjetas de crédito, débito, transferencias y pagos digitales seguros.
              </p>
            </div>
          </div>

          <div className="col">
            <div className="card shadow-1 p-3 h-100">
              <h6 className="text-secondary mb-2">🔁 ¿Puedo devolver un producto?</h6>
              <p className="text-secondary">
                Sí, dentro de los <strong>15 días</strong> posteriores a la compra. El producto debe estar en buen estado.
              </p>
            </div>
          </div>

          <div className="col">
            <div className="card shadow-1 p-3 h-100">
              <h6 className="text-secondary mb-2">🐾 ¿Tienen productos para otras mascotas?</h6>
              <p className="text-secondary">
                Actualmente ofrecemos productos para perros y gatos, pero pronto ampliaremos nuestras categorías.
              </p>
            </div>
          </div>

          <div className="col">
            <div className="card shadow-1 p-3 h-100">
              <h6 className="text-secondary mb-2">📞 ¿Cómo contacto al soporte?</h6>
              <p className="text-secondary">
                Puedes escribirnos por correo o por WhatsApp, nuestros asesores te ayudarán con gusto.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sección de Contacto / Soporte */}
      <section className="mt-8">
        <h4 className="text-accent mb-3 text-center">¿Necesitas más ayuda?</h4>

        <div className="grix xs1 sm2 align-center gutter-md">
          <div className="col center-align">
            <div className="card shadow-1 p-3">
              <h6 className="text-secondary mb-2">📧 Correo electrónico</h6>
              <p className="grey-text mb-3 text-secondary">Envíanos tus consultas a:</p>
              <a href="mailto:soporte@animalandia.com" className="btn small secondary rounded-2">
                soporte@animalandia.com
              </a>
            </div>
          </div>

          <div className="col center-align">
            <div className="card shadow-1 p-3">
              <h6 className="text-secondary mb-2">💬 WhatsApp</h6>
              <p className="grey-text mb-3 text-secondary">Contáctanos directamente:</p>
              <a
                href="https://wa.me/5215555555555"
                target="_blank"
                rel="noopener noreferrer"
                className="btn small accent rounded-2"
              >
                Enviar mensaje →
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}