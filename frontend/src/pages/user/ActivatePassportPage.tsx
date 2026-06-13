import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { api } from "../../api/client";
import { useAuth } from "../../store/auth";
import { Passport } from "../../types/api";

type Values = {
  activation_code: string;
  owner_display_name: string;
  start_date: string;
};

export function ActivatePassportPage() {
  const navigate = useNavigate();
  const { accessToken, user } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const { register, handleSubmit } = useForm<Values>({
    defaultValues: {
      owner_display_name: user?.full_name ?? "",
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    if (!accessToken) {
      navigate("/login");
      return;
    }
    try {
      setError(null);
      const passport = await api.post<Passport>(
        "/me/passports/activate",
        {
          ...values,
          start_date: values.start_date || undefined,
        },
        accessToken,
      );
      navigate(`/mi/pasaportes/${passport.id}`);
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : "No se pudo activar");
    }
  });

  return (
    <section className="auth-shell">
      <form className="auth-card" onSubmit={onSubmit}>
        <span className="eyebrow">Activacion</span>
        <h1>Desbloquear pasaporte</h1>
        <label>
          Codigo unico
          <input {...register("activation_code")} placeholder="DEMO-ACT-001" />
        </label>
        <label>
          Nombre del portador
          <input {...register("owner_display_name")} />
        </label>
        <label>
          Fecha de inicio
          <input {...register("start_date")} type="date" />
        </label>
        {error ? <p className="field-error">{error}</p> : null}
        <button className="primary-button" type="submit">
          Activar
        </button>
      </form>
    </section>
  );
}
