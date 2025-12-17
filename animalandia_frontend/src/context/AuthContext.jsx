import { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-toastify";

export const AuthContext = createContext();

const API_URL = "http://localhost:3000/api";

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Cargar sesión
    useEffect(() => {
        const storedUser = localStorage.getItem("user");

        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    // Iniciar sesión
    const login = async (email, password) => {
        try {
            const res = await fetch(`${API_URL}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });
            
            const data = await res.json();

            if (!res.ok) {
                toast.error(data.message || "Credenciales inválidas");
                return false;
            }
            
            // Usuario + token unificado
            const userWithToken = {
                id: data.user.id,
                name: data.user.name,
                email: data.user.email,
                role: data.user.role,
                token: data.token
            }

            setUser(userWithToken);

            localStorage.setItem("user", JSON.stringify(userWithToken));

            toast.success(`Bienvenido ${userWithToken.name}`);
            return true;

        } catch (error) {
            console.error("LOGIN ERROR ", error);
            toast.error("Error de conexion con el servidor");
            return false;
        }
    };

    // Cerrar sesión
    const logout = () => {
        setUser(null);
        localStorage.clear();
        toast.info("Sesión cerrada");
    };

    const isAuthenticated = !!user; // Identificador 

    return (
        <AuthContext.Provider value={{ 
            user, 
            setUser,
            isAuthenticated, 
            login, 
            logout
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);