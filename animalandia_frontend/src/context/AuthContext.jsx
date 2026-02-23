import { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-toastify";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // CARGAR SESIÓN
    useEffect(() => {
        const storedUser = localStorage.getItem("user");

        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    // INICIAR SESIÓN
    const login = async (email, password) => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}api/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            if (!res.ok) {
                setUser(null);
                localStorage.removeItem("user");

                const errorData = await res.json();
                toast.error(errorData.message || "Credenciales inválidas");
                return false;
            }

            const data = await res.json();
            
            // USUARIO + TOKEN UNIFICADO
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

    // CERRAR SESIÓN
    const logout = () => {
        setUser(null);
        localStorage.clear();
        toast.info("Sesión cerrada");
    };

    const isAuthenticated = !!user;

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