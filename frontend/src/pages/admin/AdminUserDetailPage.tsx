import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { api, formatDate } from "../../api/client";
import { MapPanel } from "../../components/common/MapPanel";
import { ProgressBar } from "../../components/common/ProgressBar";
import { StatusBadge } from "../../components/common/StatusBadge";
import { useAuth } from "../../store/auth";
import { AdminUserDetail } from "../../types/api";

export function AdminUserDetailPage() {
  const { userId = "" } = useParams();
  const { accessToken } = useAuth();
  const [detail, setDetail] = useState<AdminUserDetail | null>(null);
  const [selectedPassportId, setSelectedPassportId] = useState<number | null>(null);

  useEffect(() => {
    if (!accessToken) {
      return;
    }
    void api.get<AdminUserDetail>(`/admin/users/${userId}`, accessToken).then((data) => {
      setDetail(data);
      setSelectedPassportId(data.passport_details[0]?.passport.id ?? null);
    });
  }, [accessToken, userId]);

  const selectedPassport = useMemo(
    () => detail?.passport_details.find((passportDetail) => passportDetail.passport.id === selectedPassportId) ?? detail?.passport_details[0] ?? null,
    [detail, selectedPassportId],
  );
  const latestSelectedStamp = selectedPassport?.stamps[selectedPassport.stamps.length - 1] ?? null;

  if (!detail) {
    return <section className="page-shell">Cargando usuario...</section>;
  }

  return (
    <section className="page-shell">
      <div className="section-heading">
        <span className="eyebrow">Admin</span>
        <h1>{detail.user.full_name}</h1>
        <p>{detail.user.email}</p>
      </div>

      <div className="route-detail-grid">
        <article className="story-card">
          <h3>Cuenta</h3>
          <StatusBadge value={detail.user.role} />
          <p>Telefono: {detail.user.phone ?? "No informado"}</p>
          <p>Alta: {formatDate(detail.user.created_at)}</p>
          <p>Cuenta: {detail.user.is_active ? "Activa" : "Inactiva"}</p>
        </article>
        <article className="story-card">
          <h3>Pasaporte</h3>
          <StatusBadge value={detail.passport_status} />
          <p>Pasaportes activos: {detail.active_passports_count}</p>
          <p>Sellos validados: {detail.total_stamps}</p>
          <p>Pasaportes asociados: {detail.passport_details.length}</p>
        </article>
        <article className="story-card">
          <h3>Pedidos</h3>
          <p>{detail.orders.length} pedidos vinculados</p>
          <p>Ultimo movimiento: {formatDate(detail.orders[0]?.created_at ?? null)}</p>
          <Link className="ghost-button" to="/admin/usuarios">
            Volver a usuarios
          </Link>
        </article>
      </div>

      {detail.passport_details.length ? (
        <>
          <section className="editorial-section">
            <div className="section-heading">
              <span className="eyebrow">Pasaportes</span>
              <h2>Detalle de viaje</h2>
            </div>
            <div className="route-tabs">
              {detail.passport_details.map((passportDetail) => (
                <button
                  className={`route-tab ${selectedPassport?.passport.id === passportDetail.passport.id ? "active" : ""}`}
                  key={passportDetail.passport.id}
                  onClick={() => setSelectedPassportId(passportDetail.passport.id)}
                  type="button"
                >
                  {passportDetail.route.title}
                </button>
              ))}
            </div>
            {selectedPassport ? (
              <>
                <div className="route-detail-grid">
                  <article className="passport-card">
                    <span className="passport-code">{selectedPassport.passport.serial_number}</span>
                    <StatusBadge value={selectedPassport.passport.operational_status} />
                    <h3>{selectedPassport.passport.passport_type_name}</h3>
                    <p>Propietario: {selectedPassport.passport.owner_display_name ?? detail.user.full_name}</p>
                    <p>Activado: {formatDate(selectedPassport.passport.activated_at)}</p>
                    <ProgressBar
                      label={`${selectedPassport.passport.stamps_count}/${selectedPassport.passport.required_stamps} sellos`}
                      value={selectedPassport.passport.progress_percent}
                    />
                  </article>
                  <article className="story-card">
                    <h3>Ruta asociada</h3>
                    <p>{selectedPassport.route.subtitle}</p>
                    <p>{selectedPassport.route.province_scope}</p>
                    <p>{selectedPassport.route.distance_km} km editoriales</p>
                    <p>Estado: {selectedPassport.route.status}</p>
                  </article>
                  <article className="story-card">
                    <h3>Recorrido</h3>
                    <p>Puntos oficiales: {selectedPassport.stamp_points.length}</p>
                    <p>Sellos registrados: {selectedPassport.stamps.length}</p>
                    <p>Ultimo sello: {formatDate(latestSelectedStamp?.stamped_at ?? null)}</p>
                    <p>Completado: {formatDate(selectedPassport.passport.completed_at)}</p>
                  </article>
                </div>

                <MapPanel
                  highlightedPointIds={selectedPassport.stamps.map((stamp) => stamp.stamp_point_id)}
                  points={selectedPassport.stamp_points}
                  title="Mapa de avance en la ruta"
                />
              </>
            ) : null}
          </section>

          <section className="editorial-section">
            <div className="section-heading">
              <span className="eyebrow">Sellos</span>
              <h2>Timeline validado</h2>
            </div>
            <div className="stamp-list">
              {selectedPassport?.stamps.length ? (
                selectedPassport.stamps.map((stamp) => (
                  <article className="story-card" key={stamp.id}>
                    <h3>{stamp.stamp_point_name}</h3>
                    <p>{formatDate(stamp.stamped_at)}</p>
                    <StatusBadge value={stamp.validation_status} />
                  </article>
                ))
              ) : (
                <article className="story-card">
                  <h3>Sin sellos todavia</h3>
                  <p>Este pasaporte aun no registra actividad validada.</p>
                </article>
              )}
            </div>
          </section>
        </>
      ) : (
        <section className="editorial-section">
          <article className="story-card">
            <h3>Sin pasaportes activados</h3>
            <p>La cuenta existe, pero todavia no tiene ningun pasaporte operativo asociado.</p>
          </article>
        </section>
      )}

      <section className="editorial-section">
        <div className="section-heading">
          <span className="eyebrow">Pedidos</span>
          <h2>Historial de compra</h2>
        </div>
        <div className="stamp-list">
          {detail.orders.length ? (
            detail.orders.map((order) => (
              <article className="story-card" key={order.id}>
                <h3>Pedido #{order.id}</h3>
                <StatusBadge value={order.fulfillment_status} />
                <p>Pago: {order.status}</p>
                <p>Creado: {formatDate(order.created_at)}</p>
                <Link className="ghost-button" to={`/admin/pedidos/${order.id}`}>
                  Ver pedido
                </Link>
              </article>
            ))
          ) : (
            <article className="story-card">
              <h3>Sin pedidos vinculados</h3>
              <p>Esta cuenta no tiene compras asociadas en el sistema.</p>
            </article>
          )}
        </div>
      </section>
    </section>
  );
}
