# Prompt maestro para Codex: aplicación web full-stack de rutas camper con pasaportes sellables

## 1. Rol de Codex

Actúa como un arquitecto senior full-stack y desarrolla una aplicación web responsive, escalable y mantenible para turismo en autocaravanas, caravanas y furgonetas camper.

La aplicación debe construirse con:

- **Frontend:** React + Vite + TypeScript.
- **Backend:** Python + FastAPI.
- **Base de datos inicial:** SQLite.
- **ORM y migraciones:** SQLAlchemy 2.x + Alembic.
- **Preparación para escalar:** arquitectura preparada para migrar de SQLite a PostgreSQL/MySQL sin reescribir la lógica de negocio.
- **Autenticación:** JWT con refresh tokens, roles y control de permisos.
- **Mapas:** Leaflet / React Leaflet u otra solución open-source compatible.
- **QR:** generación automática de códigos QR para puntos de sellado y lectura desde la aplicación.
- **Pagos:** integración modular con pasarela de pagos para tarjeta y Bizum, con entorno de pruebas.

El resultado debe ser un repositorio funcional con frontend, backend, base de datos, migraciones, seed inicial, documentación, pruebas básicas y guía de despliegue.

---

## 2. Objetivo del producto

Construir una plataforma turística para rutas camper donde los usuarios puedan descubrir rutas, comprar pasaportes digitales/físicos asociados a una ruta concreta, activar su pasaporte, sellarlo mediante códigos QR en puntos oficiales y consultar su progreso.

La plataforma debe tomar como referencia funcional el sitio `https://rutanvi.com/`, pero no debe copiar marca, textos, imágenes, diseño exacto ni contenido protegido. Debe reinterpretar y mejorar el concepto: convertir una ruta slow travel con pasaporte, mapa, puntos de sellado, guía, descuentos, comunidad y diploma final en una plataforma multi-ruta, administrable y escalable.

La referencia de estilo visual debe inspirarse en `https://swubase.com/`: tarjetas oscuras, diseño moderno, dashboards visuales, paneles compactos, estructura de datos clara, estadísticas y componentes de alto impacto visual.

---

## 3. Funcionalidad de referencia observada en Rutanvi

Usar como punto de partida funcional las siguientes ideas:

1. Landing de experiencia turística:
   - Hero visual.
   - Mensaje emocional de viaje lento.
   - Llamadas a la acción para comprar pasaporte y descubrir la ruta.
   - Bloques promocionales de aventura, gastronomía, naturaleza, pueblos, experiencias y comunidad.

2. Página de ruta:
   - Descripción turística y narrativa de la ruta.
   - Distancia aproximada, origen, destino, puntos clave y propuesta de valor.
   - Enfoque en parar, descubrir negocios locales y vivir la carretera.

3. Cómo funciona:
   - Comprar pasaporte.
   - Recorrer la ruta a ritmo propio.
   - Sellar en paradas oficiales.
   - Completar la experiencia y obtener diploma/recompensa.

4. Pasaporte:
   - Producto central de monetización.
   - Pasaporte personal y numerado.
   - Acceso a mapa, guía, puntos de sellado, descuentos, sorpresas y diploma.
   - Modalidades: pasaporte individual, pareja, mascota, super pasaporte y packs de bienvenida.

5. Activación de pasaporte:
   - Formulario para asociar número de pasaporte, nombre, email, teléfono, vehículo, días de ruta, origen, destino, tipo de viaje, intereses y observaciones.
   - La activación permite personalizar la experiencia y el diploma.

6. Mapa:
   - Mapa de localidades y puntos de sellado.
   - Parte pública promocional y parte premium desbloqueable con pasaporte.

7. Tienda:
   - Productos tipo pasaporte y packs.
   - Carrito/checkout.
   - Compra como mecanismo de monetización.

8. Área de miembro:
   - Login.
   - Acceso a zona privada del usuario.

La nueva aplicación debe mejorar esta base con arquitectura multi-ruta, panel admin completo, pasaportes por ruta, QR dinámicos, dashboards, filtros, mapas avanzados y gestión de monetización.

---

## 4. Tipos de usuario y roles

Implementar estos roles:

### 4.1 Usuario no registrado

Puede:

- Ver landing pública.
- Ver listado de rutas disponibles.
- Ver detalle promocional de cada ruta.
- Ver mapa público con puntos destacados no premium.
- Ver reseñas turísticas de la ruta y puntos de sellado promocionales.
- Ver tipos de pasaporte disponibles para cada ruta y precios.
- Registrarse.
- Iniciar compra de pasaporte.
- Suscribirse a newsletter.
- Contactar con la plataforma.

