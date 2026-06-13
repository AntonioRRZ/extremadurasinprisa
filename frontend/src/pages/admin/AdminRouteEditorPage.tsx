import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";

import { api } from "../../api/client";
import { MapPanel } from "../../components/common/MapPanel";
import { useAuth } from "../../store/auth";
import { InterestPoint, Route, StampPoint } from "../../types/api";

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

type InterestPointForm = {
  name: string;
  slug: string;
  point_type: string;
  summary: string;
  description: string;
  address: string;
  city: string;
  province: string;
  lat: number;
  lng: number;
  website_url: string;
  contact_phone: string;
  schedule_notes: string;
  parking_notes: string;
  access_notes: string;
  pet_friendly: boolean;
  is_public_preview: boolean;
  sort_order: number;
};

const interestPointTypes = ["mirador", "gastronomia", "pernocta", "servicio", "bano", "patrimonio", "naturaleza"];

export function AdminRouteEditorPage() {
  const { routeId = "" } = useParams();
  const { accessToken } = useAuth();
  const [route, setRoute] = useState<Route | null>(null);
  const [stampPoints, setStampPoints] = useState<StampPoint[]>([]);
  const [interestPoints, setInterestPoints] = useState<InterestPoint[]>([]);
  const [latestQr, setLatestQr] = useState<string | null>(null);
  const stampForm = useForm<StampPointForm>();
  const interestForm = useForm<InterestPointForm>({
    defaultValues: {
      point_type: "mirador",
      is_public_preview: true,
      sort_order: 0,
    },
  });

  const load = async () => {
    if (!accessToken) {
      return;
    }
    const [routeData, stampData, interestData] = await Promise.all([
      api.get<Route>(`/admin/routes/${routeId}`, accessToken),
      api.get<{ stamp_points: StampPoint[] }>(`/admin/routes/${routeId}/stamp-points`, accessToken),
      api.get<{ interest_points: InterestPoint[] }>(`/admin/routes/${routeId}/interest-points`, accessToken),
    ]);
    setRoute(routeData);
    setStampPoints(stampData.stamp_points);
    setInterestPoints(interestData.interest_points);
  };

  useEffect(() => {
    void load();
  }, [accessToken, routeId]);

  const onSubmitStamp = stampForm.handleSubmit(async (values) => {
    if (!accessToken) {
      return;
    }
    const response = await api.post<{ stamp_point: StampPoint; qr_value: string }>(`/admin/routes/${routeId}/stamp-points`, values, accessToken);
    setLatestQr(response.qr_value);
    stampForm.reset();
    await load();
  });

  const onSubmitInterest = interestForm.handleSubmit(async (values) => {
    if (!accessToken) {
      return;
    }
    await api.post<InterestPoint>(`/admin/routes/${routeId}/interest-points`, values, accessToken);
    interestForm.reset({
      point_type: "mirador",
      is_public_preview: true,
      sort_order: 0,
    });
    await load();
  });

  return (
    <section className="page-shell">
      <div className="section-heading">
        <span className="eyebrow">Ruta</span>
        <h1>{route?.title ?? "Editor de ruta"}</h1>
        <p>{route?.description_short}</p>
      </div>

      <MapPanel interestPoints={interestPoints} points={stampPoints} title="Mapa mixto de sellos y puntos de interes" />

      <div className="route-detail-grid">
        <form className="admin-form" onSubmit={onSubmitStamp}>
          <h2>Punto oficial de sellado</h2>
          <input {...stampForm.register("name")} placeholder="Nombre del punto" />
          <input {...stampForm.register("slug")} placeholder="slug" />
          <input {...stampForm.register("category")} placeholder="Categoria" />
          <input {...stampForm.register("address")} placeholder="Direccion" />
          <input {...stampForm.register("city")} placeholder="Ciudad" />
          <input {...stampForm.register("province")} placeholder="Provincia" />
          <input {...stampForm.register("lat", { valueAsNumber: true })} placeholder="Latitud" type="number" step="0.000001" />
          <input {...stampForm.register("lng", { valueAsNumber: true })} placeholder="Longitud" type="number" step="0.000001" />
          <textarea {...stampForm.register("description_public")} placeholder="Descripcion publica" />
          <textarea {...stampForm.register("description_private")} placeholder="Descripcion privada" />
          <label className="checkbox-line">
            <input {...stampForm.register("is_public_preview")} type="checkbox" />
            Visible en teaser publico
          </label>
          <button className="primary-button" type="submit">
            Crear punto oficial
          </button>
        </form>

        <form className="admin-form" onSubmit={onSubmitInterest}>
          <h2>Punto de interes</h2>
          <input {...interestForm.register("name")} placeholder="Nombre del punto" />
          <input {...interestForm.register("slug")} placeholder="slug" />
          <select {...interestForm.register("point_type")}>
            {interestPointTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          <input {...interestForm.register("address")} placeholder="Direccion" />
          <input {...interestForm.register("city")} placeholder="Ciudad" />
          <input {...interestForm.register("province")} placeholder="Provincia" />
          <input {...interestForm.register("lat", { valueAsNumber: true })} placeholder="Latitud" type="number" step="0.000001" />
          <input {...interestForm.register("lng", { valueAsNumber: true })} placeholder="Longitud" type="number" step="0.000001" />
          <input {...interestForm.register("website_url")} placeholder="Web o referencia" />
          <input {...interestForm.register("contact_phone")} placeholder="Telefono" />
          <input {...interestForm.register("sort_order", { valueAsNumber: true })} placeholder="Orden" type="number" />
          <textarea {...interestForm.register("summary")} placeholder="Resumen editorial" />
          <textarea {...interestForm.register("description")} placeholder="Descripcion ampliada" />
          <textarea {...interestForm.register("schedule_notes")} placeholder="Notas de horario" />
          <textarea {...interestForm.register("parking_notes")} placeholder="Notas de aparcamiento" />
          <textarea {...interestForm.register("access_notes")} placeholder="Notas de acceso" />
          <label className="checkbox-line">
            <input {...interestForm.register("pet_friendly")} type="checkbox" />
            Apto para mascota
          </label>
          <label className="checkbox-line">
            <input {...interestForm.register("is_public_preview")} type="checkbox" />
            Visible en teaser publico
          </label>
          <button className="primary-button" type="submit">
            Crear punto de interes
          </button>
        </form>
      </div>

      {latestQr ? (
        <article className="story-card">
          <h3>Ultimo QR generado</h3>
          <p className="mono-text">{latestQr}</p>
        </article>
      ) : null}

      <section className="editorial-section">
        <div className="section-heading">
          <span className="eyebrow">Sellos</span>
          <h2>Puntos oficiales</h2>
        </div>
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

      <section className="editorial-section">
        <div className="section-heading">
          <span className="eyebrow">Interes</span>
          <h2>Puntos editoriales</h2>
        </div>
        <div className="stamp-list">
          {interestPoints.map((point) => (
            <article className="story-card" key={point.id}>
              <h3>{point.name}</h3>
              <p>{point.point_type}</p>
              <p>
                {point.city}, {point.province}
              </p>
              <p>{point.summary}</p>
            </article>
          ))}
        </div>
      </section>
    </section>
  );
}
