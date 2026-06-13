import { useEffect, useState } from "react";

import { api, formatDate, formatPrice } from "../../api/client";
import { AdminTable } from "../../components/common/AdminTable";
import { StatusBadge } from "../../components/common/StatusBadge";
import { useAuth } from "../../store/auth";
import { Order } from "../../types/api";

export function AdminOrdersPage() {
  const { accessToken } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (!accessToken) {
      return;
    }
    void api.get<{ orders: Order[] }>("/admin/orders", accessToken).then((data) => setOrders(data.orders));
  }, [accessToken]);

  return (
    <section className="page-shell">
      <div className="section-heading">
        <span className="eyebrow">Admin</span>
        <h1>Pedidos</h1>
      </div>
      <AdminTable
        headers={["Pedido", "Comprador", "Fecha", "Importe", "Estado"]}
        rows={orders.map((order) => [
          `#${order.id}`,
          order.buyer_name,
          formatDate(order.created_at),
          formatPrice(order.total_cents),
          <StatusBadge key={order.id} value={order.status} />,
        ])}
      />
    </section>
  );
}