No puede:

- Sellar pasaportes.
- Ver puntos premium completos si la ruta los restringe.
- Acceder a panel privado.
- Ver códigos QR internos.

### 4.2 Usuario registrado

Puede:

- Gestionar su cuenta.
- Ver sus rutas compradas/activadas.
- Ver sus pasaportes.
- Activar un pasaporte comprado introduciendo número/serie si procede.
- Ver progreso de sellado.
- Escanear QR desde móvil para sellar puntos.
- Ver mapa privado de la ruta con puntos de sellado, estado de cada punto y progreso.
- Descargar/visualizar diploma cuando cumpla condiciones.
- Consultar histórico de compras.
- Consultar descuentos o recompensas asociadas.

### 4.3 Administrador

Puede:

- Gestionar usuarios.
- Gestionar rutas.
- Gestionar puntos de sellado.
- Gestionar pasaportes y tipos de pasaporte.
- Gestionar productos, precios y monetización.
- Gestionar pedidos y pagos.
- Ver panel de métricas.
- Ver y editar pasaportes en todas las rutas.
- Filtrar pasaportes por ruta, usuario, estado, fecha, progreso, tipo y ubicación.
- Visualizar mapas administrativos con rutas, puntos de sellado, pasaportes activos y actividad reciente.
- Generar, invalidar y regenerar QR de puntos de sellado.
- Revisar logs de sellado.
- Exportar CSV de usuarios, rutas, pasaportes, pedidos y sellos.

### 4.4 Punto colaborador / negocio local, opcional para fase 2

Preparar el modelo para un rol `partner`, aunque no sea obligatorio implementar su panel completo en el MVP.

Puede en fase futura:

- Gestionar información de su punto de sellado.
- Ver visitas/sellos asociados a su negocio.
- Proponer promociones.

---

## 5. Arquitectura del repositorio

Crear una estructura similar a:

```txt
camper-passport-platform/
  README.md
  .env.example
  docker-compose.yml
  backend/
    app/
      main.py
      core/
        config.py
        security.py
        database.py
        permissions.py
      models/
        user.py
        route.py
        passport.py
        order.py
        payment.py
        stamp.py
        qr_token.py
        newsletter.py
      schemas/
        auth.py
        user.py
        route.py
        passport.py
        order.py
        payment.py
        stamp.py
        admin.py
      api/
        v1/
          router.py
          auth.py
          users.py
          routes.py
          passports.py
          stamps.py
          orders.py
          payments.py
          admin.py
          dashboard.py
          newsletter.py
      services/
        auth_service.py
        route_service.py
        passport_service.py
        stamp_service.py
        qr_service.py
        payment_service.py
        diploma_service.py
        dashboard_service.py
      payment_providers/
        base.py
        stripe_provider.py
        redsys_provider.py
        mock_provider.py
      repositories/
        base.py
        users.py
        routes.py
        passports.py
        orders.py
        payments.py
      migrations/
      tests/
      seed.py
    pyproject.toml
    alembic.ini
  frontend/
    index.html
    package.json
    vite.config.ts
    src/
      main.tsx
      App.tsx
      api/
        client.ts
        auth.ts
        routes.ts
        passports.ts
        admin.ts
        payments.ts
      components/
        layout/
        ui/
        maps/
        charts/
        qr/
        route/
        passport/
        admin/
      pages/
        public/
          HomePage.tsx
          RoutesPage.tsx
          RouteDetailPage.tsx
          PassportCatalogPage.tsx
          CheckoutPage.tsx
          LoginPage.tsx
          RegisterPage.tsx
        user/
          UserDashboardPage.tsx
          MyRoutesPage.tsx
          MyPassportsPage.tsx
          PassportDetailPage.tsx
          ScanStampPage.tsx
          AccountPage.tsx
        admin/
          AdminDashboardPage.tsx
          AdminUsersPage.tsx
          AdminRoutesPage.tsx
          AdminRouteEditorPage.tsx
          AdminPassportsPage.tsx
          AdminOrdersPage.tsx
          AdminPaymentsPage.tsx
          AdminStampPointsMapPage.tsx
      routes/
        router.tsx
      store/
        authStore.ts
      styles/
        globals.css
        theme.css
      types/
        api.ts
        domain.ts
    tsconfig.json
```

---

