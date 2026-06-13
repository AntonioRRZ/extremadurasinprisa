# Prompt maestro para CODEX — Plataforma full‑stack responsive de rutas camper con pasaportes físicos, activación digital, mapas privados y sellado por QR

## 0. Modo de trabajo de CODEX

Actúa como **arquitecto principal**, **product engineer senior**, **diseñador de sistemas**, **desarrollador full‑stack** y **redactor técnico**.  
Tu objetivo no es solo generar pantallas: debes construir una **aplicación real**, **modular**, **escalable**, **segura** y **lista para evolucionar** desde un MVP sólido hasta una plataforma multi‑ruta con monetización completa.

Debes entregar:

1. **Frontend funcional** con React + Vite + TypeScript.
2. **Backend funcional** con Python + FastAPI.
3. **Modelo de datos** real y persistente.
4. **Base de datos SQLite** en desarrollo, preparada para migrar a **PostgreSQL** sin reescribir la lógica de negocio.
5. **Sistema de autenticación y autorización** por roles.
6. **Panel público**, **panel de usuario** y **panel de administrador**.
7. **Carrito, pedidos, pagos y pasarela modular** para tarjeta y Bizum con entorno de pruebas.
8. **Sistema de pasaportes físicos** con activación digital.
9. **Sistema de sellado por QR** para puntos oficiales de ruta.
10. **Mapas públicos/privados/admin**.
11. **README.md completo** con instalación, configuración, librerías, entorno de desarrollo y despliegue.
12. **Documentación técnica auxiliar** para pagos, QR, modelo de datos y administración.

Trabaja con mentalidad de **producto comercial real**, no como demo académica.

---

## 1. Contexto de negocio y referencias que debes reinterpretar

Toma como base conceptual la combinación de estas referencias:

### 1.1 Referencia funcional tipo RUTA N‑VI

Debes reinterpretar, no copiar, el patrón de producto observado en RUTA N‑VI:

- El **pasaporte** es el producto central.
- El pasaporte funciona como:
  - objeto físico,
  - activador de experiencia,
  - acceso a contenido privado,
  - llave de mapa interactivo,
  - acceso a puntos de sellado,
  - acceso a descuentos y recompensas,
  - diploma final,
  - recuerdo coleccionable.
- El flujo conceptual base es:
  1. comprar pasaporte,
  2. recibir pasaporte,
  3. activarlo,
  4. acceder al contenido,
  5. sellarlo en paradas oficiales,
  6. completar experiencia y obtener diploma.

También se observa que el contenido premium puede incluir:

- mapa interactivo,
- puntos de sellado oficiales,
- recomendaciones locales,
- descuentos asociados,
- sorpresas en las paradas,
- diploma al completar la ruta,
- experiencia diferenciada por tipo de viajero o vehículo.

### 1.2 Referencia funcional tipo Ruta 181

Debes reinterpretar, no copiar, el patrón de negocio observado en Ruta 181:

- Tienda con múltiples productos físicos y digitales.
- Pasaportes personalizados y numerados.
- Acceso privado asociado al producto físico.
- Contenido privado para facilitar el viaje.
- Separación entre:
  - información pública,
  - área privada,
  - tienda,
  - rutas,
  - contenidos especializados.
- Posibilidad de tener más de una ruta y más de un tipo de producto.
- Proceso de compra y posterior personalización/activación.
- Existencia de otros SKUs complementarios además del pasaporte.

### 1.3 Referencia visual y de storytelling del PDF “Extremadura sin prisas”

El diseño del frontend, la estructura narrativa del sitio y parte del workflow deben inspirarse en el documento de estilo proporcionado:

- Hero con narrativa emocional.
- Sección “Cómo funciona”.
- Sección “Elige tu pasaporte”.
- Sección de rutas/experiencias.
- Sección de mapa protegido para usuarios con pasaporte activo.
- Flujo de activación.
- Testimonios/social proof.
- CTA final.
- Estética calmada, elegante, evocadora y experiencial.

### 1.4 Referencia de objeto físico del PDF del pasaporte

El pasaporte físico debe tomar como referencia conceptual el documento de pasaporte subido:

- objeto visualmente cuidado,
- estética editorial,
- campos para propietario,
- activación,
- narrativa de viaje,
- sensación de colección/recuerdo.

**Prohibido copiar literalmente** textos, branding, imágenes o layouts exactos de las referencias.  
Debes construir una **identidad propia** inspirada en los patrones de negocio, no una réplica.

---

## 2. Objetivo del producto

Construir una plataforma web de turismo slow travel para caravanas y, sobre todo, **furgonetas camper**, donde:

- un visitante no registrado puede **conocer el proyecto** y **comprar pasaportes**,
- un comprador puede recibir uno o varios **pasaportes físicos**,
- cada pasaporte queda ligado a una **ruta concreta**,
- el portador del pasaporte puede **registrarse/activarse** mediante su código único,
- una vez autenticado puede acceder a:
  - mapa privado de su ruta,
  - puntos oficiales,
  - progreso,
  - sellado digital,
  - recompensas,
  - diploma,
  - gestión de su cuenta y su viaje,
- el administrador puede crear nuevas rutas, nuevos puntos de sellado, nuevos tipos de pasaporte y controlar toda la monetización.

