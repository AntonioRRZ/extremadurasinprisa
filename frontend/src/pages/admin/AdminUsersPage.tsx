import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { api, formatDate } from "../../api/client";
import { AdminTable } from "../../components/common/AdminTable";
import { StatusBadge } from "../../components/common/StatusBadge";
import { useAuth } from "../../store/auth";
import { AdminUserListItem } from "../../types/api";

export function AdminUsersPage() {
  const { accessToken } = useAuth();
  const [users, setUsers] = useState<AdminUserListItem[]>([]);

  useEffect(() => {
    if (!accessToken) {
      return;
    }
    void api.get<{ users: AdminUserListItem[] }>("/admin/users", accessToken).then((data) => setUsers(data.users));
  }, [accessToken]);

  return (
    <section className="page-shell">
      <div className="section-heading">
        <span className="eyebrow">Admin</span>
        <h1>Usuarios</h1>
      </div>
      <AdminTable
        headers={["ID", "Nombre", "Email", "Rol", "Cuenta", "Pasaporte", "Activos", "Ultima ruta", "Ultimo sello", "Detalle"]}
        rows={users.map((user) => [
          user.id,
          user.full_name,
          user.email,
          user.role,
          <StatusBadge key={user.id} value={user.is_active ? "active" : "inactive"} />,
          <StatusBadge key={`passport-${user.id}`} value={user.passport_status} />,
          user.active_passports_count,
          user.last_route_title ?? "Sin ruta activa",
          formatDate(user.last_stamp_at),
          <Link className="ghost-button" key={`detail-${user.id}`} to={`/admin/usuarios/${user.id}`}>
            Abrir
          </Link>,
        ])}
      />
    </section>
  );
}