## 6. Modelo de datos mínimo

Implementar entidades con SQLAlchemy, Pydantic y migraciones Alembic.

### 6.1 User

Campos:

- id
- email único
- password_hash
- full_name
- phone
- role: `guest`, `user`, `admin`, `partner`
- is_active
- is_verified
- created_at
- updated_at

### 6.2 Route

Campos:

- id
- slug único
- title
- subtitle
- description_short
- description_long
- origin_name
- destination_name
- distance_km
- estimated_days_min
- estimated_days_max
- vehicle_focus: camper, autocaravana, coche, moto, bici, mixto
- status: draft, published, archived
- hero_image_url
- gallery_json
- public_map_enabled
- premium_map_enabled
- diploma_min_stamps
- created_at
- updated_at

### 6.3 RouteSegment, opcional pero recomendado

Campos:

- id
- route_id
- title
- description
- order_index
- start_lat
- start_lng
- end_lat
- end_lng
- polyline_json

### 6.4 StampPoint

Campos:

- id
- route_id
- partner_user_id nullable
- name
- slug
- description_public
- description_premium
- category: pueblo, restaurante, museo, mirador, camping, area_camper, comercio, experiencia, naturaleza, otro
- address
- city
- province
- lat
- lng
- opening_hours_json
- contact_phone
- website_url
- image_url
- is_public_preview
- is_active
- qr_secret_hash
- qr_public_code
- created_at
- updated_at

Cuando se cree un `StampPoint`, generar automáticamente:

- `qr_public_code`: UUID o token opaco.
- `qr_secret_hash`: hash seguro del token real.
- imagen QR descargable para admin.

El QR no debe exponer IDs incrementales ni permitir falsificación simple.

### 6.5 PassportType

Representa los tipos de pasaporte vendibles por ruta.

Campos:

- id
- route_id
- code
- name
- description
- price_cents
- currency: EUR
- includes_json
- max_holders
- holder_type: individual, pareja, mascota, familiar, premium, pack
- is_physical
- is_digital
- is_active
- sort_order

Tipos iniciales para seed, inspirados en la tienda de referencia:

- Pasaporte Ruta estándar.
- Pasaporte Pareja.
- Pasaporte Mascota.
- Super Pasaporte.
- Welcome Pack TOP.
- Welcome Pack Turbo.

Los nombres pueden adaptarse a marca propia, pero deben existir equivalentes funcionales.

### 6.6 Passport

Pasaporte concreto de un usuario para una ruta.

Campos:

- id
- route_id
- passport_type_id
- user_id nullable hasta activación si se permite compra invitada
- order_id nullable
- serial_number único
- display_name_for_diploma
- vehicle_type: camper, autocaravana, coche, moto, bici, otro
- travel_mode: solo, pareja, grupo, familia
- origin_direction
- destination_direction
- start_date nullable
- expected_days nullable
- status: inactive, active, completed, cancelled, expired
- stamp_status: unstamped, partially_stamped, fully_stamped
- activated_at
- completed_at
- created_at
- updated_at

### 6.7 PassportHolder, opcional para pareja/familia/mascota

Campos:

- id
- passport_id
- name
- holder_type: adult, child, pet
- notes

### 6.8 Stamp

Registro de sellado.

Campos:

- id
- passport_id
- stamp_point_id
- user_id
- stamped_at
- lat nullable
- lng nullable
- scan_source: qr_scan, admin_manual, partner_manual
- device_info nullable
- validation_status: valid, duplicate, suspicious, revoked
- notes

Reglas:

- Un pasaporte solo puede tener un sello válido por punto.
- Si se escanea de nuevo el mismo punto, devolver estado `duplicate` sin duplicar progreso.
- Registrar intentos sospechosos si el QR está revocado o no corresponde a ruta.

### 6.9 Order

Campos:

- id
- user_id nullable
- email
- total_cents
- currency
- status: pending, paid, failed, cancelled, refunded
- created_at
- updated_at

### 6.10 OrderItem

Campos:

- id
- order_id
- passport_type_id
- quantity
- unit_price_cents
- total_cents

### 6.11 Payment

Campos:

- id
- order_id
- provider: mock, stripe, redsys
- method: card, bizum
- provider_payment_id
- amount_cents
- currency
- status: pending, authorized, paid, failed, cancelled, refunded
- raw_response_json
- created_at
- updated_at

### 6.12 NewsletterSubscription

Campos:

- id
- email
- name
- consent_privacy
- source
- created_at

