import { useEffect, useState } from "react";

import { api, formatDate, formatPrice } from "../../api/client";
import { StatusBadge } from "../../components/common/StatusBadge";
import { useAuth } from "../../store/auth";
import { Order } from "../../types/api";

export function MyOrdersPage() {
  const { accessToken } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (!accessToken) {
      return;
    }
    void api.get<Order[]>("/me/orders", accessToken).then(setOrders);
  }, [accessToken]);

  return (
    <section className="page-shell">
      <div className="section-heading">
        <span className="eyebrow">Pedidos</span>
        <h1>Historial de compra</h1>
      </div>
      <div className="stamp-list">
        {orders.map((order) => (
          <article className="story-card" key={order.id}>
            <div className="summary-line">
              <strong>Pedido #{order.id}</strong>
              <StatusBadge value={order.status} />
            </div>
            <p>{formatDate(order.created_at)}</p>
            <p>{formatPrice(order.total_cents)}</p>
            <p>{order.items.map((item) => `${item.passport_type_name} x${item.quantity}`).join(", ")}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

