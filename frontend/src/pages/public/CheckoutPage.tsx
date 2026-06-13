import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";

import { api, formatPrice } from "../../api/client";
import { useAuth } from "../../store/auth";
import { Order, PassportType, Payment, Route } from "../../types/api";

type CheckoutValues = {
  buyer_name: string;
  buyer_email: string;
  buyer_phone: string;
  quantity: number;
  method: "card" | "bizum";
  outcome: "success" | "failed" | "cancelled";
};

export function CheckoutPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, accessToken } = useAuth();
  const [route, setRoute] = useState<Route | null>(null);
  const [passportType, setPassportType] = useState<PassportType | null>(null);
  const [statusText, setStatusText] = useState<string | null>(null);

  const routeSlug = searchParams.get("routeSlug") ?? "";
  const passportTypeId = Number(searchParams.get("passportTypeId") ?? "0");

  const { register, handleSubmit, watch } = useForm<CheckoutValues>({
    defaultValues: {
      buyer_name: user?.full_name ?? "",
      buyer_email: user?.email ?? "",
      buyer_phone: user?.phone ?? "",
      quantity: 1,
      method: "card",
      outcome: "success",
    },
  });

  useEffect(() => {
    if (!routeSlug || !passportTypeId) {
      return;
    }
    void api.get<Route>(`/routes/${routeSlug}`).then(setRoute);
    void api.get<PassportType[]>(`/routes/${routeSlug}/passport-types`).then((items) => {
      setPassportType(items.find((item) => item.id === passportTypeId) ?? null);
    });
  }, [passportTypeId, routeSlug]);

  const quantity = watch("quantity");
  const total = useMemo(() => (passportType ? passportType.price_cents * Number(quantity || 1) : 0), [passportType, quantity]);

  const onSubmit = handleSubmit(async (values) => {
    if (!passportType) {
      return;
    }
    setStatusText("Creando pedido...");
    const orderPayload = {
      buyer_name: values.buyer_name,
      buyer_email: values.buyer_email,
      buyer_phone: values.buyer_phone,
      items: [{ passport_type_id: passportType.id, quantity: Number(values.quantity) }],
    };
    const { order } = await api.post<{ order: Order }>("/orders", orderPayload, accessToken);
    setStatusText("Generando sesion mock...");
    const checkout = await api.post<{ payment: Payment; mock_checkout_token: string }>("/payments/checkout-session", { order_id: order.id, method: values.method });
    setStatusText("Confirmando pago mock...");
    const result = await api.post<{ payment: Payment; order: Order; passports: unknown[] }>("/payments/mock/confirm", {
      payment_id: checkout.payment.id,
      outcome: values.outcome,
    });
    sessionStorage.setItem("esp-payment-result", JSON.stringify(result));
    navigate("/checkout/resultado");
  });

  if (!route || !passportType) {
    return <section className="page-shell">Selecciona primero una ruta y un tipo de pasaporte.</section>;
  }

  return (
    <section className="page-shell checkout-grid">
      <form className="auth-card" onSubmit={onSubmit}>
        <span className="eyebrow">Checkout mock</span>
        <h1>Completar compra</h1>
        <label>
          Nombre comprador
          <input {...register("buyer_name")} />
        </label>
        <label>
          Email comprador
          <input {...register("buyer_email")} type="email" />
        </label>
        <label>
          Telefono
          <input {...register("buyer_phone")} />
        </label>
        <label>
          Cantidad
          <input {...register("quantity", { valueAsNumber: true })} type="number" min={1} />
        </label>
        <label>
          Metodo visible
          <select {...register("method")}>
            <option value="card">Tarjeta</option>
            <option value="bizum">Bizum</option>
          </select>
        </label>
        <label>
          Simulacion de resultado
          <select {...register("outcome")}>
            <option value="success">Pago correcto</option>
            <option value="failed">Pago fallido</option>
            <option value="cancelled">Pago cancelado</option>
          </select>
        </label>
        {statusText ? <p>{statusText}</p> : null}
        <button className="primary-button" type="submit">
          Simular pago
        </button>
      </form>

      <aside className="checkout-summary">
        <span className="eyebrow">Resumen</span>
        <h2>{passportType.name}</h2>
        <p>{passportType.description}</p>
        <div className="summary-line">
          <span>Ruta</span>
          <strong>{route.title}</strong>
        </div>
        <div className="summary-line">
          <span>Precio unitario</span>
          <strong>{formatPrice(passportType.price_cents)}</strong>
        </div>
        <div className="summary-line total">
          <span>Total estimado</span>
          <strong>{formatPrice(total)}</strong>
        </div>
      </aside>
    </section>
  );
}

