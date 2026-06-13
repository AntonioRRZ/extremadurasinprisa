import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useAuth } from "../../store/auth";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

type FormValues = z.infer<typeof schema>;

export function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { login } = useAuth();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      setError(null);
      await login(values.email, values.password);
      navigate("/mi");
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : "No se pudo iniciar sesion");
    }
  });

  return (
    <section className="auth-shell">
      <form className="auth-card" onSubmit={onSubmit}>
        <span className="eyebrow">Acceso privado</span>
        <h1>Entrar</h1>
        <label>
          Email
          <input {...register("email")} type="email" />
          <span className="field-error">{errors.email?.message}</span>
        </label>
        <label>
          Contrasena
          <input {...register("password")} type="password" />
          <span className="field-error">{errors.password?.message}</span>
        </label>
        {error ? <p className="field-error">{error}</p> : null}
        <button className="primary-button" disabled={isSubmitting} type="submit">
          {isSubmitting ? "Entrando..." : "Entrar"}
        </button>
        <p>
          Tienes el pasaporte fisico? <Link to="/register">Crea tu cuenta con el codigo unico</Link>
        </p>
      </form>
    </section>
  );
}
