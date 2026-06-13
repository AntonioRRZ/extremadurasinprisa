import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { api } from "../../api/client";
import { MapPanel } from "../../components/common/MapPanel";
import { Route, StampPoint } from "../../types/api";

export function RouteDetailPage() {
  const { slug = "" } = useParams();
  const [route, setRoute] = useState<Route | null>(null);
  const [points, setPoints] = useState<StampPoint[]>([]);

  useEffect(() => {
    void api.get<Route>(`/routes/${slug}`).then(setRoute);
    void api.get<StampPoint[]>(`/routes/${slug}/stamp-points/public`).then(setPoints);
  }, [slug]);

  if (!route) {
    return <section className="page-shell">Cargando ruta...</section>;
  }

  return (
    <section className="page-shell">
      <div className="section-heading">
        <span className="eyebrow">{route.province_scope}</span>
        <h1>{route.title}</h1>
        <p>{route.description_long}</p>
      </div>
      <div className="route-detail-grid">
        <article className="story-card">
          <h3>Que recibes</h3>
          <p>Pasaporte fisico, codigo unico de activacion y acceso al mapa privado cuando lo vinculas a tu cuenta.</p>
        </article>
        <article className="story-card">
          <h3>Ritmo sugerido</h3>
          <p>
            Entre {route.estimated_days_min} y {route.estimated_days_max} dias para dejar espacio a pernoctas tranquilas,
            patrimonio y gastronomia local.
          </p>
        </article>
        <article className="story-card">
          <h3>Sellos minimos</h3>
          <p>{route.min_stamps_to_complete} puntos oficiales para completar el viaje.</p>
        </article>
      </div>
      <MapPanel points={points} title="Puntos visibles en modo teaser" />
      <div className="hero-actions">
        <Link className="primary-button" to={`/catalogo?routeSlug=${route.slug}`}>
          Ver pasaportes
        </Link>
      </div>
    </section>
  );
}