La plataforma debe resolver bien desde el principio:

- **multi‑ruta**,
- **multi‑pasaporte**,
- **compra para terceros**,
- **activación posterior al envío físico**,
- **sellado por QR**,
- **catálogo administrable**,
- **migración futura a PostgreSQL**,
- **entorno de pruebas para pagos**.

---

## 3. Reglas de negocio obligatorias

### 3.1 Naturaleza del pasaporte

El pasaporte **no es solo un cuaderno de sellos**. Debe modelarse como:

- producto físico vendible,
- unidad única asociada a una ruta,
- activador de cuenta/experiencia,
- acceso a mapa privado y puntos oficiales,
- contenedor de progreso,
- soporte de descuentos/recompensas,
- posible generador de diploma,
- recuerdo coleccionable.

### 3.2 Cada pasaporte es único y pertenece a una ruta

Cada pasaporte físico debe:

- pertenecer a **una ruta concreta**,
- tener un **código único irrepetible**,
- poder activarse una sola vez o seguir la política que defina negocio,
- quedar asociado a un usuario final tras la activación,
- tener estados operativos y de sellado.

### 3.3 Diferencia entre comprador y usuario final

La compra y la activación son procesos distintos.

Debe soportarse que:

- una persona compre pasaportes para sí misma,
- una persona compre pasaportes para otras personas,
- el comprador no sea el usuario final del pasaporte,
- el pedido pertenezca al comprador,
- el pasaporte quede posteriormente activado por el usuario final.

Por tanto, **pedidos** y **usuarios finales del pasaporte** son entidades distintas.

### 3.4 Visibilidad de rutas

Las rutas reales cargadas por el administrador **no deben estar visibles en abierto como contenido explotable completo**.

Implementa esta política:

- usuarios no registrados:
  - pueden ver la propuesta de valor del sitio,
  - información general de cómo funciona,
  - tipos de pasaporte,
  - carrito y compra,
  - ejemplos, teasers o bloques promocionales de rutas,
  - pero **no deben acceder al contenido completo y operativo de las rutas**.
- usuarios registrados con pasaporte activo:
  - acceden a las rutas que les correspondan.
- administradores:
  - acceden a todas.

### 3.5 Dos sistemas distintos de QR

Debes diferenciar claramente:

#### A) QR público de acceso al sitio

Todos los pasaportes físicos llevarán un **QR público común** que redirige al **HOME/landing de activación** del sitio.

Este QR:

- puede ser igual para todos los pasaportes,
- debe llevar al usuario al sitio,
- no sirve por sí solo para activar el pasaporte,
- simplemente inicia el flujo de registro/activación.

#### B) Código único de activación del pasaporte

Cada pasaporte debe tener además un **código único** impreso y almacenado en base de datos.

Ese código:

- es único por pasaporte,
- se utiliza en el proceso de activación,
- es el verdadero elemento de asociación entre pasaporte físico y cuenta digital.

#### C) QR de sellado de puntos oficiales

Cada punto de sellado de cada ruta debe generar su propio **QR único de sellado**.

Ese QR:

- se usa desde la zona de usuario autenticado,
- no activa el pasaporte,
- solo sirve para registrar un sello válido en ese punto.

### 3.6 Estados de pasaporte

Debes gestionar, como mínimo, dos dimensiones de estado:

#### Estado operativo
- `inactive`
- `active`
- `completed`
- `cancelled`
- `expired` (preparado para futuro)

#### Estado de sellado
- `unstamped`
- `partially_stamped`
- `fully_stamped`

Además, el frontend debe mostrar nomenclatura amigable en español:
- Activo
- Inactivo
- Sin sellar
- Sellado parcial
- Sellado completo
- Completado

### 3.7 Sellado por QR

Cuando el usuario escanea desde su zona privada el QR de un punto oficial:

- el backend valida el QR,
- valida que el punto pertenece a la misma ruta del pasaporte,
- valida que el pasaporte está activo,
- valida que el sello no esté duplicado,
- registra el sello,
- actualiza progreso,
- recalcula estados,
- desbloquea diploma o recompensa si procede.

### 3.8 Administración completa

El panel administrador debe permitir:

- gestión de usuarios,
- gestión de rutas,
- gestión de tipos de pasaporte,
- gestión de pasaportes,
- gestión de puntos de sellado,
- gestión de pedidos,
- gestión de pagos,
- control de monetización,
- filtros,
- exportación,
- visualización sobre mapa.

---

## 4. Catálogo inicial y monetización base

Usa como benchmark inicial estos productos y precios, dejando todo configurable desde panel admin o seed editable.

### 4.1 Tipos de pasaporte base

Crear como mínimo estos tipos de producto iniciales:

- Pasaporte Ruta — **9,95 €**
- Pasaporte Mascota — **16,90 €**
- Pasaporte Pareja — **18,90 €**
- Super Pasaporte — **17,90 €**
- Welcome Pack TOP — **29,95 €**
- Welcome Pack Turbo — **29,95 €**

### 4.2 Benchmark complementario tipo membresía / acceso extendido

Preparar el modelo para soportar adicionalmente productos de tipo:

- Pasaporte de ruta premium desde **20,00 €**
- Membresía de acceso / renovación desde **8,00 €**

