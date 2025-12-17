import { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-toastify";

export const AuthContext = createContext();

const API_URL = "http://localhost:3000/api";

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);

    // Cargar sesión
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        const storedToken = localStorage.getItem("token");

        if (storedUser && storedToken) {
            setUser(JSON.parse(storedUser));
            setToken(storedToken);
        }
    }, []);

    // Iniciar sesión
    const login = async (email, password) => {
        try {
            const res = await fetch(`${API_URL}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            if (!res.ok) throw new Error("Credenciales inválidas");

            const data = await res.json();

            setUser(data.user);
            setToken(data.token);

            localStorage.setItem("user", JSON.stringify(data.user));
            localStorage.setItem("token", data.token);

            toast.success(`Bienvenido ${data.user.name}`);
            return true;
        } catch (error) {
            toast.error(error.message);
            return false;
        }
    };

    // Cerrar sesión
    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.clear();
        toast.info("Sesión cerrada");
    };

    const isAuthenticated = !!user; // Identificador 

    return (
        <AuthContext.Provider value={{ 
            user, 
            token,
            isAuthenticated, 
            login, 
            logout
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);