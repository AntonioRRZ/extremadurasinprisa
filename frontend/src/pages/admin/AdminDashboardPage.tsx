import { useEffect, useState } from "react";

import { api } from "../../api/client";
import { useAuth } from "../../store/auth";
import { AdminSummary } from "../../types/api";

export function AdminDashboardPage() {
  const { accessToken } = useAuth();
  const [summary, setSummary] = useState<AdminSummary | null>(null);

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
        <article className="metric-card">
          <span>Usuarios</span>
          <strong>{summary?.users ?? 0}</strong>
        </article>
        <article className="metric-card">
          <span>Rutas</span>
          <strong>{summary?.routes ?? 0}</strong>
        </article>
        <article className="metric-card">
          <span>Pedidos pagados</span>
          <strong>{summary?.paid_orders ?? 0}</strong>
        </article>
        <article className="metric-card">
          <span>Pasaportes activos</span>
          <strong>{summary?.active_passports ?? 0}</strong>
        </article>
        <article className="metric-card">
          <span>Sellos</span>
          <strong>{summary?.stamps ?? 0}</strong>
        </article>
      </div>
    </section>
  );
}

