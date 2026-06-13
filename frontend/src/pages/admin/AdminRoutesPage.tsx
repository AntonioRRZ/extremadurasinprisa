import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

import { api } from "../../api/client";
import { useAuth } from "../../store/auth";
import { Route } from "../../types/api";

type RouteForm = {
  slug: string;
  title: string;
  subtitle: string;
  description_short: string;
  description_long: string;
  province_scope: string;
  distance_km: number;
  estimated_days_min: number;
  estimated_days_max: number;
  hero_image_url: string;
  status: string;
  min_stamps_to_complete: number;
};

export function AdminRoutesPage() {
  const { accessToken } = useAuth();
  const [routes, setRoutes] = useState<Route[]>([]);
  const { register, handleSubmit, reset } = useForm<RouteForm>({
    defaultValues: {
      status: "draft",
      min_stamps_to_complete: 4,
    },
  });

  const loadRoutes = async () => {
    if (!accessToken) {
      return;
    }
    const data = await api.get<{ routes: Route[] }>("/admin/routes", accessToken);
    setRoutes(data.routes);
  };

  useEffect(() => {
    void loadRoutes();
  }, [accessToken]);

  const onSubmit = handleSubmit(async (values) => {
    if (!accessToken) {
      return;
    }
    await api.post<Route>("/admin/routes", { ...values, public_teaser_enabled: true, private_map_enabled: true }, accessToken);
    reset();
    await loadRoutes();
  });

  return (
    <section className="page-shell">
      <div className="section-heading">
        <span className="eyebrow">Admin</span>
        <h1>Rutas</h1>
      </div>
      <form className="admin-form" onSubmit={onSubmit}>
        <input {...register("slug")} placeholder="slug" />
        <input {...register("title")} placeholder="Titulo" />
        <input {...register("subtitle")} placeholder="Subtitulo" />
        <input {...register("province_scope")} placeholder="Provincias" />
        <input {...register("distance_km", { valueAsNumber: true })} placeholder="Km" type="number" />
        <input {...register("estimated_days_min", { valueAsNumber: true })} placeholder="Dias min" type="number" />
        <input {...register("estimated_days_max", { valueAsNumber: true })} placeholder="Dias max" type="number" />
        <input {...register("hero_image_url")} placeholder="Hero image URL" />
        <textarea {...register("description_short")} placeholder="Descripcion corta" />
        <textarea {...register("description_long")} placeholder="Descripcion larga" />
        <select {...register("status")}>
          <option value="draft">draft</option>
          <option value="published">published</option>
          <option value="archived">archived</option>
        </select>
        <input {...register("min_stamps_to_complete", { valueAsNumber: true })} type="number" placeholder="Sellos minimos" />
        <button className="primary-button" type="submit">
          Crear ruta
        </button>
      </form>
      <div className="route-list">
        {routes.map((route) => (
          <article className="route-card" key={route.id}>
            <div className="route-card-copy">
              <h2>{route.title}</h2>
              <p>{route.description_short}</p>
            </div>
            <Link className="ghost-button" to={`/admin/rutas/${route.id}`}>
              Editar ruta
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}

