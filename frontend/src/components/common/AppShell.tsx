import { NavLink, Outlet } from "react-router-dom";

import { useAuth } from "../../store/auth";

const navItems = [
  { to: "/", label: "Inicio" },
  { to: "/rutas", label: "Rutas" },
  { to: "/catalogo", label: "Pasaportes" },
  { to: "/activar", label: "Activar" },
];

export function AppShell() {
  const { user, logout } = useAuth();

  return (
    <div className="app-shell">
      <header className="site-header">
        <NavLink className="brand-mark" to="/">
          <span>Extremadura</span>
          <strong>sin prisas</strong>
        </NavLink>
        <nav className="site-nav">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
              {item.label}
            </NavLink>
          ))}
          {user && (
            <NavLink to="/mi/pasaportes" className="nav-link">
              Mi zona
            </NavLink>
          )}
          {user?.role === "admin" && (
            <NavLink to="/admin" className="nav-link">
              Admin
            </NavLink>
          )}
        </nav>
        <div className="site-actions">
          {user ? (
            <>
              <span className="user-pill">{user.full_name}</span>
              <button className="ghost-button" onClick={logout} type="button">
                Salir
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className="ghost-button">
                Entrar
              </NavLink>
              <NavLink to="/register" className="primary-button">
                Crear cuenta
              </NavLink>
            </>
          )}
        </div>
      </header>
      <main>
        <Outlet />
      </main>
      <footer className="site-footer">
        <div>
          <strong>Extremadura sin prisas</strong>
          <p>Pasaportes editoriales para rutas camper, activacion digital y sellado oficial por QR.</p>
        </div>
        <div>
          <p>Demo MVP</p>
          <p>`admin@example.com` / `Admin1234!`</p>
          <p>`user@example.com` / `User1234!`</p>
        </div>
      </footer>
    </div>
  );
}

