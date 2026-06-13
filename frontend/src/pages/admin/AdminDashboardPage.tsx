import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { api } from "../../api/client";
import { useAuth } from "../../store/auth";
import { AdminSummary } from "../../types/api";

export function AdminDashboardPage() {
  const { accessToken } = useAuth();
  const [summary, setSummary] = useState<AdminSummary | null>(null);

  const cards = [
    {
      title: "Usuarios",
      value: summary?.users ?? 0,
      to: "/admin/usuarios",
      description: "Cuentas registradas, estado operativo y acceso al detalle de cada viajero.",
    },
    {
      title: "Rutas",
      value: summary?.routes ?? 0,
      to: "/admin/rutas",
      description: "Gestion de rutas publicadas, edicion y preparacion del mapa operativo.",
    },
    {
      title: "Pedidos",
      value: summary?.orders ?? 0,
      to: "/admin/pedidos",
      description: "Seguimiento administrativo de compras y flujo del pasaporte fisico.",
    },
    {
      title: "Pasaportes activos",
      value: summary?.active_passports ?? 0,
      to: "/admin/pasaportes-activos",
      description: "Actividad de pasaportes en ruta segun su ultimo punto sellado valido.",
    },
    {
      title: "Sellos",
      value: summary?.stamps ?? 0,
      to: "/admin/sellos",
      description: "Actividad, duplicados y futura auditoria del sistema de sellado.",
    },
  ];

  useEffect(() => {
    if (!accessToken) {
      return;
    }
    void api.get<AdminSummary>("/admin/dashboard/summary", accessToken).then(setSummary);
  }, [accessToken]);

  return (
    <section className="page-shell">
      <div className="section-heading">
        <span className="eyebrow">Panel admin</span>
        <h1>Resumen operativo</h1>
      </div>
      <div className="stats-grid">
        {cards.map((card) => (
          <Link className="metric-card metric-card-link" key={card.to} to={card.to}>
            <span>{card.title}</span>
            <strong>{card.value}</strong>
            <p>{card.description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
