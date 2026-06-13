import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";

import { api } from "../../api/client";
import { MapPanel } from "../../components/common/MapPanel";
import { StatusBadge } from "../../components/common/StatusBadge";
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
  const [selectedItem, setSelectedItem] = useState<{ kind: "stamp" | "interest"; id: number } | null>(null);
  const [editorMessage, setEditorMessage] = useState<string | null>(null);
  const stampForm = useForm<StampPointForm>();
  const interestForm = useForm<InterestPointForm>({
    defaultValues: {
      point_type: "mirador",
      is_public_preview: true,
      sort_order: 0,
    },
  });
  const stampEditForm = useForm<StampPointForm>();
  const interestEditForm = useForm<InterestPointForm>({
    defaultValues: {
      point_type: "mirador",
      is_public_preview: true,
      sort_order: 0,
    },
  });

  const selectedStampPoint = useMemo(
    () => (selectedItem?.kind === "stamp" ? stampPoints.find((point) => point.id === selectedItem.id) ?? null : null),
    [selectedItem, stampPoints],
  );
  const selectedInterestPoint = useMemo(
    () => (selectedItem?.kind === "interest" ? interestPoints.find((point) => point.id === selectedItem.id) ?? null : null),
    [selectedItem, interestPoints],
  );

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
    setSelectedItem((current) => {
      if (current?.kind === "stamp" && stampData.stamp_points.some((point) => point.id === current.id)) {
        return current;
      }
      if (current?.kind === "interest" && interestData.interest_points.some((point) => point.id === current.id)) {
        return current;
      }
      if (stampData.stamp_points[0]) {
        return { kind: "stamp", id: stampData.stamp_points[0].id };
      }
      if (interestData.interest_points[0]) {
        return { kind: "interest", id: interestData.interest_points[0].id };
      }
      return null;
    });
  };

  useEffect(() => {
    void load();
  }, [accessToken, routeId]);

  useEffect(() => {
    if (!selectedStampPoint) {
      return;
    }
    stampEditForm.reset({
      name: selectedStampPoint.name,
      slug: selectedStampPoint.slug,
      description_public: selectedStampPoint.description_public,
      description_private: selectedStampPoint.description_private ?? "",
      category: selectedStampPoint.category,
      address: selectedStampPoint.address ?? "",
      city: selectedStampPoint.city,
      province: selectedStampPoint.province,
      lat: selectedStampPoint.lat,
      lng: selectedStampPoint.lng,
      is_public_preview: selectedStampPoint.is_public_preview,
    });
  }, [selectedStampPoint, stampEditForm]);

  useEffect(() => {
    if (!selectedInterestPoint) {
      return;
    }
    interestEditForm.reset({
      name: selectedInterestPoint.name,
      slug: selectedInterestPoint.slug,
      point_type: selectedInterestPoint.point_type,
      summary: selectedInterestPoint.summary,
      description: selectedInterestPoint.description ?? "",
      address: selectedInterestPoint.address ?? "",
      city: selectedInterestPoint.city,
      province: selectedInterestPoint.province,
      lat: selectedInterestPoint.lat,
      lng: selectedInterestPoint.lng,
      website_url: selectedInterestPoint.website_url ?? "",
      contact_phone: selectedInterestPoint.contact_phone ?? "",
      schedule_notes: selectedInterestPoint.schedule_notes ?? "",
      parking_notes: selectedInterestPoint.parking_notes ?? "",
      access_notes: selectedInterestPoint.access_notes ?? "",
      pet_friendly: selectedInterestPoint.pet_friendly ?? false,
      is_public_preview: selectedInterestPoint.is_public_preview,
      sort_order: selectedInterestPoint.sort_order ?? 0,
    });
  }, [selectedInterestPoint, interestEditForm]);

  const onSubmitStamp = stampForm.handleSubmit(async (values) => {
    if (!accessToken) {
      return;
    }
    const response = await api.post<{ stamp_point: StampPoint; qr_value: string }>(`/admin/routes/${routeId}/stamp-points`, values, accessToken);
    setLatestQr(response.qr_value);
    setEditorMessage("Punto oficial creado.");
    stampForm.reset();
    await load();
    setSelectedItem({ kind: "stamp", id: response.stamp_point.id });
  });

  const onSubmitInterest = interestForm.handleSubmit(async (values) => {
    if (!accessToken) {
      return;
    }
    const created = await api.post<InterestPoint>(`/admin/routes/${routeId}/interest-points`, values, accessToken);
    setEditorMessage("Punto de interes creado.");
    interestForm.reset({
      point_type: "mirador",
      is_public_preview: true,
      sort_order: 0,
    });
    await load();
    setSelectedItem({ kind: "interest", id: created.id });
  });

  const onSubmitStampEdit = stampEditForm.handleSubmit(async (values) => {
    if (!accessToken || !selectedStampPoint) {
      return;
    }
    await api.patch<StampPoint>(`/admin/stamp-points/${selectedStampPoint.id}`, values, accessToken);
    setEditorMessage("Punto oficial actualizado.");
    await load();
  });

  const onSubmitInterestEdit = interestEditForm.handleSubmit(async (values) => {
    if (!accessToken || !selectedInterestPoint) {
      return;
    }
    await api.patch<InterestPoint>(`/admin/interest-points/${selectedInterestPoint.id}`, values, accessToken);
    setEditorMessage("Punto de interes actualizado.");
    await load();
  });

  const onRegenerateQr = async () => {
    if (!accessToken || !selectedStampPoint) {
      return;
    }
    const response = await api.post<{ stamp_point: StampPoint; qr_value: string }>(
      `/admin/stamp-points/${selectedStampPoint.id}/regenerate-qr`,
      {},
      accessToken,
    );
    setLatestQr(response.qr_value);
    setEditorMessage("QR regenerado.");
    await load();
  };

  return (
    <section className="page-shell">
      <div className="section-heading">
        <span className="eyebrow">Ruta</span>
        <h1>{route?.title ?? "Editor de ruta"}</h1>
        <p>{route?.description_short}</p>
      </div>

      <MapPanel interestPoints={interestPoints} points={stampPoints} title="Mapa mixto de sellos y puntos de interes" />

      {editorMessage ? (
        <article className="story-card">
          <h3>Estado del editor</h3>
          <p>{editorMessage}</p>
        </article>
      ) : null}

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
          <span className="eyebrow">Edicion</span>
          <h2>Puntos existentes</h2>
          <p>Selecciona un punto y editalo en el panel lateral sin salir del editor de ruta.</p>
        </div>

        <div className="admin-editor-layout">
          <div className="admin-editor-lists">
            <article className="story-card">
              <h3>Puntos oficiales</h3>
              <div className="stamp-list">
                {stampPoints.map((point) => (
                  <button
                    className={`story-card selectable-card ${selectedItem?.kind === "stamp" && selectedItem.id === point.id ? "active" : ""}`}
                    key={point.id}
                    onClick={() => setSelectedItem({ kind: "stamp", id: point.id })}
                    type="button"
                  >
                    <span className="card-kicker">Sello</span>
                    <h3>{point.name}</h3>
                    <p>
                      {point.city}, {point.province}
                    </p>
                    <p>{point.description_public}</p>
                    <StatusBadge value={point.is_public_preview ? "preview" : "private"} />
                  </button>
                ))}
              </div>
            </article>

            <article className="story-card">
              <h3>Puntos de interes</h3>
              <div className="stamp-list">
                {interestPoints.map((point) => (
                  <button
                    className={`story-card selectable-card ${selectedItem?.kind === "interest" && selectedItem.id === point.id ? "active" : ""}`}
                    key={point.id}
                    onClick={() => setSelectedItem({ kind: "interest", id: point.id })}
                    type="button"
                  >
                    <span className="card-kicker">Interes</span>
                    <h3>{point.name}</h3>
                    <p>{point.point_type}</p>
                    <p>
                      {point.city}, {point.province}
                    </p>
                    <p>{point.summary}</p>
                  </button>
                ))}
              </div>
            </article>
          </div>

          <aside className="admin-editor-panel">
            {selectedStampPoint ? (
              <form className="admin-form" onSubmit={onSubmitStampEdit}>
                <div className="editor-panel-heading">
                  <div>
                    <span className="eyebrow">Detalle</span>
                    <h2>{selectedStampPoint.name}</h2>
                  </div>
                  <StatusBadge value="stamp_point" />
                </div>
                <input {...stampEditForm.register("name")} placeholder="Nombre del punto" />
                <input {...stampEditForm.register("slug")} placeholder="slug" />
                <input {...stampEditForm.register("category")} placeholder="Categoria" />
                <input {...stampEditForm.register("address")} placeholder="Direccion" />
                <input {...stampEditForm.register("city")} placeholder="Ciudad" />
                <input {...stampEditForm.register("province")} placeholder="Provincia" />
                <input {...stampEditForm.register("lat", { valueAsNumber: true })} placeholder="Latitud" step="0.000001" type="number" />
                <input {...stampEditForm.register("lng", { valueAsNumber: true })} placeholder="Longitud" step="0.000001" type="number" />
                <textarea {...stampEditForm.register("description_public")} placeholder="Descripcion publica" />
                <textarea {...stampEditForm.register("description_private")} placeholder="Descripcion privada" />
                <label className="checkbox-line">
                  <input {...stampEditForm.register("is_public_preview")} type="checkbox" />
                  Visible en teaser publico
                </label>
                <div className="hero-actions">
                  <button className="primary-button" type="submit">
                    Guardar punto oficial
                  </button>
                  <button className="ghost-button" onClick={onRegenerateQr} type="button">
                    Regenerar QR
                  </button>
                </div>
              </form>
            ) : null}

            {selectedInterestPoint ? (
              <form className="admin-form" onSubmit={onSubmitInterestEdit}>
                <div className="editor-panel-heading">
                  <div>
                    <span className="eyebrow">Detalle</span>
                    <h2>{selectedInterestPoint.name}</h2>
                  </div>
                  <StatusBadge value={selectedInterestPoint.point_type} />
                </div>
                <input {...interestEditForm.register("name")} placeholder="Nombre del punto" />
                <input {...interestEditForm.register("slug")} placeholder="slug" />
                <select {...interestEditForm.register("point_type")}>
                  {interestPointTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                <input {...interestEditForm.register("address")} placeholder="Direccion" />
                <input {...interestEditForm.register("city")} placeholder="Ciudad" />
                <input {...interestEditForm.register("province")} placeholder="Provincia" />
                <input {...interestEditForm.register("lat", { valueAsNumber: true })} placeholder="Latitud" step="0.000001" type="number" />
                <input {...interestEditForm.register("lng", { valueAsNumber: true })} placeholder="Longitud" step="0.000001" type="number" />
                <input {...interestEditForm.register("website_url")} placeholder="Web o referencia" />
                <input {...interestEditForm.register("contact_phone")} placeholder="Telefono" />
                <input {...interestEditForm.register("sort_order", { valueAsNumber: true })} placeholder="Orden" type="number" />
                <textarea {...interestEditForm.register("summary")} placeholder="Resumen editorial" />
                <textarea {...interestEditForm.register("description")} placeholder="Descripcion ampliada" />
                <textarea {...interestEditForm.register("schedule_notes")} placeholder="Notas de horario" />
                <textarea {...interestEditForm.register("parking_notes")} placeholder="Notas de aparcamiento" />
                <textarea {...interestEditForm.register("access_notes")} placeholder="Notas de acceso" />
                <label className="checkbox-line">
                  <input {...interestEditForm.register("pet_friendly")} type="checkbox" />
                  Apto para mascota
                </label>
                <label className="checkbox-line">
                  <input {...interestEditForm.register("is_public_preview")} type="checkbox" />
                  Visible en teaser publico
                </label>
                <button className="primary-button" type="submit">
                  Guardar punto de interes
                </button>
              </form>
            ) : null}

            {!selectedStampPoint && !selectedInterestPoint ? (
              <article className="story-card">
                <h3>Sin seleccion</h3>
                <p>Selecciona un punto oficial o un punto de interes para editarlo.</p>
              </article>
            ) : null}
          </aside>
        </div>
      </section>
    </section>
  );
}
