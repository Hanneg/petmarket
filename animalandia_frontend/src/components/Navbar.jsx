import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function Navbar() {
    const { user, logout } = useAuth();
    const { cartItems } = useCart();
    const navigate = useNavigate();

    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
    const dropdownRef = useRef(null);

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    // Cerrar dropdown cuando el usuario cambia
    useEffect(() => {
        setDropdownOpen(false);
    }, [user]);

    // Cerrar dropdown al hacer clic fuera
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Cantidad total del carrito
    const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <nav className="navbar primary shadow-1">
            
            {/* Brand */}
            <div className="navbar-brand ml-3">
                <Link to="/" className="navbar-item text-light fw-bold">
                    🐾 AnimaLandia
                </Link>
            </div>

            {/* Botón hamburguesa (solo móvil) */}
            <button 
                className="hamburger-btn hide-desktop"
                onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
            >
                ☰
            </button>

            {/* Menu Desktop */}
            <div className="navbar-menu ml-auto hide-mobile">
                <Link to="/catalog" className="navbar-item text-light mr-3">Productos</Link>

                {user && user.role === "client" && (
                    <Link to="/cart" className="navbar-items text-light mr-3">
                        Carrito {totalItems > 0 && (
                            <span className="cart-badge">{totalItems}</span>
                        )}
                    </Link>
                )}

                {user ? (
                    <div className="dropdown navbar-item" ref={dropdownRef}>
                        <button 
                            className="dropdown-toggle text-secondary font-w800"
                            onClick={() => setDropdownOpen(!isDropdownOpen)}
                        >
                            {user.name} ({user.role})
                        </button>

                        {isDropdownOpen && (
                            <ul className="dropdown-menu">
                                {user.role === "client" && (
                                    <>
                                        <li><Link to="/profile">Mi Perfil</Link></li>
                                        <li><Link to="/orders">Mis Pedidos</Link></li>
                                    </>
                                )}

                                {user.role === "seller" && (
                                    <>
                                        <li><Link to="/profile">Mi Perfil</Link></li>
                                        <li><Link to="/my-publications">Mis Publicaciones</Link></li>
                                        <li><Link to="/create-publications">Crear Publicación</Link></li>
                                    </>
                                )}

                                {user.role === "admin" && (
                                    <li><Link to="/admin">Panel administrativo</Link></li>
                                )}

                                <hr />
                                <li><button className="logout-btn" onClick={handleLogout}>Cerrar sesión</button></li>
                            </ul>
                        )}
                    </div>
                ) : (
                    <Link to="/login" className="navbar-item text-light mr-2">Iniciar sesión</Link>
                )}
            </div>

            {/* Menu Mobile */}
            {isMobileMenuOpen && (
                <div className="mobile-menu">
                    <Link to="/catalog" onClick={() => setMobileMenuOpen(false)}>Productos</Link>

                    {user && user.role === "client" && (
                        <Link to="/cart" onClick={() => setMobileMenuOpen(false)}>
                            Carrito {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
                        </Link>
                    )}

                    {user ? (
                        <>
                            {user.role === "client" && (
                                <>
                                    <Link to="/profile">Mi Perfil</Link>
                                    <Link to="/orders">Mis Pedidos</Link>
                                </>
                            )}

                            {user.role === "seller" && (
                                <>
                                    <Link to="/profile">Mi Perfil</Link>
                                    <Link to="/my-publications">Mis Publicaciones</Link>
                                    <Link to="/create-publications">Crear Publicación</Link>
                                </>
                            )}

                            {user.role === "admin" && (
                                <Link to="/admin">Panel Administrativo</Link>
                            )}

                            <button className="logout-btn mobile" onClick={handleLogout}>
                                Cerrar sesión
                            </button>
                        </>
                    ) : (
                        <Link to="/login" onClick={() => setMobileMenuOpen(false)}>Iniciar sesión</Link>
                    )}
                </div>
            )}
        </nav>
    );
}