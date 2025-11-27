import React from "react";

export default function Footer() {
    return (
        <footer className="footer accent text-secondary">
            <div className="container">
                <div className="grix xs1 sm2 md2 between vcenter">
                    {/* Columna izquierda */}
                    <div className="col">
                        <p className="m-0 font-w800">
                            © 2025 AnimaLandia - Todos los derechos reservados
                        </p>
                    </div>

                    {/* Columan derecha */}
                    <div className="grix text-right text-center-xs">
                        <a href="/contact" className="font-w800">
                            Contáctanos
                        </a>
                        <a href="/aboutus" className="font-w800">
                            Sobre Nosotros
                        </a>
                        <a href="/help" className="font-w800">
                            Ayuda
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}