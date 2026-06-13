import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useAuth } from "../../store/auth";

const schema = z.object({
  activation_code: z.string().min(4),
  full_name: z.string().min(3),
  owner_display_name: z.string().optional(),
  email: z.string().email(),
  phone: z.string().optional(),
  password: z.string().min(8),
  start_date: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export function ActivationRegisterPage() {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { activationRegister } = useAuth();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      setError(null);
      await activationRegister({
        ...values,
        start_date: values.start_date || undefined,
        owner_display_name: values.owner_display_name || values.full_name,
      });
      navigate("/mi/pasaportes");
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : "No se pudo crear la cuenta");
    }
  });

  return (
    <section className="auth-shell">
      <form className="auth-card" onSubmit={onSubmit}>
        <span className="eyebrow">Alta con codigo</span>
        <h1>Crear cuenta y activar pasaporte</h1>
        <label>
          Codigo unico del pasaporte
          <input {...register("activation_code")} placeholder="DEMO-ACT-001" />
          <span className="field-error">{errors.activation_code?.message}</span>
        </label>
        <label>
          Nombre completo
          <input {...register("full_name")} />
          <span className="field-error">{errors.full_name?.message}</span>
        </label>
        <label>
          Nombre visible en el pasaporte
          <input {...register("owner_display_name")} placeholder="Opcional, si quieres un nombre distinto" />
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
        <label>
          Fecha de inicio
          <input {...register("start_date")} type="date" />
        </label>
        {error ? <p className="field-error">{error}</p> : null}
        <button className="primary-button" disabled={isSubmitting} type="submit">
          {isSubmitting ? "Activando..." : "Crear cuenta y activar"}
        </button>
        <p>
          Ya tienes cuenta? <Link to="/login">Entrar</Link>
        </p>
      </form>
    </section>
  );
}
