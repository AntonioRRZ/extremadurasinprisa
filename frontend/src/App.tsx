import { BrowserRouter, Route, Routes } from "react-router-dom";

import { AppShell } from "./components/common/AppShell";
import { AdminRoute } from "./routes/guards";
import { ProtectedRoute } from "./routes/guards";
import { AdminDashboardPage } from "./pages/admin/AdminDashboardPage";
import { AdminOrdersPage } from "./pages/admin/AdminOrdersPage";
import { AdminPassportTypesPage } from "./pages/admin/AdminPassportTypesPage";
import { AdminPassportsPage } from "./pages/admin/AdminPassportsPage";
import { AdminRouteEditorPage } from "./pages/admin/AdminRouteEditorPage";
import { AdminRoutesPage } from "./pages/admin/AdminRoutesPage";
import { AdminUsersPage } from "./pages/admin/AdminUsersPage";
import { ActivationRegisterPage } from "./pages/public/ActivationRegisterPage";
import { CheckoutPage } from "./pages/public/CheckoutPage";
import { HomePage } from "./pages/public/HomePage";
import { LoginPage } from "./pages/public/LoginPage";
import { PassportCatalogPage } from "./pages/public/PassportCatalogPage";
import { PaymentResultPage } from "./pages/public/PaymentResultPage";
import { RouteDetailPage } from "./pages/public/RouteDetailPage";
import { RoutesPage } from "./pages/public/RoutesPage";
import { ActivatePassportPage } from "./pages/user/ActivatePassportPage";
import { MyOrdersPage } from "./pages/user/MyOrdersPage";
import { MyPassportsPage } from "./pages/user/MyPassportsPage";
import { PassportDetailPage } from "./pages/user/PassportDetailPage";
import { ScanStampPage } from "./pages/user/ScanStampPage";
import { UserDashboardPage } from "./pages/user/UserDashboardPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<HomePage />} />
          <Route path="/rutas" element={<RoutesPage />} />
          <Route path="/rutas/:slug" element={<RouteDetailPage />} />
          <Route path="/catalogo" element={<PassportCatalogPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/checkout/resultado" element={<PaymentResultPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<ActivationRegisterPage />} />
          <Route path="/activar" element={<ActivatePassportPage />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/mi" element={<UserDashboardPage />} />
            <Route path="/mi/pedidos" element={<MyOrdersPage />} />
            <Route path="/mi/pasaportes" element={<MyPassportsPage />} />
            <Route path="/mi/pasaportes/:passportId" element={<PassportDetailPage />} />
            <Route path="/mi/pasaportes/:passportId/scan" element={<ScanStampPage />} />
          </Route>

          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminDashboardPage />} />
            <Route path="/admin/usuarios" element={<AdminUsersPage />} />
            <Route path="/admin/rutas" element={<AdminRoutesPage />} />
            <Route path="/admin/rutas/:routeId" element={<AdminRouteEditorPage />} />
            <Route path="/admin/tipos" element={<AdminPassportTypesPage />} />
            <Route path="/admin/pasaportes" element={<AdminPassportsPage />} />
            <Route path="/admin/pedidos" element={<AdminOrdersPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