### 6.13 AuditLog

Campos:

- id
- actor_user_id
- action
- entity_type
- entity_id
- metadata_json
- created_at

---

## 7. Estados de pasaporte y sellado

Implementar dos niveles de estado:

### Estado operativo del pasaporte

- `inactive`: comprado o creado, pero no activado.
- `active`: activado y listo para sellar.
- `completed`: ha cumplido los requisitos de la ruta.
- `cancelled`: anulado manualmente.
- `expired`: caducado si en el futuro se define fecha límite.

### Estado de sellado

- `unstamped`: sin sellos.
- `partially_stamped`: tiene al menos un sello pero no ha completado la ruta.
- `fully_stamped`: alcanza el mínimo de sellos o todos los puntos requeridos.

La interfaz debe mostrar progreso:

- número de sellos conseguidos,
- número requerido para diploma,
- porcentaje de avance,
- puntos pendientes,
- mapa con marcadores sellados/no sellados.

---

## 8. Backend FastAPI

### 8.1 Requisitos generales

- Usar routers versionados `/api/v1`.
- Usar Pydantic para validación.
- Usar SQLAlchemy 2.x.
- Usar dependencias para sesión DB, usuario actual y permisos.
- Usar JWT access token + refresh token.
- Usar CORS configurable.
- Usar `.env` y `.env.example`.
- Crear seed inicial con:
  - usuario admin,
  - ruta demo,
  - puntos de sellado demo,
  - tipos de pasaporte demo,
  - usuario demo,
  - pasaporte activo demo.

### 8.2 Endpoints públicos

Crear endpoints:

```txt
GET    /api/v1/health
GET    /api/v1/routes
GET    /api/v1/routes/{slug}
GET    /api/v1/routes/{slug}/stamp-points/public
GET    /api/v1/routes/{slug}/passport-types
POST   /api/v1/newsletter/subscribe
POST   /api/v1/auth/register
POST   /api/v1/auth/login
POST   /api/v1/auth/refresh
POST   /api/v1/orders
POST   /api/v1/payments/checkout-session
POST   /api/v1/payments/webhook/{provider}
```

### 8.3 Endpoints de usuario autenticado

```txt
GET    /api/v1/me
PATCH  /api/v1/me
GET    /api/v1/me/routes
GET    /api/v1/me/passports
GET    /api/v1/me/passports/{passport_id}
POST   /api/v1/me/passports/activate
POST   /api/v1/me/passports/{passport_id}/scan
GET    /api/v1/me/passports/{passport_id}/stamps
GET    /api/v1/me/orders
GET    /api/v1/me/diplomas/{passport_id}
```

### 8.4 Endpoints admin

```txt
GET    /api/v1/admin/dashboard/summary
GET    /api/v1/admin/users
POST   /api/v1/admin/users
PATCH  /api/v1/admin/users/{user_id}
DELETE /api/v1/admin/users/{user_id}

GET    /api/v1/admin/routes
POST   /api/v1/admin/routes
GET    /api/v1/admin/routes/{route_id}
PATCH  /api/v1/admin/routes/{route_id}
DELETE /api/v1/admin/routes/{route_id}

GET    /api/v1/admin/routes/{route_id}/stamp-points
POST   /api/v1/admin/routes/{route_id}/stamp-points
PATCH  /api/v1/admin/stamp-points/{stamp_point_id}
DELETE /api/v1/admin/stamp-points/{stamp_point_id}
POST   /api/v1/admin/stamp-points/{stamp_point_id}/regenerate-qr
GET    /api/v1/admin/stamp-points/{stamp_point_id}/qr

GET    /api/v1/admin/passport-types
POST   /api/v1/admin/passport-types
PATCH  /api/v1/admin/passport-types/{passport_type_id}
DELETE /api/v1/admin/passport-types/{passport_type_id}

GET    /api/v1/admin/passports
POST   /api/v1/admin/passports
PATCH  /api/v1/admin/passports/{passport_id}
POST   /api/v1/admin/passports/{passport_id}/manual-stamp

GET    /api/v1/admin/orders
GET    /api/v1/admin/payments
GET    /api/v1/admin/exports/{entity}.csv
```

### 8.5 Filtros admin obligatorios

En listados admin permitir filtros por query params:

- route_id
- user_id
- passport_type_id
- status
- stamp_status
- payment_status
- date_from
- date_to
- city
- province
- search
- page
- page_size

---

## 9. Sellado por QR

### 9.1 Generación de QR

