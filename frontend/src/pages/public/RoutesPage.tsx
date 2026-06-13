import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { api } from "../../api/client";
import { Route } from "../../types/api";

export function RoutesPage() {
  const [routes, setRoutes] = useState<Route[]>([]);

  useEffect(() => {
    void api.get<Route[]>("/routes").then(setRoutes);
  }, []);

  return (
    <section className="page-shell">
      <div className="section-heading">
        <span className="eyebrow">Rutas teaser</span>
        <h1>Experiencias publicadas</h1>
      </div>
      <div className="route-list">
        {routes.map((route) => (
          <article key={route.id} className="route-card">
            <div className="route-card-copy">
              <span className="eyebrow">{route.province_scope}</span>
              <h2>{route.title}</h2>
              <p>{route.description_short}</p>
              <div className="route-inline-stats">
                <span>{route.distance_km} km</span>
                <span>
                  {route.estimated_days_min}-{route.estimated_days_max} dias
                </span>
              </div>
            </div>
            <Link className="ghost-button" to={`/rutas/${route.slug}`}>
              Ver detalle
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}

