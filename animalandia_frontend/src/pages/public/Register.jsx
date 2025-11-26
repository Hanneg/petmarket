import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const schema = yup.object().shape({
    name: yup.string().required("Campo obligatorio"),
    email: yup.string().email("Correo inválido").required("Campo obligatorio"),
    password: yup.string().min(6, "Mínimo 6 caracteres").required("Campo obligatorio"), 
    confirmPassword: yup.string().oneOf([yup.ref("password")], "Las contraseñas no coinciden").required("Campo requerido"),
    role: yup.string().oneOf(["cliente", "seller"], "Selecciona un rol válido").required("Campo requerido"),
});

export default function Register() {
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({ resolver: yupResolver(schema)})

    const onSubmit = (data) => {
        const newUser = {
            id: Date.now(),
            name: data.name,
            email: data.email,
            password: data.password,
            role: data.role
        };

        // Guardar temporalmente en localStorage - Simulación
        localStorage.setItem("petmaker_registered_user", JSON.stringify(newUser))
        toast.success("Registro exitoso, ya puedes iniciar sesión con tus credenciales")
        navigate("/login")
    };

    return (
        <div className="container mt-5">
            <div className="card p-4 mx-auto" style={{ maxWidth: 400}}>
                <h3 className="text-center mb-3">Registrate</h3>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="form-field">
                        <label>Nombre completo</label>
                        <input type="text" {...register("name")} className="form-control" placeholder="Ej.: Juan Pérez"/>
                        <p className="text-danger">{errors.name?.message}</p>
                    </div>

                    <div className="form-field mt-3">
                        <label>Email</label>
                        <input type="email" {...register("email")} className="form-control" placeholder="Ej.: correo@example.com"/>
                        <p className="text-danger">{errors.email?.message}</p>
                    </div>

                    <div className="form-field mt-3">
                        <label>Contraseña</label>
                        <input type="password" {...register("password")} className="form-control" placeholder="Mínimo 6 caracteres"/>
                        <p className="text-danger">{errors.password?.message}</p>
                    </div>

                    <div className="form-field mt-3">
                        <label>Confirmar Contraseña</label>
                        <input type="password" {...register("confirmPassword")} className="form-control" placeholder="Mínimo 6 caracteres"/>
                        <p className="text-danger">{errors.confirmPassword?.message}</p>
                    </div>

                    <div className="form-field mt-3">
                        <label>Tipo de usuario</label>
                        <select {...register("role")} className="form-control">
                            <option value="">--Selecciona una opción--</option>
                            <option value="cliente">Cliente</option>
                            <option value="seller">Vendedor</option>
                        </select>
                        <p className="text-danger">{errors.role?.message}</p>
                    </div>

                    <button type="submit" className="btn secondary full-width mt-4">
                        Crear cuenta
                    </button>

                    <p className="text-center mt-3">
                        ¿Ya tienes una cuenta? <a href="/login">Iniciar sesión</a>
                    </p>
                </form>
            </div>
        </div>
    );
};