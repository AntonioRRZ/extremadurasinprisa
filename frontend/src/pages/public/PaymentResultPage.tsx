import { Link } from "react-router-dom";

import { formatPrice } from "../../api/client";
import { Order, Passport, Payment } from "../../types/api";

type ResultPayload = {
  payment: Payment;
  order: Order;
  passports: Passport[];
};

export function PaymentResultPage() {
  const raw = sessionStorage.getItem("esp-payment-result");
  const result = raw ? (JSON.parse(raw) as ResultPayload) : null;

  if (!result) {
    return <section className="page-shell">No hay ningun resultado de pago reciente.</section>;
  }

  return (
    <section className="page-shell">
      <div className="section-heading">
        <span className="eyebrow">Resultado del pago</span>
        <h1>{result.payment.status === "paid" ? "Compra completada" : "Pago no completado"}</h1>
        <p>Pedido #{result.order.id}</p>
      </div>
      <div className="route-detail-grid">
        <article className="story-card">
          <h3>Estado del pedido</h3>
          <p>{result.order.status}</p>
        </article>
        <article className="story-card">
          <h3>Importe</h3>
          <p>{formatPrice(result.order.total_cents)}</p>
        </article>
        <article className="story-card">
          <h3>Pasaportes generados</h3>
          <p>{result.passports.length}</p>
        </article>
      </div>
      {result.passports.length > 0 ? (
        <div className="passport-grid">
          {result.passports.map((passport) => (
            <article className="passport-card" key={passport.id}>
              <h3>{passport.passport_type_name}</h3>
              <p>Serie {passport.serial_number}</p>
              <p>Estado {passport.operational_status}</p>
            </article>
          ))}
        </div>
      ) : null}
      <div className="hero-actions">
        <Link className="primary-button" to="/activar">
          Activar un pasaporte
        </Link>
        <Link className="ghost-button" to="/catalogo">
          Volver al catalogo
        </Link>
      </div>
    </section>
  );
}

