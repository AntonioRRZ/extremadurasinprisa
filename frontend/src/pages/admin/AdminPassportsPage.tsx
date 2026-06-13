import { useEffect, useState } from "react";

import { api, formatDate } from "../../api/client";
import { AdminTable } from "../../components/common/AdminTable";
import { ProgressBar } from "../../components/common/ProgressBar";
import { StatusBadge } from "../../components/common/StatusBadge";
import { useAuth } from "../../store/auth";
import { Passport } from "../../types/api";

export function AdminPassportsPage() {
  const { accessToken } = useAuth();
  const [passports, setPassports] = useState<Passport[]>([]);

  useEffect(() => {
    if (!accessToken) {
      return;
    }
    void api.get<{ passports: Passport[] }>("/admin/passports", accessToken).then((data) => setPassports(data.passports));
  }, [accessToken]);

  return (
    <section className="page-shell">
      <div className="section-heading">
        <span className="eyebrow">Admin</span>
        <h1>Pasaportes</h1>
      </div>
      <AdminTable
        headers={["ID", "Ruta", "Serie", "Estado", "Fecha", "Progreso"]}
        rows={passports.map((passport) => [
          passport.id,
          passport.route_title,
          passport.serial_number,
          <StatusBadge key={passport.id} value={passport.operational_status} />,
          formatDate(passport.activated_at),
          <ProgressBar key={`progress-${passport.id}`} value={passport.progress_percent} label={`${passport.stamps_count}/${passport.required_stamps}`} />,
        ])}
      />
    </section>
  );
}

