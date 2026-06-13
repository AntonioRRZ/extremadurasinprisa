import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { api, formatDate } from "../../api/client";
import { ProgressBar } from "../../components/common/ProgressBar";
import { StatusBadge } from "../../components/common/StatusBadge";
import { useAuth } from "../../store/auth";
import { Passport } from "../../types/api";

export function MyPassportsPage() {
  const { accessToken } = useAuth();
  const [passports, setPassports] = useState<Passport[]>([]);

  useEffect(() => {
    if (!accessToken) {
      return;
    }
    void api.get<Passport[]>("/me/passports", accessToken).then(setPassports);
  }, [accessToken]);

  return (
    <section className="page-shell">
      <div className="section-heading">
        <span className="eyebrow">Mis pasaportes</span>
        <h1>Pasaportes vinculados</h1>
      </div>
      <div className="passport-grid">
        {passports.map((passport) => (
          <article className="passport-card" key={passport.id}>
            <StatusBadge value={passport.operational_status} />
            <h2>{passport.route_title}</h2>
            <p>{passport.passport_type_name}</p>
            <p>Serie {passport.serial_number}</p>
            <p>Activado {formatDate(passport.activated_at)}</p>
            <ProgressBar value={passport.progress_percent} label={`${passport.stamps_count}/${passport.required_stamps} sellos`} />
            <Link className="primary-button" to={`/mi/pasaportes/${passport.id}`}>
              Abrir detalle
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}

