import React, { useState } from "react";

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Gracias por tu mensaje, ${name}!`);
    setName("");
    setEmail("");
    setMessage("");
  };

  return (
    <div className="container mt-6">
      <div className="grid">
        <div className="col-12 col-md-8 col-lg-6 mx-auto card p-4 rounded-3 shadow-1">
          <h4 className="text-center mb-4 text-secondary">📬 Contáctanos</h4>
          <form onSubmit={handleSubmit}>
            <div className="form-field mb-3">
              <label htmlFor="name" className="form-label text-secondary">
                Nombre
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="form-control"
                placeholder="Tu nombre completo"
                required
              />
            </div>

            <div className="form-field mb-3">
              <label htmlFor="email" className="form-label text-secondary">
                Correo electrónico
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-control"
                placeholder="tucorreo@ejemplo.com"
                required
              />
            </div>

            <div className="form-field mb-4">
              <label htmlFor="message" className="form-label text-secondary">
                Mensaje
              </label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="form-control"
                placeholder="Escribe tu mensaje aquí..."
                rows="5"
                required
              ></textarea>
            </div>

            <button className="btn secondary full-width rounded-2" type="submit">
              Enviar mensaje
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