No es obligatorio exponerlo todo en el MVP visual inicial, pero el modelo de datos y el catálogo deben quedar preparados para:

- productos físicos,
- productos digitales,
- packs,
- membresías,
- add‑ons.

### 4.3 Carrito y pedido

Implementar:

- carrito persistente en frontend,
- resumen de compra,
- datos del comprador,
- líneas de pedido,
- impuestos y total,
- selección de método de pago,
- finalización de pago,
- creación de pasaportes tras pago confirmado,
- gestión de pedidos desde admin.

### 4.4 Monetización futura

Dejar preparado el sistema para añadir después:

- merchandising,
- kits de sellado,
- accesorios,
- renovación de membresía,
- upsells,
- cupones,
- descuentos por ruta,
- packs familiares,
- patrocinio de negocios locales,
- promociones de partners.

---

## 5. Alcance funcional por áreas

## 5.1 Área pública

Los visitantes no registrados deben poder:

- ver la landing principal,
- entender el concepto,
- conocer los beneficios del pasaporte,
- ver “cómo funciona”,
- ver tipos de pasaporte y precios,
- acceder al carrito,
- iniciar/realizar compra,
- leer FAQs,
- contactar,
- suscribirse a newsletter,
- ver testimonios,
- ver una muestra controlada del ecosistema de rutas sin exponer el contenido premium.

### Importante
Las rutas completas y sus puntos oficiales **no deben quedar abiertas en modo público**.

---

## 5.2 Registro y activación

Debe existir un flujo claro de activación:

1. Usuario recibe pasaporte físico.
2. Escanea QR común o entra manualmente en la web.
3. Llega a una landing de activación.
4. Se registra o inicia sesión.
5. Introduce el **código único del pasaporte**.
6. Completa datos del viaje/perfil si procede.
7. El sistema valida código.
8. El pasaporte se asocia al usuario.
9. Se activa el acceso a la ruta correspondiente.

---

## 5.3 Zona privada de usuario

Un usuario autenticado debe poder:

- ver su dashboard,
- ver sus pasaportes,
- ver sus rutas activas,
- ver progreso,
- ver sellos conseguidos y pendientes,
- ver mapa privado,
- escanear un QR de punto de sellado,
- descargar o visualizar diploma si ha completado la ruta,
- gestionar sus datos personales,
- consultar historial de pedidos si fue comprador,
- consultar información premium de la ruta.

---

## 5.4 Área de administración

El admin debe poder:

- crear, editar, publicar y archivar rutas,
- crear y editar puntos de sellado,
- regenerar QR de sellado,
- crear y editar tipos de pasaporte,
- ver pasaportes por filtros,
- editar estado de pasaporte,
- añadir sello manual con justificación,
- ver pedidos,
- ver pagos,
- ver ingresos por ruta,
- ver usuarios,
- exportar CSV,
- gestionar copy básico,
- controlar qué contenido es teaser público y qué contenido es privado.

---

## 6. Arquitectura técnica obligatoria

## 6.1 Stack principal

### Frontend
- React
- Vite
- TypeScript
- React Router
- Zustand o Context API
- React Hook Form + Zod
- Axios o wrapper fetch centralizado
- React Leaflet para mapas
- Librería de lectura QR compatible con web móvil

### Backend
- Python
- FastAPI
- Pydantic
- SQLAlchemy 2.x
- Alembic
- JWT access + refresh tokens
- Servicios / repositorios / routers versionados

### Base de datos
- SQLite por defecto en desarrollo
- Preparada para migrar a PostgreSQL
- Sin acoplar lógica al motor

### Infraestructura
- `.env`
- `.env.example`
- Docker Compose opcional pero recomendado
- CORS configurable
- Seeds
- Tests

---

## 6.2 Estructura de repositorio recomendada