Al crear un punto de sellado:

1. Crear token aleatorio seguro.
2. Guardar hash del token.
3. Crear `qr_public_code` o URL de sellado.
4. Generar imagen QR que apunte a:

```txt
https://APP_DOMAIN/scan?code=<qr_public_code>&token=<opaque_token>
```

O alternativamente:

```txt
https://APP_DOMAIN/api/v1/stamp/resolve/<opaque_token>
```

Preferir que el QR abra una pantalla frontend `/scan` para que el usuario confirme el sellado.

### 9.2 Flujo de escaneo

1. Usuario autenticado abre cámara desde `ScanStampPage`.
2. App lee QR.
3. App envía token al backend junto al pasaporte seleccionado.
4. Backend valida:
   - usuario autenticado,
   - pasaporte activo,
   - QR válido,
   - punto activo,
   - punto pertenece a la ruta del pasaporte,
   - no existe sello válido previo para ese punto.
5. Backend crea `Stamp`.
6. Backend recalcula progreso.
7. Si alcanza mínimo para diploma, marca `fully_stamped` y si corresponde `completed`.

### 9.3 Seguridad mínima

- No aceptar solo `stamp_point_id` como prueba de sellado.
- Usar tokens opacos.
- Hashear tokens en base de datos.
- Permitir revocación/regeneración desde admin.
- Registrar IP/user-agent cuando sea posible.
- Preparar el modelo para añadir geofencing opcional: validar que el usuario está cerca del punto.

---

## 10. Pagos y monetización

### 10.1 Diseño modular

Implementar un `PaymentProvider` abstracto con métodos:

```python
class PaymentProvider(Protocol):
    async def create_checkout(self, order: Order, method: PaymentMethod) -> CheckoutResult: ...
    async def handle_webhook(self, payload: dict, headers: dict) -> PaymentWebhookResult: ...
    async def refund(self, payment: Payment, amount_cents: int | None = None) -> RefundResult: ...
```

Implementar proveedores:

- `MockPaymentProvider`: obligatorio para desarrollo y tests.
- `StripePaymentProvider`: recomendado para tarjeta y Bizum si la cuenta/país lo permite.
- `RedsysPaymentProvider`: recomendado para integración bancaria española con tarjeta y Bizum.

### 10.2 Entorno de desarrollo

En desarrollo:

- Usar `PAYMENT_PROVIDER=mock` por defecto.
- Permitir simular pagos correctos, fallidos y cancelados.
- Al confirmar pago correcto, crear pasaportes según `OrderItem.quantity`.
- Generar seriales únicos.
- Enviar la respuesta necesaria al frontend.

### 10.3 Stripe

Implementar estructura preparada para Stripe Checkout o Payment Intents:

- Variables `.env`:
  - `STRIPE_SECRET_KEY`
  - `STRIPE_WEBHOOK_SECRET`
  - `STRIPE_PUBLIC_KEY`
- Soportar métodos de pago:
  - tarjeta,
  - Bizum si está disponible para la cuenta y el comercio cumple requisitos.
- No almacenar datos de tarjeta.
- Confirmar pagos por webhook, no solo por retorno frontend.
- Documentar tarjetas de prueba y teléfonos de prueba para Bizum según documentación oficial de Stripe.

### 10.4 Redsys / Bizum

Implementar estructura preparada para Redsys:

- Variables `.env`:
  - `REDSYS_MERCHANT_CODE`
  - `REDSYS_TERMINAL`
  - `REDSYS_SECRET_KEY`
  - `REDSYS_CURRENCY=978`
  - `REDSYS_TRANSACTION_TYPE=0`
  - `REDSYS_ENV=sandbox|production`
- Entorno de pruebas:
  - Usar URL de pruebas Redsys.
- Producción:
  - Usar URL real Redsys.
- Documentar que para Bizum normalmente se requiere activación del método por parte del banco/TPV virtual.
- Implementar firma, parámetros de entrada/salida y validación de respuesta siguiendo documentación oficial.
- No dejar credenciales reales en el repositorio.

### 10.5 Estados de compra

Flujo:

1. Usuario selecciona ruta y tipo de pasaporte.
2. Crea pedido `pending`.
3. Se inicia checkout con proveedor.
4. Webhook confirma pago.
5. Pedido pasa a `paid`.
6. Se crean pasaportes `inactive` o `active` según configuración.
7. Usuario activa/personaliza pasaporte desde panel.

---

## 11. Frontend React + Vite

### 11.1 Requisitos generales

