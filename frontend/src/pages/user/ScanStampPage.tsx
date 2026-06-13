import { useCallback, useState } from "react";
import { useParams } from "react-router-dom";

import { api } from "../../api/client";
import { ProgressBar } from "../../components/common/ProgressBar";
import { QrScannerPanel } from "../../components/common/QrScannerPanel";
import { useAuth } from "../../store/auth";
import { Passport, Stamp } from "../../types/api";

type ScanResult = {
  status: string;
  passport: Passport;
  stamp: Stamp | null;
  message: string;
};

export function ScanStampPage() {
  const { passportId = "" } = useParams();
  const { accessToken } = useAuth();
  const [result, setResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleScan = useCallback(
    async (value: string) => {
      if (!accessToken || !value.trim()) {
        return;
      }
      try {
        setError(null);
        const response = await api.post<ScanResult>(`/me/passports/${passportId}/scan`, { qr_code: value }, accessToken);
        setResult(response);
      } catch (scanError) {
        setError(scanError instanceof Error ? scanError.message : "No se pudo validar el QR");
      }
    },
    [accessToken, passportId],
  );

  return (
    <section className="page-shell">
      <div className="section-heading">
        <span className="eyebrow">Sellado por QR</span>
        <h1>Registrar un punto oficial</h1>
      </div>
      <QrScannerPanel onScan={handleScan} />
      {error ? <p className="field-error">{error}</p> : null}
      {result ? (
        <section className="editorial-section">
          <div className="route-detail-grid">
            <article className="story-card">
              <h3>Resultado</h3>
              <p>{result.message}</p>
              <p>Estado {result.status}</p>
            </article>
            <article className="story-card">
              <h3>Pasaporte</h3>
              <p>{result.passport.route_title}</p>
              <ProgressBar value={result.passport.progress_percent} label={`${result.passport.stamps_count}/${result.passport.required_stamps} sellos`} />
            </article>
          </div>
        </section>
      ) : null}
    </section>
  );
}