```txt
extremadura-sin-prisas-platform/
  README.md
  .env.example
  .gitignore
  docker-compose.yml
  docs/
    payment-gateways.md
    qr-and-activation.md
    data-model.md
    api-overview.md
    admin-guide.md
    deployment.md
  backend/
    pyproject.toml
    alembic.ini
    app/
      main.py
      core/
        config.py
        database.py
        security.py
        permissions.py
        logging.py
      models/
        user.py
        route.py
        route_segment.py
        stamp_point.py
        passport_type.py
        passport.py
        passport_holder.py
        order.py
        order_item.py
        payment.py
        stamp.py
        audit_log.py
        newsletter.py
      schemas/
        auth.py
        user.py
        route.py
        stamp_point.py
        passport_type.py
        passport.py
        order.py
        payment.py
        dashboard.py
      api/
        v1/
          router.py
          health.py
          auth.py
          public.py
          routes.py
          passports.py
          orders.py
          payments.py
          me.py
          admin.py
      services/
        auth_service.py
        route_service.py
        passport_service.py
        activation_service.py
        stamp_service.py
        qr_service.py
        order_service.py
        payment_service.py
        dashboard_service.py
        diploma_service.py
      payment_providers/
        base.py
        mock_provider.py
        stripe_provider.py
        redsys_provider.py
      repositories/
        users.py
        routes.py
        passports.py
        orders.py
        payments.py
        stamps.py
      utils/
        qr.py
        codes.py
        dates.py
      tests/
        test_auth.py
        test_routes.py
        test_activation.py
        test_orders.py
        test_payments.py
        test_stamps.py
        test_admin.py
      seed.py
      migrations/
  frontend/
    package.json
    vite.config.ts
    tsconfig.json
    src/
      main.tsx
      App.tsx
      api/
        client.ts
        auth.ts
        public.ts
        me.ts
        admin.ts
        orders.ts
        payments.ts
      store/
        authStore.ts
        cartStore.ts
      routes/
        router.tsx
      components/
        layout/
        ui/
        maps/
        forms/
        qr/
        route/
        passport/
        order/
        admin/
      pages/
        public/
          HomePage.tsx
          HowItWorksPage.tsx
          PassportCatalogPage.tsx
          CartPage.tsx
          CheckoutPage.tsx
          LoginPage.tsx
          RegisterPage.tsx
          ActivatePassportPage.tsx
          ContactPage.tsx
        user/
          UserDashboardPage.tsx
          MyPassportsPage.tsx
          PassportDetailPage.tsx
          MyRoutesPage.tsx
          ScanStampPage.tsx
          AccountPage.tsx
          MyOrdersPage.tsx
        admin/
          AdminDashboardPage.tsx
          AdminUsersPage.tsx
          AdminRoutesPage.tsx
          AdminRouteEditorPage.tsx
          AdminStampPointsPage.tsx
          AdminPassportTypesPage.tsx
          AdminPassportsPage.tsx
          AdminOrdersPage.tsx
          AdminPaymentsPage.tsx
      styles/
        globals.css
        theme.css
      types/
        api.ts
        domain.ts
```

---

## 7. Modelo de datos obligatorio

Diseña el modelo con SQLAlchemy 2.x y Alembic.

## 7.1 User

Campos mínimos:

- id
- email (único)
- password_hash
- full_name
- phone
- role (`user`, `admin`, `partner`)
- is_active
- is_verified
- created_at
- updated_at

---

## 7.2 BuyerProfile o datos de comprador

Puedes resolverlo reutilizando `User` o con una entidad separada si lo justificas, pero el sistema debe soportar:

- comprador autenticado o invitado,
- datos de facturación/envío,
- compras para terceros.

Si eliges no crear una entidad aparte, el pedido debe almacenar snapshot del comprador.

---

## 7.3 Route

Campos mínimos:

- id
- slug
- title
- subtitle
- description_short
- description_long
- teaser_text
- hero_image_url
- gallery_json
- province
- region
- origin_name
- destination_name
- distance_km
- estimated_days_min
- estimated_days_max
- vehicle_focus
- public_teaser_enabled
- private_content_enabled
- diploma_min_stamps
- status (`draft`, `published`, `archived`)
- created_at
- updated_at

---

## 7.4 RouteSegment

Preparar la ruta para tener geometría y narrativa por tramos.

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
- polyline_geojson

---

## 7.5 StampPoint

Campos mínimos:

- id
- route_id
- name
- slug
- category
- description_public
- description_private
- address
- city
- province
- lat
- lng
- opening_hours_json
- contact_phone
- website_url
- image_url
- is_active
- is_public_preview
- qr_public_code
- qr_secret_hash
- created_at
- updated_at

Reglas:
- al crear un punto, generar automáticamente QR,
- el QR no debe exponer IDs internos simples,
- debe poder regenerarse desde admin.

---

## 7.6 PassportType

Campos mínimos:

- id
- route_id
- code
- name
- description
- long_description
- price_cents
- currency
- includes_json
- max_holders
- holder_type (`individual`, `pair`, `pet`, `family`, `premium`, `pack`, `membership`)
- is_physical
- is_digital
- is_active
- sort_order

---

## 7.7 Passport

Campos mínimos:

- id
- route_id
- passport_type_id
- user_id nullable
- order_id nullable
- serial_number (único)
- activation_code (único, seguro)
- activation_code_hash o equivalente si decides no guardar el valor en claro
- display_name_for_diploma
- owner_name_printed nullable
- vehicle_type
- travel_mode
- start_date nullable
- expected_days nullable
- status
- stamp_status
- progress_percent
- activated_at nullable
- completed_at nullable
- created_at
- updated_at

---

## 7.8 PassportHolder

Para soportar pareja/familia/mascota:

- id
- passport_id
- name
- holder_type (`adult`, `child`, `pet`)
- notes

---

## 7.9 Stamp

- id
- passport_id
- stamp_point_id
- user_id
- stamped_at
- scan_source (`qr_scan`, `admin_manual`, `partner_manual`)
- validation_status (`valid`, `duplicate`, `suspicious`, `revoked`)
- lat nullable
- lng nullable
- device_info nullable
- notes nullable

Regla:
- un pasaporte no puede tener más de un sello válido por punto.

---

## 7.10 Order

- id
- buyer_user_id nullable
- buyer_email
- buyer_full_name
- shipping_name
- shipping_phone
- shipping_address_json
- total_cents
- currency
- status (`pending`, `paid`, `failed`, `cancelled`, `refunded`)
- created_at
- updated_at

---

## 7.11 OrderItem