- React + Vite + TypeScript.
- React Router.
- Estado global ligero con Zustand o Context API.
- Fetcher centralizado con Axios o Fetch wrapper.
- Manejo de errores y loading states.
- Responsive mobile-first.
- Componentes reutilizables.
- Formularios con React Hook Form + Zod.
- Mapas con React Leaflet.
- Gráficos admin con Recharts.
- Lector QR con librería compatible web/mobile.

### 11.2 Páginas públicas

#### HomePage

Debe incluir:

- Hero oscuro de alto impacto.
- Mensaje: rutas camper, slow travel, pasaportes, sellos y experiencias locales.
- CTA: “Explorar rutas”, “Comprar pasaporte”.
- Cards de rutas destacadas.
- Bloque “Cómo funciona”.
- Bloque de comunidad/newsletter.
- Bloque de impacto local.

#### RoutesPage

Debe incluir:

- Listado de rutas publicadas.
- Filtros por provincia, distancia, duración, tipo de vehículo, dificultad o temática.
- Cards con imagen, distancia, número de puntos de sellado, precio desde, estado.

#### RouteDetailPage

Debe incluir:

- Hero de ruta.
- Descripción emocional y turística.
- Mapa público.
- Puntos destacados.
- Tipos de pasaporte disponibles.
- CTA para comprar.
- Sección de preguntas frecuentes.

#### PassportCatalogPage

Debe mostrar los pasaportes de una ruta:

- Tarjetas con precio.
- Qué incluye.
- Diferencias entre individual, pareja, mascota, super pasaporte y packs.
- CTA checkout.

#### CheckoutPage

Debe permitir:

- Revisar pedido.
- Elegir método de pago: tarjeta o Bizum si está disponible.
- Simulación con mock en desarrollo.
- Redirección o integración con proveedor real según configuración.

### 11.3 Páginas de usuario

#### UserDashboardPage

Mostrar:

- rutas activas,
- pasaportes,
- progreso total,
- últimos sellos,
- CTA para escanear QR,
- alertas de pasaportes pendientes de activar.

#### MyPassportsPage

Mostrar:

- tabla/cards de pasaportes,
- estado,
- ruta,
- progreso,
- botón detalle.

#### PassportDetailPage

Mostrar:

- datos del pasaporte,
- mapa con puntos sellados/no sellados,
- timeline de sellos,
- progreso hacia diploma,
- botón escanear QR,
- botón descargar diploma si procede.

#### ScanStampPage

Debe:

- abrir cámara,
- leer QR,
- permitir seleccionar pasaporte si hay varios,
- mostrar confirmación,
- mostrar éxito/error/duplicado,
- actualizar progreso.

### 11.4 Páginas admin

#### AdminDashboardPage

Debe incluir tarjetas KPI:

- usuarios registrados,
- rutas publicadas,
- pasaportes vendidos,
- pasaportes activos,
- ingresos totales,
- ingresos por ruta,
- sellos realizados,
- tasa de completado.

Gráficos:

- ventas por día/mes,
- pasaportes por tipo,
- actividad de sellado por ruta,
- mapa de calor/puntos más sellados si es posible.

#### AdminRoutesPage / AdminRouteEditorPage

Debe permitir:

- crear ruta,
- editar datos generales,
- publicar/archivar,
- gestionar puntos de sellado,
- editar mapa,
- ordenar segmentos,
- asociar tipos de pasaporte.

#### AdminPassportsPage

Debe permitir:

- ver todos los pasaportes,
- filtrar por ruta/estado/usuario/tipo/fecha,
- editar estado,
- ver progreso,
- abrir mapa centrado en la ruta,
- añadir sello manual justificado.

#### AdminPaymentsPage

Debe permitir:

- ver pedidos,
- ver pagos,
- filtrar por proveedor, método y estado,
- acceder a detalle de respuesta proveedor,
- marcar incidencia manual si procede.

---

## 12. Estilo visual

Crear una identidad visual propia, no clonada.

### 12.1 Tema

- Tema oscuro.
- Escala de grises.
- Minimalista, moderno y profesional.
- Bajo contraste agresivo: evitar colores neón excesivos.
- Colores de acento elegantes para CTAs, progreso y estados.

### 12.2 Paleta sugerida

Usar CSS variables:

