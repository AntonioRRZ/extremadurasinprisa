import { useEffect, useMemo, useState } from "react";

import { api, formatDate } from "../../api/client";
import { MapPanel } from "../../components/common/MapPanel";
import { ProgressBar } from "../../components/common/ProgressBar";
import { StatusBadge } from "../../components/common/StatusBadge";
import { useAuth } from "../../store/auth";
import { AdminActivePassportDetail, AdminActivePassportListItem } from "../../types/api";

export function AdminActivePassportsPage() {
  const { accessToken } = useAuth();
  const [passports, setPassports] = useState<AdminActivePassportListItem[]>([]);
  const [selectedPassportId, setSelectedPassportId] = useState<number | null>(null);
  const [detail, setDetail] = useState<AdminActivePassportDetail | null>(null);

  useEffect(() => {
    if (!accessToken) {
      return;
    }
    void api.get<{ passports: AdminActivePassportListItem[] }>("/admin/active-passports", accessToken).then((data) => {
      setPassports(data.passports);
      setSelectedPassportId((current) => current ?? data.passports[0]?.passport.id ?? null);
    });
  }, [accessToken]);

  useEffect(() => {
    if (!accessToken || !selectedPassportId) {
      setDetail(null);
      return;
    }
    void api.get<AdminActivePassportDetail>(`/admin/active-passports/${selectedPassportId}`, accessToken).then(setDetail);
  }, [accessToken, selectedPassportId]);

  const totalStamps = useMemo(
    () => passports.reduce((sum, item) => sum + item.passport.stamps_count, 0),
    [passports],
  );

  return (
    <section className="page-shell">
      <div className="section-heading">
        <span className="eyebrow">Admin</span>
        <h1>Pasaportes activos</h1>
        <p>Seguimiento operativo de pasaportes en movimiento usando el ultimo punto sellado como referencia de avance.</p>
      </div>

      <div className="route-detail-grid">
        <article className="story-card">
          <h3>En movimiento</h3>
          <p>{passports.length} pasaportes activos</p>
        </article>
        <article className="story-card">
          <h3>Sellos validados</h3>
          <p>{totalStamps} sellos acumulados</p>
        </article>
        <article className="story-card">
          <h3>Ultimo control</h3>
          <p>{formatDate(detail?.last_stamp?.stamped_at ?? passports[0]?.last_stamp?.stamped_at ?? null)}</p>
        </article>
      </div>

      {!passports.length ? (
        <article className="story-card">
          <h3>Sin pasaportes activos</h3>
          <p>No hay pasaportes en movimiento ahora mismo.</p>
        </article>
      ) : (
        <div className="admin-editor-layout">
          <div className="admin-editor-lists">
            <article className="story-card">
              <h3>Listado operativo</h3>
              <div className="stamp-list">
                {passports.map((item) => (
                  <button
                    className={`story-card selectable-card ${selectedPassportId === item.passport.id ? "active" : ""}`}
                    key={item.passport.id}
                    onClick={() => setSelectedPassportId(item.passport.id)}
                    type="button"
                  >
                    <span className="card-kicker">{item.passport.route_title}</span>
                    <h3>{item.user.full_name}</h3>
                    <p>Serie {item.passport.serial_number}</p>
                    <p>{item.passport.passport_type_name}</p>
                    <div className="inline-badges">
                      <StatusBadge value={item.passport.operational_status} />
                      <StatusBadge value={item.passport.stamp_status} />
                    </div>
                    <p>
                      Ultimo punto: {item.last_stamp?.stamp_point_name ?? "Sin sellos"}
                    </p>
                    <p>
                      Fecha: {formatDate(item.last_stamp?.stamped_at ?? null)}
                    </p>
                  </button>
                ))}
              </div>
            </article>
          </div>

          <aside className="admin-editor-panel">
            {detail ? (
              <>
                <div className="route-detail-grid">
                  <article className="passport-card">
                    <span className="passport-code">{detail.passport.serial_number}</span>
                    <StatusBadge value={detail.passport.operational_status} />
                    <h3>{detail.user.full_name}</h3>
                    <p>{detail.user.email}</p>
                    <p>{detail.passport.route_title}</p>
                    <ProgressBar
                      label={`${detail.passport.stamps_count}/${detail.passport.required_stamps} sellos`}
                      value={detail.passport.progress_percent}
                    />
                  </article>
                  <article className="story-card">
                    <h3>Ultimo punto sellado</h3>
                    <p>{detail.last_stamp?.stamp_point_name ?? "Sin actividad todavia"}</p>
                    <p>{formatDate(detail.last_stamp?.stamped_at ?? null)}</p>
                    <p>
                      {detail.last_stamp_point
                        ? `${detail.last_stamp_point.city}, ${detail.last_stamp_point.province}`
                        : "Aun sin referencia operativa"}
                    </p>
                  </article>
                  <article className="story-card">
                    <h3>Resena del recorrido</h3>
                    <p>{detail.stamps.length} puntos validados sobre la ruta.</p>
                    <p>Activado: {formatDate(detail.passport.activated_at)}</p>
                    <p>{detail.route.subtitle}</p>
                  </article>
                </div>

                <MapPanel
                  highlightedPointIds={detail.stamps.map((stamp) => stamp.stamp_point_id)}
                  points={detail.stamp_points}
                  title="Mapa de avance del pasaporte"
                />

                <section className="editorial-section">
                  <div className="section-heading">
                    <span className="eyebrow">Recorrido</span>
                    <h2>Timeline de sellos</h2>
                  </div>
                  <div className="stamp-list">
                    {detail.stamps.length ? (
                      detail.stamps.map((stamp) => (
                        <article className="story-card" key={stamp.id}>
                          <h3>{stamp.stamp_point_name}</h3>
                          <p>{formatDate(stamp.stamped_at)}</p>
                          <StatusBadge value={stamp.validation_status} />
                        </article>
                      ))
                    ) : (
                      <article className="story-card">
                        <h3>Sin sellos aun</h3>
                        <p>Este pasaporte todavia no registra puntos validados en ruta.</p>
                      </article>
                    )}
                  </div>
                </section>
              </>
            ) : (
              <article className="story-card">
                <h3>Cargando detalle</h3>
                <p>Selecciona un pasaporte para ver su actividad operativa.</p>
              </article>
            )}
          </aside>
        </div>
      )}
    </section>
  );
}
