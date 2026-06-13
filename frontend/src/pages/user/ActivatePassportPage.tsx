import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

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
  const { accessToken, user, loading } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const { register, handleSubmit, reset, getValues } = useForm<Values>({
    defaultValues: {
      owner_display_name: user?.full_name ?? "",
    },
  });

  useEffect(() => {
    if (user) {
      const currentValues = getValues();
      reset({
        ...currentValues,
        owner_display_name: currentValues.owner_display_name || user.full_name,
      });
    }
  }, [getValues, reset, user]);

  if (loading) {
    return <section className="auth-shell">Cargando...</section>;
  }

  if (!user) {
    return (
      <section className="page-shell">
        <div className="section-heading">
          <span className="eyebrow">Activacion</span>
          <h1>Desbloquea tu pasaporte cuando lo recibas</h1>
          <p>Necesitas el codigo unico del pasaporte fisico para crear tu cuenta y acceder a la ruta privada.</p>
        </div>
        <div className="route-detail-grid">
          <article className="story-card">
            <h3>Primer acceso</h3>
            <p>Crea tu cuenta con el codigo unico y entraras directamente en tu area privada.</p>
            <Link className="primary-button" to="/register">
              Crear cuenta con codigo
            </Link>
          </article>
          <article className="story-card">
            <h3>Ya tengo cuenta</h3>
            <p>Si ya activaste un pasaporte antes, inicia sesion y podras vincular otro desde aqui.</p>
            <Link className="ghost-button" to="/login">
              Iniciar sesion
            </Link>
          </article>
        </div>
      </section>
    );
  }

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
        <h1>Vincular otro pasaporte</h1>
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