```css
:root {
  --bg-main: #0b0d10;
  --bg-panel: #12161b;
  --bg-card: #181d23;
  --bg-card-hover: #20262e;
  --border-soft: #2a313a;
  --text-main: #f2f4f6;
  --text-muted: #a7b0ba;
  --text-soft: #737d89;
  --accent: #d6a85f;
  --accent-soft: #8f7447;
  --accent-2: #6fa8a0;
  --danger: #d16b6b;
  --success: #7cbf8f;
  --warning: #d6a85f;
}
```

### 12.3 Componentes UI

Crear componentes:

- `AppShell`
- `Navbar`
- `Sidebar`
- `RouteCard`
- `PassportCard`
- `MetricCard`
- `StatusBadge`
- `ProgressRing` o `ProgressBar`
- `MapPanel`
- `StampPointMarker`
- `AdminDataTable`
- `ChartCard`
- `QrScannerPanel`
- `EmptyState`
- `LoadingSkeleton`

### 12.4 Inspiración SWUBase

Usar ideas de:

- Cards densas y visuales.
- Paneles de métricas.
- Secciones con datos estructurados.
- Tablas y filtros compactos.
- Dashboards oscuros.
- Gráficos con estética sobria.

No copiar contenido, logotipos ni assets.

---

## 13. Requisitos de responsive design

Debe funcionar correctamente en:

- móvil pequeño,
- móvil grande,
- tablet,
- desktop,
- panel admin desktop.

Reglas:

- Mobile-first.
- Menú hamburguesa en móvil.
- Cards en una columna en móvil.
- Mapas con altura adaptada.
- Tablas admin con scroll horizontal o cards móviles.
- QR scanner optimizado para móvil.

---

## 14. Seguridad, privacidad y cumplimiento

Implementar mínimo:

- Hash de contraseñas con bcrypt/passlib.
- JWT con expiración.
- Refresh tokens.
- Roles y permisos.
- Validación de inputs.
- CORS por entorno.
- Rate limiting básico en login y escaneo QR si es viable.
- No guardar datos sensibles de tarjeta.
- Webhooks firmados para pagos.
- Logs de auditoría para acciones admin.
- Consentimiento explícito en newsletter y formularios.
- Preparar textos legales placeholder: aviso legal, privacidad, cookies, términos de compra.
- Preparar el modelo para RGPD: exportación/eliminación/anominización futura de usuario.

---

## 15. Datos seed de demostración

Crear seed con:

1. Ruta demo:
   - Nombre: Ruta Camper Atlántica Demo.
   - Origen: Madrid.
   - Destino: A Coruña.
   - Distancia: 600 km.
   - Mínimo para diploma: 10 sellos.

2. Puntos de sellado demo:
   - 8-12 puntos con lat/lng reales aproximados o ficticios claramente marcados como demo.
   - Categorías variadas.

3. Tipos de pasaporte:
   - Estándar: 9,95 €.
   - Pareja: 18,90 €.
   - Mascota: 16,90 €.
   - Super Pasaporte: 17,90 €.
   - Welcome Pack TOP: 29,95 €.
   - Welcome Pack Turbo: 29,95 €.

4. Usuarios:
   - admin@example.com / Admin1234!
   - user@example.com / User1234!

5. Pasaporte demo activo para usuario.

---

## 16. Pruebas

Crear pruebas backend con pytest:

- registro/login,
- listado de rutas públicas,
- creación de ruta admin,
- creación de punto de sellado y generación QR,
- compra mock,
- activación de pasaporte,
- sellado QR correcto,
- sellado duplicado,
- intento de sellado con pasaporte de otra ruta,
- permisos admin/user.

Crear pruebas frontend básicas si el setup lo permite:

- render HomePage,
- render RoutesPage,
- flujo login mock,
- componentes principales.

---

## 17. Documentación requerida

Crear `README.md` con:

- descripción del proyecto,
- arquitectura,
- requisitos,
- instalación backend,
- instalación frontend,
- variables de entorno,
- migraciones,
- seed,
- ejecución local,
- ejecución con Docker,
- pagos mock,
- preparación Stripe,
- preparación Redsys/Bizum,
- endpoints principales,
- usuarios demo,
- decisiones técnicas,
- próximos pasos.

Crear también:

- `docs/payment-gateways.md`
- `docs/data-model.md`
- `docs/api-overview.md`
- `docs/admin-guide.md`

---

## 18. Entregables esperados de Codex

Codex debe producir:

