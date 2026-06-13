import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";

import { api, formatDate } from "../../api/client";
import { AdminTable } from "../../components/common/AdminTable";
import { StatusBadge } from "../../components/common/StatusBadge";
import { useAuth } from "../../store/auth";
import { AdminStampEvent, AdminStampsResponse } from "../../types/api";

type StampFiltersForm = {
  q: string;
  scan_source: string;
  user_id: string;
  passport_id: string;
  stamp_point_id: string;
};

export function AdminStampsPage() {
  const { accessToken } = useAuth();
  const [response, setResponse] = useState<AdminStampsResponse | null>(null);
  const [selectedStampId, setSelectedStampId] = useState<number | null>(null);
  const { register, handleSubmit, getValues } = useForm<StampFiltersForm>({
    defaultValues: {
      q: "",
      scan_source: "",
      user_id: "",
      passport_id: "",
      stamp_point_id: "",
    },
  });

  const load = async (filters: StampFiltersForm) => {
    if (!accessToken) {
      return;
    }
    const params = new URLSearchParams();
    if (filters.q.trim()) {
      params.set("q", filters.q.trim());
    }
    if (filters.scan_source) {
      params.set("scan_source", filters.scan_source);
    }
    if (filters.user_id.trim()) {
      params.set("user_id", filters.user_id.trim());
    }
    if (filters.passport_id.trim()) {
      params.set("passport_id", filters.passport_id.trim());
    }
    if (filters.stamp_point_id.trim()) {
      params.set("stamp_point_id", filters.stamp_point_id.trim());
    }
    const query = params.toString();
    const data = await api.get<AdminStampsResponse>(`/admin/stamps${query ? `?${query}` : ""}`, accessToken);
    setResponse(data);
    setSelectedStampId((current) => current ?? data.stamps[0]?.stamp_id ?? null);
  };

  useEffect(() => {
    void load(getValues());
  }, [accessToken]);

  useEffect(() => {
    if (!response?.stamps.length) {
      setSelectedStampId(null);
      return;
    }
    if (!response.stamps.some((stamp) => stamp.stamp_id === selectedStampId)) {
      setSelectedStampId(response.stamps[0].stamp_id);
    }
  }, [response, selectedStampId]);

  const onSubmitFilters = handleSubmit(async (values) => {
    await load(values);
  });

  const selectedStamp = useMemo(
    () => response?.stamps.find((stamp) => stamp.stamp_id === selectedStampId) ?? response?.stamps[0] ?? null,
    [response, selectedStampId],
  );

  return (
    <section className="page-shell">
      <div className="section-heading">
        <span className="eyebrow">Admin</span>
        <h1>Sellos</h1>
        <p>Actividad y auditoria del sellado oficial con filtros por fuente, usuario, pasaporte y punto.</p>
      </div>

      <form className="admin-form admin-form-wide" onSubmit={onSubmitFilters}>
        <div className="route-detail-grid">
          <input {...register("q")} placeholder="Buscar por ruta, serie, punto o usuario" />
          <select {...register("scan_source")}>
            <option value="">Todas las fuentes</option>
            <option value="qr_scan">qr_scan</option>
            <option value="admin_manual">admin_manual</option>
          </select>
          <input {...register("user_id")} placeholder="ID usuario viajero" />
          <input {...register("passport_id")} placeholder="ID pasaporte" />
          <input {...register("stamp_point_id")} placeholder="ID punto de sellado" />
        </div>
        <div className="hero-actions">
          <button className="primary-button" type="submit">
            Aplicar filtros
          </button>
        </div>
      </form>

      <div className="route-detail-grid">
        <article className="story-card">
          <h3>Total eventos</h3>
          <p>{response?.total ?? 0}</p>
        </article>
        <article className="story-card">
          <h3>QR</h3>
          <p>{response?.qr_scan_count ?? 0}</p>
        </article>
        <article className="story-card">
          <h3>Manual</h3>
          <p>{response?.manual_count ?? 0}</p>
        </article>
      </div>

      {!response?.stamps.length ? (
        <article className="story-card">
          <h3>Sin resultados</h3>
          <p>No hay eventos de sellado con los filtros actuales.</p>
        </article>
      ) : (
        <div className="admin-editor-layout">
          <div className="admin-editor-lists">
            <AdminTable
              headers={["Fecha", "Fuente", "Viajero", "Registrado por", "Pasaporte", "Ruta", "Punto", "Estado", "Detalle"]}
              rows={response.stamps.map((stamp) => [
                formatDate(stamp.stamped_at),
                <StatusBadge key={`source-${stamp.stamp_id}`} value={stamp.scan_source} />,
                `${stamp.traveler_user.full_name} (${stamp.traveler_user.email})`,
                stamp.recorded_by_user ? `${stamp.recorded_by_user.full_name} (${stamp.recorded_by_user.email})` : "Sin actor auditado",
                stamp.passport_serial_number,
                stamp.route_title,
                `${stamp.stamp_point_name} (${stamp.stamp_point_city})`,
                <StatusBadge key={`status-${stamp.stamp_id}`} value={stamp.validation_status} />,
                <button
                  className="ghost-button"
                  key={`detail-${stamp.stamp_id}`}
                  onClick={() => setSelectedStampId(stamp.stamp_id)}
                  type="button"
                >
                  Abrir
                </button>,
              ])}
            />
          </div>

          <aside className="admin-editor-panel">
            {selectedStamp ? (
              <article className="story-card">
                <div className="editor-panel-heading">
                  <div>
                    <span className="eyebrow">Evento</span>
                    <h2>Sello #{selectedStamp.stamp_id}</h2>
                  </div>
                  <div className="inline-badges">
                    <StatusBadge value={selectedStamp.scan_source} />
                    <StatusBadge value={selectedStamp.validation_status} />
                  </div>
                </div>
                <p>Fecha: {formatDate(selectedStamp.stamped_at)}</p>
                <p>Accion auditada: {selectedStamp.audit_action ?? "Sin registro complementario"}</p>
                <p>Ruta: {selectedStamp.route_title}</p>
                <p>Pasaporte: {selectedStamp.passport_serial_number}</p>
                <p>Titular: {selectedStamp.passport_owner_name ?? "Sin alias"}</p>
                <p>Tipo: {selectedStamp.passport_type_name}</p>
                <p>
                  Punto: {selectedStamp.stamp_point_name} · {selectedStamp.stamp_point_city}, {selectedStamp.stamp_point_province}
                </p>
                <p>Viajero: {selectedStamp.traveler_user.full_name} ({selectedStamp.traveler_user.email})</p>
                <p>
                  Registrado por:{" "}
                  {selectedStamp.recorded_by_user
                    ? `${selectedStamp.recorded_by_user.full_name} (${selectedStamp.recorded_by_user.email})`
                    : "Sin actor auditado"}
                </p>
                <div className="route-meta-toggles">
                  <span className="passport-code">passport_id {selectedStamp.passport_id}</span>
                  <span className="passport-code">stamp_point_id {selectedStamp.stamp_point_id}</span>
                  <span className="passport-code">user_id {selectedStamp.traveler_user.id}</span>
                </div>
              </article>
            ) : (
              <article className="story-card">
                <h3>Sin seleccion</h3>
                <p>Selecciona un evento para revisar su trazabilidad completa.</p>
              </article>
            )}
          </aside>
        </div>
      )}
    </section>
  );
}
