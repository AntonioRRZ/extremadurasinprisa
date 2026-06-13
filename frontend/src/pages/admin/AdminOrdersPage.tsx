import { useEffect, useState } from "react";

import { api, formatDate, formatPrice } from "../../api/client";
import { AdminTable } from "../../components/common/AdminTable";
import { StatusBadge } from "../../components/common/StatusBadge";
import { useAuth } from "../../store/auth";
import { AdminOrder } from "../../types/api";

export function AdminOrdersPage() {
  const { accessToken } = useAuth();
  const [orders, setOrders] = useState<AdminOrder[]>([]);

  useEffect(() => {
    if (!accessToken) {
      return;
    }
    void api.get<{ orders: AdminOrder[] }>("/admin/orders", accessToken).then((data) => setOrders(data.orders));
  }, [accessToken]);

  return (
    <section className="page-shell">
      <div className="section-heading">
        <span className="eyebrow">Admin</span>
        <h1>Pedidos</h1>
      </div>
      <AdminTable
        headers={["Pedido", "Comprador", "Fecha", "Importe", "Pago", "Operacion", "Tracking"]}
        rows={orders.map((order) => [
          `#${order.id}`,
          `${order.buyer_name} (${order.buyer_email})`,
          formatDate(order.created_at),
          formatPrice(order.total_cents),
          <StatusBadge key={order.id} value={order.status} />,
          <StatusBadge key={`fulfillment-${order.id}`} value={order.fulfillment_status} />,
          order.tracking_code ?? "Pendiente",
        ])}
      />
    </section>
  );
}