1. Código backend funcional.
2. Código frontend funcional.
3. Modelos SQLAlchemy.
4. Schemas Pydantic.
5. Migraciones Alembic.
6. Seed inicial.
7. Autenticación y permisos.
8. CRUD público/admin.
9. Flujo mock de compra.
10. Arquitectura preparada para Stripe y Redsys/Bizum.
11. Generación y validación de QR.
12. Mapas públicos, privados y admin.
13. Panel de usuario.
14. Panel admin.
15. Estilos dark responsive.
16. Tests mínimos.
17. Documentación.

---

## 19. Criterios de aceptación

La tarea se considera completada cuando:

- `docker-compose up` levanta backend y frontend o, si no se usa Docker, el README permite levantar ambos sin ambigüedad.
- El backend expone `/api/v1/health` correctamente.
- El frontend carga la home.
- Se puede registrar un usuario.
- Se puede iniciar sesión.
- Se pueden ver rutas públicas.
- Admin puede crear/editar una ruta.
- Admin puede crear puntos de sellado y descargar/ver QR.
- Admin puede crear tipos de pasaporte para una ruta.
- Usuario puede comprar un pasaporte con proveedor mock.
- Usuario puede activar su pasaporte.
- Usuario puede escanear/simular QR y sellar un punto.
- El progreso del pasaporte se actualiza.
- El admin puede filtrar pasaportes por ruta y estado.
- El dashboard admin muestra métricas reales desde la base de datos.
- La aplicación es responsive.
- No hay credenciales reales en el repositorio.
- El código está organizado en módulos, no concentrado en archivos gigantes.

---

## 20. Decisiones técnicas preferidas

Si hay dudas, aplicar estas decisiones:

- Usar SQLite para desarrollo local, pero configurar SQLAlchemy con URL por variable de entorno.
- Usar PostgreSQL en `docker-compose` como servicio opcional preparado, aunque SQLite sea el valor por defecto.
- Usar Stripe como implementación más rápida para tarjeta/Bizum si la cuenta lo soporta; Redsys como implementación bancaria española preparada mediante adaptador.
- Usar `MockPaymentProvider` completamente funcional para desarrollo.
- Usar React Leaflet para mapas.
- Usar Recharts para gráficos.
- Usar Zod + React Hook Form en formularios.
- Usar CSS variables y componentes propios en lugar de depender totalmente de una librería UI pesada.
- Priorizar MVP funcional antes que animaciones complejas.

---

## 21. Restricciones

- No copiar contenido textual, imágenes, marcas ni diseño exacto de los sitios de referencia.
- No almacenar datos de tarjeta.
- No exponer tokens QR en logs innecesarios.
- No usar IDs incrementales como único mecanismo de QR.
- No mezclar lógica de pagos directamente en endpoints; usar servicios y providers.
- No crear una app solo estática: debe tener backend real, modelo de datos y persistencia.
- No dejar TODOs críticos sin resolver en autenticación, pagos mock, sellado QR o permisos.

---

## 22. Orden de implementación recomendado

Implementar por fases:

### Fase 1: Base técnica

- Estructura repo.
- Backend FastAPI.
- Frontend Vite.
- Configuración `.env`.
- Base de datos.
- Modelos principales.
- Migraciones.
- Seed.

### Fase 2: Autenticación y roles

- Registro.
- Login.
- JWT.
- Refresh token.
- Guards frontend.
- Permisos admin/user.

### Fase 3: Rutas y pasaportes públicos

- Listado de rutas.
- Detalle de ruta.
- Tipos de pasaporte.
- Landing.
- Estilos base.

### Fase 4: Admin CRUD

- Gestión rutas.
- Gestión puntos de sellado.
- Gestión tipos de pasaporte.
- Gestión usuarios.

### Fase 5: Compra y activación

- Pedido.
- Pago mock.
- Creación de pasaportes.
- Activación.

### Fase 6: QR y sellado

- Generación QR.
- Lectura/simulación QR.
- Validación backend.
- Progreso.

### Fase 7: Mapas y dashboards

- Mapa público.
- Mapa usuario.
- Mapa admin.
- Métricas.
- Gráficos.

### Fase 8: Documentación y tests

- README.
- Docs pagos.
- Tests backend.
- Revisión final.

---

## 23. Salida esperada al terminar

Al finalizar, explica:

1. Qué se ha implementado.
2. Cómo levantar backend y frontend.
3. Qué usuarios demo existen.
4. Cómo probar compra mock.
5. Cómo probar sellado QR.
6. Qué queda pendiente para pasar a producción.
7. Qué pasos concretos seguir para activar Stripe, Redsys, tarjeta y Bizum reales.
