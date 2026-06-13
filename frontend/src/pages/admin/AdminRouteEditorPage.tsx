import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";

import { api } from "../../api/client";
import { useAuth } from "../../store/auth";
import { Route, StampPoint } from "../../types/api";

type StampPointForm = {
  name: string;
  slug: string;
  description_public: string;
  description_private: string;
  category: string;
  address: string;
  city: string;
  province: string;
  lat: number;
  lng: number;
  is_public_preview: boolean;
};

export function AdminRouteEditorPage() {
  const { routeId = "" } = useParams();
  const { accessToken } = useAuth();
  const [route, setRoute] = useState<Route | null>(null);
  const [stampPoints, setStampPoints] = useState<StampPoint[]>([]);
  const [latestQr, setLatestQr] = useState<string | null>(null);
  const { register, handleSubmit, reset } = useForm<StampPointForm>();

  const load = async () => {
    if (!accessToken) {
      return;
    }
    const [routeData, stampData] = await Promise.all([
      api.get<Route>(`/admin/routes/${routeId}`, accessToken),
      api.get<{ stamp_points: StampPoint[] }>(`/admin/routes/${routeId}/stamp-points`, accessToken),
    ]);
    setRoute(routeData);
    setStampPoints(stampData.stamp_points);
  };

  useEffect(() => {
    void load();
  }, [accessToken, routeId]);

  const onSubmit = handleSubmit(async (values) => {
    if (!accessToken) {
      return;
    }
    const response = await api.post<{ stamp_point: StampPoint; qr_value: string }>(`/admin/routes/${routeId}/stamp-points`, values, accessToken);
    setLatestQr(response.qr_value);
    reset();
    await load();
  });

  return (
    <section className="page-shell">
      <div className="section-heading">
        <span className="eyebrow">Ruta</span>
        <h1>{route?.title ?? "Editor de ruta"}</h1>
      </div>
      <form className="admin-form" onSubmit={onSubmit}>
        <input {...register("name")} placeholder="Nombre del punto" />
        <input {...register("slug")} placeholder="slug" />
        <input {...register("category")} placeholder="Categoria" />
        <input {...register("address")} placeholder="Direccion" />
        <input {...register("city")} placeholder="Ciudad" />
        <input {...register("province")} placeholder="Provincia" />
        <input {...register("lat", { valueAsNumber: true })} placeholder="Latitud" type="number" step="0.000001" />
        <input {...register("lng", { valueAsNumber: true })} placeholder="Longitud" type="number" step="0.000001" />
        <textarea {...register("description_public")} placeholder="Descripcion publica" />
        <textarea {...register("description_private")} placeholder="Descripcion privada" />
        <label className="checkbox-line">
          <input {...register("is_public_preview")} type="checkbox" />
          Visible en teaser publico
        </label>
        <button className="primary-button" type="submit">
          Crear punto oficial
        </button>
      </form>
      {latestQr ? (
        <article className="story-card">
          <h3>Ultimo QR generado</h3>
          <p className="mono-text">{latestQr}</p>
        </article>
      ) : null}
      <div className="stamp-list">
        {stampPoints.map((point) => (
          <article className="story-card" key={point.id}>
            <h3>{point.name}</h3>
            <p>
              {point.city}, {point.province}
            </p>
            <p>{point.description_public}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

