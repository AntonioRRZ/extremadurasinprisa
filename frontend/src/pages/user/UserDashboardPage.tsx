import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { api } from "../../api/client";
import { useAuth } from "../../store/auth";
import { Order, Passport, Route } from "../../types/api";

export function UserDashboardPage() {
  const { accessToken, user } = useAuth();
  const [passports, setPassports] = useState<Passport[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);

  useEffect(() => {
    if (!accessToken) {
      return;
    }
    void Promise.all([
      api.get<Passport[]>("/me/passports", accessToken),
      api.get<Order[]>("/me/orders", accessToken),
      api.get<Route[]>("/me/routes", accessToken),
    ]).then(([passportData, orderData, routeData]) => {
      setPassports(passportData);
      setOrders(orderData);
      setRoutes(routeData);
    });
  }, [accessToken]);

  return (
    <section className="page-shell">
      <div className="section-heading">
        <span className="eyebrow">Area privada</span>
        <h1>Hola, {user?.full_name}</h1>
      </div>
      <div className="stats-grid">
        <article className="metric-card">
          <span>Pasaportes activos</span>
          <strong>{passports.length}</strong>
        </article>
        <article className="metric-card">
          <span>Pedidos</span>
          <strong>{orders.length}</strong>
        </article>
        <article className="metric-card">
          <span>Rutas desbloqueadas</span>
          <strong>{routes.length}</strong>
        </article>
      </div>
      <div className="hero-actions">
        <Link className="primary-button" to="/mi/pasaportes">
          Ver mis pasaportes
        </Link>
        <Link className="ghost-button" to="/activar">
          Activar otro
        </Link>
      </div>
    </section>
  );
}

