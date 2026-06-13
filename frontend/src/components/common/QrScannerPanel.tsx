import { useEffect, useId, useState } from "react";

type Props = {
  onScan: (value: string) => void;
};

export function QrScannerPanel({ onScan }: Props) {
  const [manualCode, setManualCode] = useState("");
  const [scannerActive, setScannerActive] = useState(false);
  const [scannerMessage, setScannerMessage] = useState("Puedes pegar el valor del QR o activar la camara.");
  const targetId = useId().replace(/:/g, "");

  useEffect(() => {
    if (!scannerActive) {
      return;
    }

    let mounted = true;
    let scanner: { clear: () => void } | null = null;

    void import("html5-qrcode")
      .then(async ({ Html5Qrcode }) => {
        const instance = new Html5Qrcode(targetId);
        scanner = instance;
        await instance.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: 220 },
          (decodedText) => {
            if (mounted) {
              onScan(decodedText);
              setScannerMessage("QR detectado. Puedes escanear otro o cerrar la camara.");
            }
          },
          () => undefined,
        );
      })
      .catch(() => {
        setScannerMessage("No se pudo iniciar la camara en este dispositivo. Usa el campo manual.");
      });

    return () => {
      mounted = false;
      if (scanner) {
        scanner.clear();
      }
    };
  }, [onScan, scannerActive, targetId]);

  return (
    <section className="scanner-card">
      <div className="scanner-toolbar">
        <button className="ghost-button" onClick={() => setScannerActive((value) => !value)} type="button">
          {scannerActive ? "Cerrar camara" : "Abrir camara"}
        </button>
        <p>{scannerMessage}</p>
      </div>
      <div id={targetId} className={scannerActive ? "scanner-viewport active" : "scanner-viewport"} />
      <div className="scanner-manual">
        <label htmlFor="manualQr">Codigo QR manual</label>
        <textarea id="manualQr" value={manualCode} onChange={(event) => setManualCode(event.target.value)} placeholder="ESPSTAMP|CODIGO|SECRETO" rows={4} />
        <button className="primary-button" onClick={() => onScan(manualCode)} type="button">
          Validar codigo
        </button>
      </div>
    </section>
  );
}
