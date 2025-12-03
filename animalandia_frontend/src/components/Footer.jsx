import React from "react";

export default function Footer() {
    return (
        <footer className="footer accent text-secondary">
            <div className="footer-container">
                
                {/* Columna izquierda */}
                <div className="footer-left">
                    <p className="m-0 font-w800">
                        © 2025 AnimaLandia - Todos los derechos reservados
                    </p>
                </div>

                {/* Columna derecha */}
                <div className="footer-right">
                    <a href="/contact" className="font-w800">Contáctanos</a>
                    <a href="/aboutus" className="font-w800">Sobre Nosotros</a>
                    <a href="/help" className="font-w800">Ayuda</a>
                </div>

            </div>
        </footer>
    );
}