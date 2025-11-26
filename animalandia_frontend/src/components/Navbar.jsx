import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function Navbar() {
    const { user, logout } = useAuth();
    const {cartItems} = useCart();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Cerrar menú cuando cambie el usuario
    useEffect(() => {
        setDropdownOpen(false);
    }, [user]);

    // Cerrar el dropdown al hacer clic fuera
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Cantidad total de productos en el carrito
    const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <nav className="navbar primary shadow-1">
            <div className="navbar-brand ml-3">
                <Link to="/" className="navbar-item text-light fw-bold">
                    🐾 AnimaLandia
                </Link>
            </div>
            <div className="navbar-menu ml-auto hide-xs text-grey text-light-3 font-w600 hover-text-dark">
                <Link to="/catalog" className="navbar-item text-light mr-3">
                    Productos
                </Link>
                {user && user.role === "client" && (
                    <Link to="/cart" className="navbar-items text-light mr-3">
                        Carrito{" "}
                        {totalItems > 0 && (
                        <span 
                            style={{
                                backgroundColor: "white",
                                color: "#975f3e",
                                borderRadius: "50%",
                                padding: "2px 7px",
                                fontSize: "0.8rem",
                                fontWeight: "bold",
                                marginLeft: "5px"
                            }}
                        >
                            {totalItems}
                        </span>
                        )}
                    </Link>
                )}
                { user ? (
                    <>
                        <div className="dropdown navbar-item" ref={dropdownRef}>
                            <button 
                                className="dropdown-toggle text-secondary font-w800"
                                onClick={() => setDropdownOpen(!isDropdownOpen)}
                            >
                                {user.name} ({user.role})
                            </button>

                            {isDropdownOpen && (
                                <ul className="dropdown-menu">
                                    {/* Cliente */}
                                    {user.role === "client" && (
                                        <>
                                            <li><Link to="/profile" onClick={() => setDropdownOpen(false)}>Mi Perfil</Link></li>
                                            <li><Link to="/orders" onClick={() => setDropdownOpen(false)}>Mis Pedidos</Link></li>
                                        </>
                                    )}

                                    {/* Vendedor */}
                                    {user.role === "seller" && (
                                        <>
                                            <li><Link to="/profile" onClick={() => setDropdownOpen(false)}>Mi Perfil</Link></li>
                                            <li><Link to="/my-publications" onClick={() => setDropdownOpen(false)}>Mis Publicaciones</Link></li>
                                            <li><Link to="/create-publications" onClick={() => setDropdownOpen(false)}>Crear Publicación</Link></li>
                                        </>
                                    )}

                                    {/* Administrador */}
                                    {user.role === "Admin" && (
                                        <>
                                            <li><Link to="/admin" onClick={() => setDropdownOpen(false)}>Panel administrativo</Link></li>
                                        </>
                                    )}

                                    <hr/>
                                    <li>
                                        <button className="logout-btn" onClick={handleLogout}>
                                            Cerrar sesión
                                        </button>
                                    </li>
                                </ul>
                            )}
                        </div>
                    </>
                ) : (
                    <Link to="/login" className="navbar-item text-light mr-2">
                        Iniciar sesión
                    </Link>
                )}
            </div>
        </nav>
    );
}