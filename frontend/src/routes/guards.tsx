import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "../store/auth";

export function ProtectedRoute() {
  const { user, loading } = useAuth();
  if (loading) {
    return <div className="page-shell">Cargando sesion...</div>;
  }
  return user ? <Outlet /> : <Navigate to="/login" replace />;
}

export function AdminRoute() {
  const { user, loading } = useAuth();
  if (loading) {
    return <div className="page-shell">Cargando sesion...</div>;
  }
  return user?.role === "admin" ? <Outlet /> : <Navigate to="/" replace />;
}

