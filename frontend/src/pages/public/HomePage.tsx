import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { api, formatPrice } from "../../api/client";
import { MapPanel } from "../../components/common/MapPanel";
import { PassportType, Route, StampPoint } from "../../types/api";

export function HomePage() {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [passportTypes, setPassportTypes] = useState<PassportType[]>([]);
  const [previewPoints, setPreviewPoints] = useState<StampPoint[]>([]);

  useEffect(() => {
    void api.get<Route[]>("/routes").then((data) => {
      setRoutes(data);
      if (data[0]) {
        void api.get<PassportType[]>(`/routes/${data[0].slug}/passport-types`).then(setPassportTypes);
        void api.get<StampPoint[]>(`/routes/${data[0].slug}/stamp-points/public`).then(setPreviewPoints);
      }
    });
  }, []);

  const featuredRoute = routes[0];

  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="hero-copy">
          <span className="eyebrow">Pasaporte fisico + activacion digital + sellos oficiales</span>
          <h1>Rutas camper para recorrer Extremadura con calma, memoria y mapa privado.</h1>
          <p>
            Un objeto editorial para viajar sin prisas: compras tu pasaporte, lo activas cuando llega y desbloqueas una
            ruta privada con puntos oficiales, progreso y sellos QR.
          </p>
          <div className="hero-actions">
            <Link className="primary-button" to="/catalogo">
              Elegir pasaporte
            </Link>
            <Link className="ghost-button" to="/rutas">
              Ver rutas
            </Link>
          </div>
        </div>
        <div className="hero-panel">
          <div className="passport-preview">
            <span className="passport-chip">Edicion inaugural</span>
            <h2>Dehesas y ciudades lentas</h2>
            <p>Pueblos con piedra clara, agua, encinas y paradas oficiales para sellar el viaje.</p>
            <ul className="hero-stats">
              <li>Ruta privada al activar</li>
              <li>Mapa protegido</li>
              <li>QR comun y codigo unico</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="editorial-section">
        <div className="section-heading">
          <span className="eyebrow">Como funciona</span>
          <h2>Un flujo claro, sin friccion y con sentido fisico.</h2>
        </div>
        <div className="grid-3">
          {[
            ["1. Compra", "Eliges una ruta y un tipo de pasaporte. El checkout usa pago mock pero deja lista la arquitectura real."],
            ["2. Activa", "Cuando recibes el pasaporte fisico, introduces el codigo unico y se vincula a tu cuenta."],
            ["3. Viaja", "Accedes al mapa privado, localizas puntos oficiales y construyes progreso con sellos QR."],
          ].map(([title, copy]) => (
            <article key={title} className="story-card">
              <h3>{title}</h3>
              <p>{copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="editorial-section">
        <div className="section-heading">
          <span className="eyebrow">Elige tu pasaporte</span>
          <h2>Coleccionable, fisico y pensado para distintos modos de viaje.</h2>
        </div>
        <div className="passport-grid">
          {passportTypes.map((passportType) => (
            <article key={passportType.id} className="passport-card">
              <span className="passport-code">{passportType.code}</span>
              <h3>{passportType.name}</h3>
              <p>{passportType.description}</p>
              <strong>{formatPrice(passportType.price_cents, passportType.currency)}</strong>
              <Link className="ghost-button" to={`/checkout?routeSlug=${featuredRoute?.slug ?? ""}&passportTypeId=${passportType.id}`}>
                Comprar
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="editorial-section route-highlight">
        <div className="route-copy">
          <span className="eyebrow">Rutas y experiencias</span>
          <h2>{featuredRoute?.title ?? "Extremadura en clave slow travel"}</h2>
          <p>{featuredRoute?.description_long ?? "Cargamos datos demo para mostrar una primera ruta publicada."}</p>
          {featuredRoute ? (
            <Link className="primary-button" to={`/rutas/${featuredRoute.slug}`}>
              Abrir ruta destacada
            </Link>
          ) : null}
        </div>
        <div className="route-metrics">
          <div>
            <span>Provincias</span>
            <strong>{featuredRoute?.province_scope ?? "Caceres y Badajoz"}</strong>
          </div>
          <div>
            <span>Distancia</span>
            <strong>{featuredRoute?.distance_km ?? 0} km</strong>
          </div>
          <div>
            <span>Duracion</span>
            <strong>
              {featuredRoute?.estimated_days_min ?? 0}-{featuredRoute?.estimated_days_max ?? 0} dias
            </strong>
          </div>
        </div>
      </section>

      <section className="editorial-section">
        <div className="section-heading">
          <span className="eyebrow">Mapa protegido</span>
          <h2>El teaser publico inspira; el mapa completo se desbloquea al activar.</h2>
        </div>
        <MapPanel points={previewPoints} title="Vista previa de puntos oficiales" />
      </section>

      <section className="editorial-section">
        <div className="section-heading">
          <span className="eyebrow">Voces del viaje</span>
          <h2>Un tono sereno, editorial y con memoria de trayecto.</h2>
        </div>
        <div className="grid-3">
          {[
            ["Ana y Ruben", "Sentimos que el pasaporte convierte la ruta en una coleccion de momentos, no en una lista de check-ins."],
            ["Clara", "La activacion fue simple y el mapa privado nos ordeno muy bien cada parada."],
            ["Marta con Nilo", "El formato mascota tiene sentido real: recomendaciones y ritmos mas amables."],
          ].map(([author, copy]) => (
            <article key={author} className="quote-card">
              <p>{copy}</p>
              <strong>{author}</strong>
            </article>
          ))}
        </div>
      </section>

      <section className="cta-section">
        <div>
          <span className="eyebrow">Activacion y area privada</span>
          <h2>Si ya tienes el pasaporte fisico, entra y desbloquea tu ruta.</h2>
        </div>
        <div className="hero-actions">
          <Link className="primary-button" to="/activar">
            Activar pasaporte
          </Link>
          <Link className="ghost-button" to="/register">
            Crear cuenta
          </Link>
        </div>
      </section>
    </div>
  );
}

