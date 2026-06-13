import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useParams } from "react-router-dom";

import { api, formatDate, formatPrice } from "../../api/client";
import { StatusBadge } from "../../components/common/StatusBadge";
import { useAuth } from "../../store/auth";
import { AdminOrderDetail } from "../../types/api";

type OrderUpdateForm = {
  fulfillment_status: string;
  tracking_code: string;
  admin_notes: string;
};

const fulfillmentOptions = ["received", "preparing", "shipped", "delivered", "cancelled"];

export function AdminOrderDetailPage() {
  const { orderId = "" } = useParams();
  const { accessToken } = useAuth();
  const [detail, setDetail] = useState<AdminOrderDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<OrderUpdateForm>();

  const loadOrder = async () => {
    if (!accessToken) {
      return;
    }
    const data = await api.get<AdminOrderDetail>(`/admin/orders/${orderId}`, accessToken);
    setDetail(data);
    reset({
      fulfillment_status: data.fulfillment_status,
      tracking_code: data.tracking_code ?? "",
      admin_notes: data.admin_notes ?? "",
    });
  };

  useEffect(() => {
    void loadOrder();
  }, [accessToken, orderId]);

  const onSubmit = handleSubmit(async (values) => {
    if (!accessToken) {
      return;
    }
    try {
      setError(null);
      setSuccess(null);
      const updated = await api.patch<AdminOrderDetail>(`/admin/orders/${orderId}`, values, accessToken);
      setDetail(updated);
      reset({
        fulfillment_status: updated.fulfillment_status,
        tracking_code: updated.tracking_code ?? "",
        admin_notes: updated.admin_notes ?? "",
      });
      setSuccess("Pedido actualizado.");
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : "No se pudo actualizar el pedido");
    }
  });

  if (!detail) {
    return <section className="page-shell">Cargando pedido...</section>;
  }

  return (
    <section className="page-shell">
      <div className="section-heading">
        <span className="eyebrow">Admin</span>
        <h1>Pedido #{detail.id}</h1>
        <p>{detail.buyer_name} · {detail.buyer_email}</p>
      </div>

      <div className="route-detail-grid">
        <article className="story-card">
          <h3>Pago</h3>
          <StatusBadge value={detail.status} />
          <p>{formatPrice(detail.total_cents)}</p>
          <p>Creado {formatDate(detail.created_at)}</p>
        </article>
        <article className="story-card">
          <h3>Operacion fisica</h3>
          <StatusBadge value={detail.fulfillment_status} />
          <p>Tracking: {detail.tracking_code ?? "Pendiente"}</p>
          <p>Enviado: {formatDate(detail.shipped_at)}</p>
          <p>Entregado: {formatDate(detail.delivered_at)}</p>
        </article>
        <article className="story-card">
          <h3>Pasaportes</h3>
          <p>{detail.passports.length} generados</p>
          <p>{detail.passports.filter((passport) => passport.activated_by_user_id).length} activados</p>
          <Link className="ghost-button" to="/admin/pedidos">
            Volver a pedidos
          </Link>
        </article>
      </div>

      <form className="admin-form" onSubmit={onSubmit}>
        <h2>Actualizar logistica</h2>
        <label>
          Estado logistico
          <select {...register("fulfillment_status")}>
            {fulfillmentOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
        <label>
          Tracking
          <input {...register("tracking_code")} placeholder="ESP-TRACK-001" />
        </label>
        <label>
          Notas admin
          <textarea {...register("admin_notes")} placeholder="Notas internas del envio o preparacion" />
        </label>
        {error ? <p className="field-error">{error}</p> : null}
        {success ? <p>{success}</p> : null}
        <button className="primary-button" disabled={isSubmitting} type="submit">
          {isSubmitting ? "Guardando..." : "Guardar cambios"}
        </button>
      </form>

      <section className="editorial-section">
        <div className="section-heading">
          <span className="eyebrow">Items</span>
          <h2>Detalle de compra</h2>
        </div>
        <div className="stamp-list">
          {detail.items.map((item) => (
            <article className="story-card" key={item.id}>
              <h3>{item.passport_type_name}</h3>
              <p>{item.route_title}</p>
              <p>Cantidad: {item.quantity}</p>
              <p>Total: {formatPrice(item.total_cents)}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="editorial-section">
        <div className="section-heading">
          <span className="eyebrow">Activacion</span>
          <h2>Pasaportes generados</h2>
        </div>
        <div className="stamp-list">
          {detail.passports.map((passport) => (
            <article className="story-card" key={passport.id}>
              <h3>{passport.serial_number}</h3>
              <p>{passport.passport_type_name}</p>
              <StatusBadge value={passport.operational_status} />
              <p>
                {passport.activated_by_user_name
                  ? `Activado por ${passport.activated_by_user_name} (${passport.activated_by_user_email})`
                  : "Aun no activado"}
              </p>
              <p>Fecha de activacion: {formatDate(passport.activated_at)}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="editorial-section">
        <div className="section-heading">
          <span className="eyebrow">Pagos</span>
          <h2>Transacciones asociadas</h2>
        </div>
        <div className="stamp-list">
          {detail.payments.map((payment) => (
            <article className="story-card" key={payment.id}>
              <h3>{payment.provider}</h3>
              <p>Metodo: {payment.method}</p>
              <StatusBadge value={payment.status} />
              <p>Importe: {formatPrice(payment.amount_cents)}</p>
            </article>
          ))}
        </div>
      </section>
    </section>
  );
}