- id
- order_id
- passport_type_id nullable
- product_name_snapshot
- quantity
- unit_price_cents
- total_cents
- metadata_json

---

## 7.12 Payment

- id
- order_id
- provider (`mock`, `stripe`, `redsys`)
- method (`card`, `bizum`)
- provider_payment_id
- amount_cents
- currency
- status (`pending`, `authorized`, `paid`, `failed`, `cancelled`, `refunded`)
- raw_response_json
- created_at
- updated_at

---

## 7.13 NewsletterSubscription

- id
- email
- name nullable
- consent_privacy
- source
- created_at

---

## 7.14 AuditLog

- id
- actor_user_id nullable
- action
- entity_type
- entity_id
- metadata_json
- created_at

---

## 8. Flujos funcionales que debes implementar

## 8.1 Compra de pasaporte físico

Flujo:

1. Visitante entra en la web.
2. Ve catálogo de pasaportes.
3. Añade uno o varios productos al carrito.
4. Completa datos de compra.
5. Elige método de pago.
6. Se crea pedido `pending`.
7. El proveedor confirma pago.
8. Pedido pasa a `paid`.
9. El sistema crea uno o varios pasaportes únicos.
10. Los pasaportes quedan inicialmente `inactive` hasta activación.
11. Admin puede gestionar preparación/envío si se implementa logística ligera.

---

## 8.2 Activación de pasaporte

Flujo:

1. Usuario entra en landing de activación.
2. Se registra o inicia sesión.
3. Introduce código único del pasaporte.
4. Backend valida:
   - que el código existe,
   - que el pasaporte está disponible,
   - que no está cancelado,
   - que la política de activación lo permite.
5. Se asocia el pasaporte al usuario.
6. Se activa.
7. Usuario gana acceso a su ruta y mapa privado.

---

## 8.3 Sellado por QR

Flujo:

1. Usuario autenticado abre la pantalla “Escanear sello”.
2. La app abre cámara.
3. Lee el QR de un punto oficial.
4. Backend valida:
   - pasaporte activo,
   - QR válido,
   - punto activo,
   - ruta correcta,
   - no duplicidad.
5. Crea sello.
6. Recalcula progreso.
7. Si llega al mínimo, marca ruta completada o sellado completo según regla.

---

## 8.4 Gestión admin de rutas

Flujo admin:

- crear nueva ruta,
- cargar copy,
- subir imagen hero,
- definir teaser público,
- definir contenido privado,
- trazar o cargar segmentos,
- crear puntos de sellado,
- asociar tipos de pasaporte,
- publicar.

---

## 9. Sistema de pagos: arquitectura y requisitos

## 9.1 Principio de diseño

Implementa un sistema modular con patrón provider/adapter.

Debes crear una abstracción tipo:

```python
class PaymentProvider(Protocol):
    async def create_checkout(self, order, method): ...
    async def handle_webhook(self, payload, headers): ...
    async def refund(self, payment, amount_cents=None): ...
```

Implementa:

- `MockPaymentProvider`
- `StripePaymentProvider`
- `RedsysPaymentProvider`

---

## 9.2 Entorno de desarrollo obligatorio

En desarrollo el sistema debe funcionar **sin depender de credenciales reales**.

Implementa:

- `PAYMENT_PROVIDER=mock` por defecto,
- simulación de pago correcto,
- simulación de pago fallido,
- simulación de cancelación,
- creación real de pedido y pasaportes tras pago correcto,
- frontend utilizable end‑to‑end.

---

## 9.3 Integración con tarjeta y Bizum

Debes dejar implementado o muy claramente preparado el camino para:

- pago con tarjeta,
- pago con Bizum,
- sandbox,
- webhooks,
- conciliación de estados.

### Requisitos funcionales
- no confirmar un pedido solo por retorno del frontend,
- confirmar por webhook o confirmación server‑side,
- almacenar respuesta técnica del proveedor,
- desacoplar lógica de negocio del proveedor concreto.

---

## 9.4 Stripe: lineamientos de implementación

Preparar integración con Stripe para:

- Checkout o Payment Intents,
- tarjeta,
- Bizum si la cuenta y el comercio lo permiten,
- entorno de pruebas,
- webhook firmado.

Variables `.env` mínimas:

- `STRIPE_SECRET_KEY`
- `STRIPE_PUBLIC_KEY`
- `STRIPE_WEBHOOK_SECRET`

Implementa o documenta claramente:

- cómo habilitar métodos de pago desde dashboard,
- cómo activar Bizum,
- cómo probar en sandbox,
- cómo usar webhooks,
- cómo mapear estados de Stripe a tus estados internos.

### Reglas importantes
- no almacenar datos de tarjeta,
- usar confirmación segura,
- soportar reintentos e idempotencia.

---

## 9.5 Redsys: lineamientos de implementación

Preparar integración con Redsys TPV Virtual para:

- tarjeta,
- Bizum,
- entorno sandbox,
- entorno producción,
- firma y validación,
- redirección segura.

Variables `.env` mínimas:

- `REDSYS_MERCHANT_CODE`
- `REDSYS_TERMINAL`
- `REDSYS_SECRET_KEY`
- `REDSYS_CURRENCY=978`
- `REDSYS_TRANSACTION_TYPE=0`
- `REDSYS_ENV=sandbox|production`

