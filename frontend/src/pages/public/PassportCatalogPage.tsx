import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import { api, formatPrice } from "../../api/client";
import { PassportType, Route } from "../../types/api";

export function PassportCatalogPage() {
  const [searchParams] = useSearchParams();
  const [routes, setRoutes] = useState<Route[]>([]);
  const [passportTypes, setPassportTypes] = useState<PassportType[]>([]);
  const [activeSlug, setActiveSlug] = useState(searchParams.get("routeSlug") ?? "");

  useEffect(() => {
    void api.get<Route[]>("/routes").then((data) => {
      setRoutes(data);
      const slug = searchParams.get("routeSlug") ?? data[0]?.slug ?? "";
      setActiveSlug(slug);
    });
  }, [searchParams]);

  useEffect(() => {
    if (!activeSlug) {
      return;
    }
    void api.get<PassportType[]>(`/routes/${activeSlug}/passport-types`).then(setPassportTypes);
  }, [activeSlug]);

  return (
    <section className="page-shell">
      <div className="section-heading">
        <span className="eyebrow">Catalogo publico</span>
        <h1>Elige tu pasaporte fisico</h1>
      </div>
      <div className="route-tabs">
        {routes.map((route) => (
          <button key={route.id} className={activeSlug === route.slug ? "route-tab active" : "route-tab"} onClick={() => setActiveSlug(route.slug)} type="button">
            {route.title}
          </button>
        ))}
      </div>
      <div className="passport-grid">
        {passportTypes.map((passportType) => (
          <article className="passport-card" key={passportType.id}>
            <span className="passport-code">{passportType.code}</span>
            <h2>{passportType.name}</h2>
            <p>{passportType.description}</p>
            <ul className="mini-list">
              <li>Hasta {passportType.max_holders} viajeros</li>
              <li>Formato {passportType.is_physical ? "fisico" : "digital"}</li>
              <li>Tipo {passportType.holder_type}</li>
            </ul>
            <strong>{formatPrice(passportType.price_cents)}</strong>
            <Link className="primary-button" to={`/checkout?routeSlug=${activeSlug}&passportTypeId=${passportType.id}`}>
              Comprar ahora
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}

