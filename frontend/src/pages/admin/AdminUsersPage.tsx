import { useEffect, useState } from "react";

import { api } from "../../api/client";
import { AdminTable } from "../../components/common/AdminTable";
import { StatusBadge } from "../../components/common/StatusBadge";
import { useAuth } from "../../store/auth";
import { User } from "../../types/api";

export function AdminUsersPage() {
  const { accessToken } = useAuth();
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    if (!accessToken) {
      return;
    }
    void api.get<{ users: User[] }>("/admin/users", accessToken).then((data) => setUsers(data.users));
  }, [accessToken]);

  return (
    <section className="page-shell">
      <div className="section-heading">
        <span className="eyebrow">Admin</span>
        <h1>Usuarios</h1>
      </div>
      <AdminTable
        headers={["ID", "Nombre", "Email", "Rol", "Estado"]}
        rows={users.map((user) => [
          user.id,
          user.full_name,
          user.email,
          user.role,
          <StatusBadge key={user.id} value={user.is_active ? "active" : "inactive"} />,
        ])}
      />
    </section>
  );
}