Debes documentar e implementar la arquitectura necesaria para:

- construir petición firmada,
- enviar al endpoint de Redsys,
- recibir notificación,
- validar firma,
- actualizar pedido/pago,
- soportar tarjeta y Bizum.

### Punto importante
La integración debe contemplar explícitamente que el pago Bizum vía Redsys requiere configuración del TPV virtual y del medio de pago por parte de la entidad bancaria.

---

## 9.6 README y documentación de pagos

En `README.md` y en `docs/payment-gateways.md` debes explicar:

- qué hace el modo mock,
- cómo cambiar a Stripe,
- cómo cambiar a Redsys,
- qué credenciales hacen falta,
- cómo se configura Bizum,
- qué endpoints y webhooks intervienen,
- cómo probar pagos,
- qué requisitos previos exige cada pasarela.

---

## 10. Sistema QR: arquitectura y seguridad

## 10.1 QR de activación pública

Implementar QR común que lleve a:

- home,
- landing de activación,
- registro/login.

No debe activar directamente el pasaporte.

---

## 10.2 Código único de activación

Implementa generación de códigos únicos:

- legibles para impresión,
- suficientemente robustos,
- no triviales,
- con posibilidad de hash/validación segura.

Ejemplo:
- `ESP-BAD-2026-8F3K-92QX`

---

## 10.3 QR de puntos oficiales

Al crear un `StampPoint`:

- generar token opaco,
- guardar hash,
- crear QR descargable,
- permitir regeneración.

URL sugerida:
- frontend `/scan?code=<public>&token=<opaque>`
- o backend `/api/v1/stamp/resolve/<opaque>`

Prefiere que el QR abra una pantalla controlada por frontend.

---

## 10.4 Requisitos de seguridad QR

- no confiar en IDs incrementales,
- no permitir sellar solo con `stamp_point_id`,
- usar tokens opacos,
- hashear cuando sea razonable,
- registrar duplicados,
- permitir revocación,
- preparar futura validación geográfica opcional.

---

## 11. API backend obligatoria

Implementa routers versionados `/api/v1`.

## 11.1 Públicos

```txt
GET    /api/v1/health
GET    /api/v1/public/site-config
GET    /api/v1/public/passport-types
GET    /api/v1/public/passport-types/{id}
POST   /api/v1/public/contact
POST   /api/v1/public/newsletter/subscribe

POST   /api/v1/auth/register
POST   /api/v1/auth/login
POST   /api/v1/auth/refresh

POST   /api/v1/orders
GET    /api/v1/orders/{order_id}
POST   /api/v1/payments/checkout-session
POST   /api/v1/payments/webhook/{provider}
```

## 11.2 Usuario autenticado

```txt
GET    /api/v1/me
PATCH  /api/v1/me

GET    /api/v1/me/passports
GET    /api/v1/me/passports/{passport_id}
POST   /api/v1/me/passports/activate
GET    /api/v1/me/passports/{passport_id}/stamps
POST   /api/v1/me/passports/{passport_id}/scan

GET    /api/v1/me/routes
GET    /api/v1/me/routes/{route_id}

GET    /api/v1/me/orders
GET    /api/v1/me/diplomas/{passport_id}
```

## 11.3 Admin

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

GET    /api/v1/admin/routes/{route_id}/segments
POST   /api/v1/admin/routes/{route_id}/segments
PATCH  /api/v1/admin/segments/{segment_id}
DELETE /api/v1/admin/segments/{segment_id}

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

