import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useAuth } from "../../store/auth";

const schema = z.object({
  full_name: z.string().min(3),
  email: z.string().email(),
  phone: z.string().optional(),
  password: z.string().min(8),
});

type FormValues = z.infer<typeof schema>;

export function RegisterPage() {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { register: registerUser } = useAuth();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      setError(null);
      await registerUser(values);
      navigate("/activar");
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : "No se pudo crear la cuenta");
    }
  });

  return (
    <section className="auth-shell">
      <form className="auth-card" onSubmit={onSubmit}>
        <span className="eyebrow">Nueva cuenta</span>
        <h1>Crear usuario</h1>
        <label>
          Nombre completo
          <input {...register("full_name")} />
          <span className="field-error">{errors.full_name?.message}</span>
        </label>
        <label>
          Email
          <input {...register("email")} type="email" />
          <span className="field-error">{errors.email?.message}</span>
        </label>
        <label>
          Telefono
          <input {...register("phone")} />
        </label>
        <label>
          Contrasena
          <input {...register("password")} type="password" />
          <span className="field-error">{errors.password?.message}</span>
        </label>
        {error ? <p className="field-error">{error}</p> : null}
        <button className="primary-button" disabled={isSubmitting} type="submit">
          {isSubmitting ? "Creando..." : "Crear cuenta"}
        </button>
        <p>
          Ya tienes cuenta? <Link to="/login">Entrar</Link>
        </p>
      </form>
    </section>
  );
}

