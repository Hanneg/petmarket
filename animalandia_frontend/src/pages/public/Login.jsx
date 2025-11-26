import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; 

const schema = yup.object().shape({
    email: yup.string().email("Correo inválido").required("Campo requerido"),
    password: yup.string().min(6, "Mínimo 6 caracteres").required("Campo requwerido")
});

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({ resolver: yupResolver(schema)});

    const onSubmit = (data) => {
        const success = login(data.email, data.password);
        if (success) navigate("/");
    };

    return (
        <div className="container mt-5">
            <div className="card p-4 mx-auto" style={{ maxWidth: 400}}>
                <h3 className="text-center mb-3">Iniciar sesión</h3>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="form-field">
                        <label>Email</label>
                        <input type="email" {...register("email")} className="form-control"/>
                        <p className="text-danger">{errors.email?.message}</p>
                    </div>

                    <div className="form-field mt-3">
                        <label>Contraseña</label>
                        <input type="password" {...register("password")} className="form-control"/>
                        <p className="text-danger">{errors.password?.message}</p>
                    </div>

                    <button type="submit" className="btn primary full-width mt-4">
                        Ingresar
                    </button>

                    <p className="text-center mt-3">
                        ¿No tienes cuenta? <a href="/register">Regístrate</a>
                    </p>
                </form>
            </div>
        </div>
    );
}