GET    /api/v1/admin/exports/users.csv
GET    /api/v1/admin/exports/passports.csv
GET    /api/v1/admin/exports/orders.csv
GET    /api/v1/admin/exports/payments.csv
GET    /api/v1/admin/exports/stamps.csv
```

---

## 12. Filtros admin obligatorios

En listados admin implementar filtros por query params:

- route_id
- user_id
- passport_type_id
- status
- stamp_status
- payment_status
- date_from
- date_to
- province
- city
- search
- page
- page_size

---

## 13. Frontend: páginas y experiencia

## 13.1 Home pública

Debe incluir, como mínimo:

- hero visual de alto impacto,
- mensaje emocional slow travel,
- CTA “Comprar pasaporte”,
- CTA “Activar pasaporte”,
- sección “Cómo funciona”,
- sección “Elige tu pasaporte”,
- bloque de beneficios,
- bloque de contenido protegido,
- testimonios,
- CTA final,
- newsletter/contacto.

No copies el PDF literalmente, pero sí reproduce su lógica narrativa.

---

## 13.2 Catálogo de pasaportes

Pantalla pública con:

- cards de productos,
- precio,
- qué incluye,
- diferencias entre tipos,
- botón añadir al carrito,
- productos relacionados.

---

## 13.3 Activación

Pantalla muy clara, mobile‑first, con:

- explicación del proceso,
- login/registro,
- input de código único,
- mensajes de error,
- confirmación de activación.

---

## 13.4 Panel de usuario

Debe incluir:

- resumen de pasaportes activos,
- progreso global,
- rutas activas,
- último sello conseguido,
- CTA escanear QR,
- CTA ver mapa,
- CTA completar perfil.

---

## 13.5 Detalle de pasaporte

Debe incluir:

- datos del pasaporte,
- ruta asociada,
- mapa privado,
- puntos sellados/no sellados,
- timeline de sellos,
- porcentaje,
- botones de acciones,
- diploma si procede.

---

## 13.6 Pantalla de escaneo

Debe:

- abrir cámara,
- leer QR,
- permitir seleccionar pasaporte si hay varios,
- enviar al backend,
- mostrar resultado:
  - sello correcto,
  - duplicado,
  - QR inválido,
  - punto no pertenece a la ruta,
  - pasaporte inactivo.

---

## 13.7 Panel admin

Debe incluir:

- dashboard con KPIs,
- CRUD de rutas,
- CRUD de puntos,
- CRUD de tipos de pasaporte,
- listado de pasaportes con filtros,
- listado de pedidos,
- listado de pagos,
- mapas administrativos.

---

## 14. Diseño visual y branding UI

## 14.1 Dirección visual

Inspiración obligatoria:

- calma,
- elegancia,
- viaje lento,
- territorio,
- experiencia premium pero accesible,
- toque editorial,
- sensación de objeto coleccionable.

### No usar
- estética corporativa fría,
- look demasiado genérico de dashboard SaaS,
- colores agresivos neón,
- diseño infantil.

---

## 14.2 Paleta propuesta

Inspirada en el material visual entregado:

```css
:root {
  --bg-main: #0d2f21;
  --bg-panel: #123829;
  --bg-soft: #f4efe4;
  --bg-card: #f8f4ea;
  --text-dark: #1a2a22;
  --text-main: #f5f1e8;
  --text-muted: #d8d0c1;
  --border-soft: #d5c6a1;
  --gold-main: #b08b49;
  --gold-soft: #c8a76a;
  --green-accent: #2f8f71;
  --green-cta: #2da886;
  --danger: #b85f5f;
  --success: #5e9d6b;
}
```

Puedes ajustarla si justificas una mejora, pero mantén el espíritu:

- verde profundo,
- dorado cálido,
- crema / papel,
- contraste suficiente,
- elegancia editorial.

---

## 14.3 Componentes UI

Crear componentes reutilizables:

- `AppShell`
- `Navbar`
- `Footer`
- `SectionHero`
- `HowItWorksSection`
- `PassportCard`
- `RouteTeaserCard`
- `MetricCard`
- `StatusBadge`
- `ProgressBar`
- `Timeline`
- `MapPanel`
- `QrScannerPanel`
- `AdminDataTable`
- `EmptyState`
- `LoadingSkeleton`

---

## 14.4 Responsive design

Obligatorio:

- mobile‑first,
- navegación cómoda en móvil,
- scanner QR optimizado en móvil,
- cards apiladas en móvil,
- tablas admin con fallback responsive,
- mapas adaptados a viewport.

---

## 15. Mapas

## 15.1 Público

Mapa teaser o bloques promocionales, sin exponer la experiencia completa.

## 15.2 Usuario autenticado

Mapa privado con:

- segmentos de ruta,
- puntos sellados,
- puntos pendientes,
- información contextual.

## 15.3 Admin

Mapa con herramientas de gestión:

- localización de rutas,
- puntos de sellado,
- filtros por estado,
- edición básica o visualización avanzada.

---

## 16. Seguridad y cumplimiento

Implementa como mínimo:

- hash seguro de contraseñas,
- JWT con expiración,
- refresh tokens,
- control por roles,
- validación de inputs,
- logs de auditoría admin,
- rate limiting básico en login si es razonable,
- confirmación de pagos por webhook,
- no almacenar datos de tarjeta,
- gestión de consentimiento para newsletter,
- placeholders legales:
  - aviso legal,
  - privacidad,
  - cookies,
  - términos de compra.

Preparar el modelo para RGPD:
- exportación futura,
- anonimización futura,
- borrado lógico o físico según política.

---

## 17. Seeds iniciales

Crear seed inicial con:

### Usuarios
- `admin@example.com` / `Admin1234!`
- `user@example.com` / `User1234!`

### Rutas demo
Crear al menos una ruta demo principal y dejar preparado el seed para varias.

Ejemplo:
- Ruta Slow Camper Badajoz Demo
- Ruta Patrimonio y Naturaleza Demo
- Ruta Gastronómica Demo

### Tipos de pasaporte demo
Incluir al menos los 6 tipos principales con los precios benchmark.

### Puntos demo
Entre 8 y 12 puntos con coordenadas demo plausibles o claramente indicadas como demo.

### Pasaporte demo
Un pasaporte activo para el usuario demo.

---

## 18. Tests obligatorios

## 18.1 Backend
Crear tests con pytest para:

- registro/login,
- refresh token,
- creación de pedido,
- pago mock correcto,
- activación de pasaporte,
- sellado válido,
- sellado duplicado,
- sellado de punto de otra ruta,
- permisos admin.

## 18.2 Frontend
Como mínimo:

- render Home,
- render catálogo,
- flujo básico login mock,
- render panel de usuario.

---

## 19. README.md obligatorio

Además del README normal, debe incluir explícitamente:

### 19.1 Instalación backend
- crear entorno,
- instalar dependencias,
- variables `.env`,
- migraciones,
- seed,
- arranque local.

### 19.2 Instalación frontend
- instalar node modules,
- levantar Vite,
- variables frontend,
- URL API.

### 19.3 Librerías QR
Documentar librerías usadas para:
- generar QR,
- leer QR desde navegador móvil,
- descargar QR de punto desde admin.

### 19.4 Pagos
Explicar:
- modo mock,
- Stripe,
- Redsys,
- Bizum,
- sandbox,
- webhooks.

### 19.5 Docker
Si implementas Docker Compose:
- cómo levantar todo,
- cómo pararlo,
- puertos,
- persistencia.

### 19.6 Usuarios demo
Lista de credenciales demo.

### 19.7 Próximos pasos
Qué falta para producción real:
- dominio,
- HTTPS,
- correo transaccional,
- almacenamiento de imágenes,
- TPV real,
- logística/envíos,
- observabilidad.

---

## 20. Documentación adicional obligatoria

Crear:

### `docs/payment-gateways.md`
Con detalles de:
- modo mock,
- Stripe,
- Redsys,
- Bizum,
- pruebas,
- webhooks,
- mapeo de estados.

### `docs/qr-and-activation.md`
Con:
- QR público común,
- código único de activación,
- QR de sellado,
- validaciones,
- seguridad.

### `docs/data-model.md`
Con explicación del modelo de datos y relaciones.

### `docs/api-overview.md`
Con endpoints, payloads principales y reglas.

### `docs/admin-guide.md`
Con explicación operativa del panel admin.

---

## 21. Fases de implementación

Construye en este orden:

### Fase 1
- estructura repo,
- configuración,
- base de datos,
- modelos,
- migraciones,
- seeds.

### Fase 2
- auth,
- roles,
- guards frontend.

### Fase 3
- landing pública,
- catálogo,
- carrito,
- checkout mock.

### Fase 4
- activación de pasaporte,
- panel de usuario,
- detalle de pasaporte.

### Fase 5
- QR de puntos,
- sellado,
- progreso,
- diploma.

### Fase 6
- panel admin completo.

### Fase 7
- Stripe/Redsys preparados,
- docs,
- tests,
- hardening.

---

## 22. Criterios de aceptación

La solución se considera válida si:

- backend arranca sin errores,
- frontend arranca sin errores,
- hay migraciones funcionales,
- el seed crea datos demo,
- se puede registrar un usuario,
- se puede iniciar sesión,
- se puede comprar en modo mock,
- se crea un pedido,
- se crean pasaportes,
- se puede activar un pasaporte,
- se puede escanear/simular un sello,
- se actualiza el progreso,
- admin puede crear rutas y puntos,
- admin puede ver pasaportes y pagos,
- la app es responsive,
- el README permite reproducir todo sin ambigüedad.

---

## 23. Restricciones

- No copies contenidos protegidos.
- No metas credenciales reales.
- No hardcodees lógica de pagos en endpoints.
- No expongas QR inseguros.
- No construyas una app solo visual: debe haber persistencia real.
- No mezcles comprador y dueño de pasaporte como si fueran siempre la misma persona.
- No hagas dependiente la arquitectura de SQLite.
- No omitas documentación.

---

## 24. Decisiones técnicas preferidas si hay ambigüedad

- ORM: SQLAlchemy 2.x
- Validación: Pydantic
- Formularios frontend: React Hook Form + Zod
- Estado ligero: Zustand
- Mapas: React Leaflet
- Gráficos admin: Recharts
- HTTP frontend: Axios o wrapper fetch typed
- Estilos: CSS modular + variables o Tailwind si la arquitectura queda limpia y documentada
- Pago desarrollo: MockPaymentProvider
- Pago real recomendado:
  - Stripe para velocidad de implementación
  - Redsys para alineación bancaria española y Bizum local

---

## 25. Qué debes explicar al terminar

Cuando acabes la implementación, debes devolver un resumen con:

1. qué has implementado,
2. cómo arrancar backend,
3. cómo arrancar frontend,
4. cómo ejecutar migraciones,
5. cómo cargar seed,
6. cómo probar compra mock,
7. cómo activar un pasaporte,
8. cómo probar un sello QR,
9. cómo activar Stripe,
10. cómo activar Redsys/Bizum,
11. qué falta para producción.

---

## 26. Observaciones de producto que debes respetar

- El proyecto está orientado a **turismo en camper y furgonetas camper**.
- La experiencia debe sentirse cercana, slow, auténtica y local.
- El sistema debe ser **multi‑ruta desde el primer diseño**, aunque el MVP arranque con pocas rutas.
- El administrador debe poder crecer sin tocar código:
  - nuevas rutas,
  - nuevos puntos,
  - nuevos tipos de pasaporte,
  - nuevas configuraciones de monetización.
- El modelo debe soportar que en el futuro existan:
  - distintas regiones,
  - partners locales,
  - promociones,
  - más capas premium,
  - más productos físicos y digitales.

---

## 27. Instrucción final de calidad

No hagas una simple maqueta.  
Construye una **base de producto real**, con **arquitectura limpia**, **modelo de negocio explícito**, **datos persistentes**, **paneles funcionales**, **QR robusto**, **pagos desacoplados** y **documentación suficiente para que un equipo continúe el desarrollo sin depender de ti**.
