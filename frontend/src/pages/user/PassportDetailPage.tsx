import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { api, formatDate } from "../../api/client";
import { MapPanel } from "../../components/common/MapPanel";
import { ProgressBar } from "../../components/common/ProgressBar";
import { StatusBadge } from "../../components/common/StatusBadge";
import { useAuth } from "../../store/auth";
import { PassportDetail } from "../../types/api";

export function PassportDetailPage() {
  const { passportId = "" } = useParams();
  const { accessToken } = useAuth();
  const [detail, setDetail] = useState<PassportDetail | null>(null);

  useEffect(() => {
    if (!accessToken) {
      return;
    }
    void api.get<PassportDetail>(`/me/passports/${passportId}`, accessToken).then(setDetail);
  }, [accessToken, passportId]);

  if (!detail) {
    return <section className="page-shell">Cargando pasaporte...</section>;
  }

  return (
    <section className="page-shell">
      <div className="section-heading">
        <span className="eyebrow">Pasaporte activo</span>
        <h1>{detail.route.title}</h1>
      </div>
      <div className="route-detail-grid">
        <article className="story-card">
          <StatusBadge value={detail.passport.operational_status} />
          <h3>{detail.passport.passport_type_name}</h3>
          <p>Serie {detail.passport.serial_number}</p>
          <p>Activado {formatDate(detail.passport.activated_at)}</p>
        </article>
        <article className="story-card">
          <h3>Progreso</h3>
          <ProgressBar value={detail.passport.progress_percent} label={`${detail.passport.stamps_count}/${detail.passport.required_stamps} sellos`} />
        </article>
        <article className="story-card">
          <h3>Acceso comun</h3>
          <p>QR comun del pasaporte: {detail.common_passport_qr_url}</p>
        </article>
      </div>
      <MapPanel points={detail.stamp_points} title="Mapa privado de la ruta" />
      <section className="editorial-section">
        <div className="section-heading">
          <span className="eyebrow">Sellos registrados</span>
          <h2>Timeline de viaje</h2>
        </div>
        <div className="stamp-list">
          {detail.stamps.map((stamp) => (
            <article className="story-card" key={stamp.id}>
              <h3>{stamp.stamp_point_name}</h3>
              <p>{formatDate(stamp.stamped_at)}</p>
              <StatusBadge value={stamp.validation_status} />
            </article>
          ))}
        </div>
      </section>
      <div className="hero-actions">
        <Link className="primary-button" to={`/mi/pasaportes/${detail.passport.id}/scan`}>
          Escanear sello
        </Link>
      </div>
    </section>
  );
}

