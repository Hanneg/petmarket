import { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-toastify";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);

    // Leer usuario guardado
    useEffect(() => {
        const storedUser = localStorage.getItem("petmaket_user");
        if (storedUser) setUser(JSON.parse(storedUser));
    }, []);

    // Iniciar sesión
    const login = (email, password) => {
        // Temporal hasta conectar con el backend
        if (email === "admin@petmarket.com" && password === "123456") {
            const admin = { id: 1, name: "Admin", email, role: "Admin"};
            setUser(admin);
            localStorage.setItem("petmarket_user", JSON.stringify(admin))
            toast.success("Bienvenido, Administrador!");
            return true;
        }

        if (email === "vendedor@petmarket.com" && password === "456789") {
            const seller = { id: 2, name: "Vendedor", email, role: "seller"};
            setUser(seller);
            localStorage.setItem("petmarket_user", JSON.stringify(seller))
            toast.success("Bienvenido, Vendedor!");
            return true;
        }

        if (email === "cliente@petmarket.com" && password === "987654") {
            const client = { id: 3, name: "Cliente", email, role: "client"};
            setUser(client);
            localStorage.setItem("petmarket_user", JSON.stringify(client))
            toast.success("Bienvenido, Cliente!");
            return true;
        }

        toast.error("Credenciales incorrectas");
        return false;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("petmarket_user");
        toast.info("Sesión cerrada");
    };

    const isAuthenticated = !!user; // Identificador 

    return (
        <AuthContext.Provider value={{ user, setUser, isAuthenticated, login, logout}}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);