import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { api } from "../../api/client";
import { useAuth } from "../../store/auth";
import { PassportType, Route } from "../../types/api";

type FormValues = {
  route_id: number;
  code: string;
  name: string;
  description: string;
  price_cents: number;
  max_holders: number;
  holder_type: string;
  sort_order: number;
};

export function AdminPassportTypesPage() {
  const { accessToken } = useAuth();
  const [routes, setRoutes] = useState<Route[]>([]);
  const [passportTypes, setPassportTypes] = useState<PassportType[]>([]);
  const { register, handleSubmit, reset } = useForm<FormValues>();

  const load = async () => {
    if (!accessToken) {
      return;
    }
    const [routeData, passportTypeData] = await Promise.all([
      api.get<{ routes: Route[] }>("/admin/routes", accessToken),
      api.get<{ passport_types: PassportType[] }>("/admin/passport-types", accessToken),
    ]);
    setRoutes(routeData.routes);
    setPassportTypes(passportTypeData.passport_types);
  };

  useEffect(() => {
    void load();
  }, [accessToken]);

  const onSubmit = handleSubmit(async (values) => {
    if (!accessToken) {
      return;
    }
    await api.post<PassportType>(
      "/admin/passport-types",
      {
        ...values,
        currency: "EUR",
        is_physical: true,
        is_active: true,
      },
      accessToken,
    );
    reset();
    await load();
  });

  return (
    <section className="page-shell">
      <div className="section-heading">
        <span className="eyebrow">Admin</span>
        <h1>Tipos de pasaporte</h1>
      </div>
      <form className="admin-form" onSubmit={onSubmit}>
        <select {...register("route_id", { valueAsNumber: true })}>
          <option value="">Selecciona ruta</option>
          {routes.map((route) => (
            <option key={route.id} value={route.id}>
              {route.title}
            </option>
          ))}
        </select>
        <input {...register("code")} placeholder="Codigo" />
        <input {...register("name")} placeholder="Nombre" />
        <input {...register("price_cents", { valueAsNumber: true })} placeholder="Precio en centimos" type="number" />
        <input {...register("max_holders", { valueAsNumber: true })} placeholder="Max viajeros" type="number" />
        <input {...register("holder_type")} placeholder="holder_type" />
        <input {...register("sort_order", { valueAsNumber: true })} placeholder="Orden" type="number" />
        <textarea {...register("description")} placeholder="Descripcion" />
        <button className="primary-button" type="submit">
          Crear tipo
        </button>
      </form>
      <div className="passport-grid">
        {passportTypes.map((item) => (
          <article className="passport-card" key={item.id}>
            <span className="passport-code">{item.code}</span>
            <h3>{item.name}</h3>
            <p>{item.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

