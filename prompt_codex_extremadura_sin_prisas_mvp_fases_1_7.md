# Prompt ejecutable para CODEX — MVP cerrado en 7 fases de la plataforma “Extremadura sin prisas”

## 0. Instrucción principal

Actúa como **arquitecto principal**, **lead full-stack engineer**, **product engineer**, **diseñador de datos** y **redactor técnico**.

No generes una demo superficial ni una landing estática. Debes construir un **MVP real, cerrado, coherente, ejecutable y verificable** de una plataforma web full-stack para rutas camper con:

- compra de pasaportes físicos,
- activación digital del pasaporte,
- acceso privado a rutas y mapas,
- sellado de pasaporte mediante QR en puntos oficiales,
- administración completa mínima,
- arquitectura preparada para crecer.

El proyecto debe desarrollarse en **7 fases secuenciales obligatorias**. No avances a la siguiente fase hasta dejar la fase actual **cerrada, arrancable y comprobable**.

Tu prioridad es entregar un MVP sólido, no intentar resolver todo el producto final desde el principio.

---

## 1. Objetivo de negocio del MVP

Construir una plataforma para turismo slow-travel de caravanas y especialmente furgonetas camper donde:

1. un visitante no registrado puede conocer el proyecto y comprar pasaportes;
2. el sistema genera pedidos de pasaportes físicos por ruta;
3. cada pasaporte físico tiene un **código único**;
4. el portador del pasaporte puede registrarse y activarlo;
5. una vez activado, accede a su área privada;
6. en su área privada puede ver la ruta, mapa, puntos de sellado y progreso;
7. puede escanear los QR de los puntos oficiales y sellar su pasaporte;
8. el administrador puede crear rutas, puntos de sellado, tipos de pasaporte, pasaportes y pedidos.

El MVP debe estar preparado para evolucionar después hacia:

- pagos reales con tarjeta y Bizum,
- diploma descargable,
- descuentos y promociones,
- rutas múltiples avanzadas,
- marketplace/merchandising,
- panel partner,
- logística avanzada,
- analítica de negocio más profunda.

Pero esas ampliaciones **no deben bloquear** el cierre del MVP.

---

## 2. Referencias de producto que debes reinterpretar

### 2.1 Patrón funcional tipo RUTA N-VI

Toma como referencia conceptual el patrón observado en RUTA N-VI:

- el pasaporte es el producto principal;
- el pasaporte da acceso a una experiencia slow-travel;
- el pasaporte habilita mapas, puntos oficiales, descuentos y recuerdo físico;
- existe un flujo claro de compra → recepción → activación → uso → sellado. 

Además, en su tienda pública aparecen actualmente, como referencia de catálogo inicial, estos productos/precios base:

- Pasaporte RUTA N-VI: **9,95 €**;
- Pasaporte Pareja: **18,90 €**;
- Pasaporte Mascota: **desde 16,90 €**;
- Super Pasaporte: **17,90 €**;
- Welcome Pack TOP: **29,95 €**;
- Welcome Pack Turbo: **29,95 €**;
- MEGA Pack: **59,95 €**.

No copies marca, copy, assets ni estructura exacta. Solo reutiliza el patrón funcional y el benchmark de monetización.

### 2.2 Patrón funcional tipo Ruta 181

Toma como referencia conceptual el patrón observado en Ruta 181:

- existencia de tienda con productos físicos y digitales;
- pasaportes y accesos con código QR;
- varias rutas/colecciones;
- separación entre contenido público, tienda y acceso privado;
- comercialización de productos complementarios;
- lógica de membresía/acceso.

Como benchmark visible, Ruta 181 muestra actualmente:

- Pasaportes de la Ruta 181: **desde 20,00 €**;
- Membresía de acceso: **desde 8,00 €**;
- Cuaderno de Viaje Ecológico: **19,00 €**;
- Cuaderno de colección: **30,00 €**;
- Código QR SOS: **14,00 €**.

De nuevo: **reinterpretar**, no replicar.

### 2.3 Referencia visual del PDF “Extremadura sin prisas”

Usa el PDF aportado como guía visual y narrativa del frontend:

- hero emocional;
- storytelling de viaje lento;
- bloque “Cómo funciona”; 
- bloque “Elige tu pasaporte”;
- bloque de rutas/experiencias;
- bloque de mapa protegido;
- flujo de activación;
- testimonios;
- CTA final;
- tono elegante, calmado, experiencial y editorial.

### 2.4 Referencia del pasaporte físico

Usa el PDF del pasaporte como guía conceptual del objeto físico:

- sensación de producto editorial coleccionable;
- campos de propietario y fecha;
- identidad visual seria y cuidada;
- idea de pasaporte físico que activa la experiencia digital.

---

## 3. Stack tecnológico obligatorio

### Frontend

- React
- Vite
- TypeScript
- React Router
- Zustand o Context API ligero
- React Hook Form + Zod
- React Leaflet
- librería de lectura QR compatible con web móvil
- CSS modular o CSS variables, evitando dependencias pesadas innecesarias

### Backend

- Python 3.12+
- FastAPI
- SQLAlchemy 2.x
- Alembic
- Pydantic
- JWT con access + refresh tokens
- passlib/bcrypt o equivalente para contraseñas
- arquitectura por capas: api / services / repositories / models / schemas

### Base de datos

- SQLite por defecto en desarrollo
- preparada por configuración para PostgreSQL en el futuro

### Entorno

- `.env` y `.env.example`
- Docker opcional, pero recomendable
- `docker-compose.yml` opcional, solo si no bloquea el desarrollo

### Pagos

- proveedor `mock` obligatorio en el MVP
- proveedores reales solo dejados preparados como adaptadores
- no bloquear el MVP por integrar pagos reales desde el primer momento

---

## 4. Principios de implementación obligatorios

1. **No saltes fases.**
2. **No mezcles demasiadas features en una sola fase.**
3. **Todo debe quedar arrancable al final de cada fase.**
4. **Cada fase debe incluir criterio de aceptación y comprobación manual.**
5. **El código debe quedar modular y limpio desde el inicio.**
6. **No pospongas arquitectura básica crítica.**
7. **No intentes cerrar pagos reales, diploma PDF o marketplace completo antes de tener el núcleo estable.**
8. **No copies el contenido literal de las webs de referencia.**
9. **Usa seeds y mocks suficientes para probar sin depender de terceros.**
10. **Después de cada fase, actualiza README y deja comandos verificables.**

---

## 5. Alcance exacto del MVP cerrado

El MVP cerrado debe incluir solo esto como alcance obligatorio:

### Público

- home pública;
- explicación de cómo funciona;
- listado teaser de rutas publicadas;
- detalle público resumido de ruta;
- catálogo de tipos de pasaporte;
- carrito y checkout mock;
- registro/login.

### Usuario autenticado

- activación de pasaporte con código único;
- panel de usuario;
- listado de pasaportes;
- detalle de pasaporte;
- mapa privado de su ruta;
- puntos de sellado visibles;
- escaneo QR;
- progreso de sellado.

### Administrador

- dashboard mínimo;
- CRUD de rutas;
- CRUD de puntos de sellado;
- CRUD de tipos de pasaporte;
- listado/edición básica de usuarios;
- listado/edición básica de pasaportes;
- listado de pedidos;
- generación/regeneración de QR de puntos de sellado.

### Datos y lógica de negocio

- multi-ruta;
- compra separada de activación;
- diferencia entre comprador y portador final del pasaporte;
- pasaporte único por ruta;
- pedidos independientes de usuario final;
- sellado único por punto;
- control de estados del pasaporte.

---

## 6. Fuera de alcance del MVP cerrado

No debes implementar todavía, salvo dejarlo preparado:

- pagos reales con Stripe en producción;
- pagos reales con Redsys/Bizum en producción;
- diploma PDF final;
- promociones complejas;
- panel partner;
- newsletter real;
- notificaciones email/SMS reales;
- logística/envíos reales;
- marketplace completo de merchandising;
- geolocalización antifraude avanzada;
- internacionalización completa;
- multi-idioma;
- búsquedas complejas avanzadas;
- informes financieros avanzados;
- devoluciones automáticas;
- facturación fiscal completa.

Si alguna de estas piezas aparece, debe ser solo como **estructura preparada** o TODO claramente documentado, nunca como dependencia bloqueante.

---

## 7. Reglas de negocio obligatorias del dominio

### 7.1 El pasaporte no es solo un cuaderno

Debes modelar el pasaporte como:

- producto físico vendible;
- unidad única por ruta;
- llave de activación;
- acceso a contenido privado;
- contenedor de progreso;
- soporte del sellado;
- base futura para recompensas/diploma.

### 7.2 Separación entre QR común y código único

Implementa **dos conceptos distintos**:

#### A. QR común del pasaporte

- es igual para todos los pasaportes;
- redirige al HOME o landing de activación;
- solo guía al usuario al sitio.

#### B. Código único de activación del pasaporte

- es único por pasaporte;
- se imprime en el pasaporte físico;
- se guarda en la base de datos;
- se usa para registrar/activar el pasaporte.

### 7.3 QR de sellado por punto oficial

Cada punto oficial de cada ruta debe tener un QR único de sellado.

Ese QR:

- se genera automáticamente al crear el punto;
- no activa pasaportes;
- solo sirve para registrar el sello en el pasaporte activo del usuario.

### 7.4 Diferencia entre comprador y portador

Implementa siempre estas dos entidades separadas:

- **comprador**: quien realiza el pedido;
- **portador/usuario final**: quien activa el pasaporte.

Un pedido puede crear uno o varios pasaportes, y esos pasaportes pueden ser activados más tarde por otras personas.

### 7.5 Visibilidad restringida de rutas

- usuarios no registrados: solo contenido teaser/promocional;
- usuarios registrados con pasaporte activo: acceso al contenido operativo de sus rutas;
- admin: acceso total.

### 7.6 Estados del pasaporte

Maneja al menos dos dimensiones:

#### Estado operativo
- `inactive`
- `active`
- `completed`
- `cancelled`

#### Estado de sellado
- `unstamped`
- `partially_stamped`
- `fully_stamped`

---

## 8. Modelo de datos mínimo del MVP

Implementa al menos las siguientes entidades.

### 8.1 User

Campos mínimos:

- id
- email (unique)
- password_hash
- full_name
- phone
- role (`user`, `admin`)
- is_active
- created_at
- updated_at

### 8.2 Route

Campos mínimos:

- id
- slug (unique)
- title
- subtitle
- description_short
- description_long
- province_scope
- distance_km
- estimated_days_min
- estimated_days_max
- hero_image_url
- status (`draft`, `published`, `archived`)
- public_teaser_enabled
- private_map_enabled
- min_stamps_to_complete
- created_at
- updated_at

### 8.3 StampPoint

Campos mínimos:

- id
- route_id
- name
- slug
- description_public
- description_private
- category
- address
- city
- province
- lat
- lng
- is_active
- is_public_preview
- qr_public_code
- qr_secret_hash
- created_at
- updated_at

### 8.4 PassportType

Campos mínimos:

- id
- route_id
- code
- name
- description
- price_cents
- currency
- max_holders
- holder_type (`individual`, `pareja`, `mascota`, `premium`, `pack`)
- is_physical
- is_active
- sort_order

### 8.5 Order

Campos mínimos:

- id
- buyer_user_id (nullable)
- buyer_email
- buyer_name
- buyer_phone
- status (`pending`, `paid`, `failed`, `cancelled`)
- total_cents
- currency
- created_at
- updated_at

### 8.6 OrderItem

Campos mínimos:

- id
- order_id
- route_id
- passport_type_id
- quantity
- unit_price_cents
- total_cents

### 8.7 Passport

Campos mínimos:

- id
- route_id
- passport_type_id
- order_id
- activated_by_user_id (nullable)
- serial_number (unique)
- activation_code (unique, no exponer plano si decides hashearlo)
- owner_display_name (nullable)
- start_date (nullable)
- operational_status
- stamp_status
- activated_at (nullable)
- completed_at (nullable)
- created_at
- updated_at

### 8.8 Stamp

Campos mínimos:

- id
- passport_id
- stamp_point_id
- user_id
- stamped_at
- validation_status (`valid`, `duplicate`, `revoked`, `suspicious`)
- scan_source (`qr_scan`, `admin_manual`)
- created_at

### 8.9 Payment

Para el MVP bastará con estructura mínima:

- id
- order_id
- provider (`mock`, `stripe`, `redsys`)
- method (`card`, `bizum`)
- provider_payment_id
- amount_cents
- currency
- status (`pending`, `paid`, `failed`, `cancelled`)
- raw_response_json
- created_at
- updated_at

### 8.10 AuditLog

Mínimo:

- id
- actor_user_id
- action
- entity_type
- entity_id
- metadata_json
- created_at

---

## 9. Estructura mínima del repositorio

Usa una estructura similar a esta:

```txt
extremadura-sin-prisas/
  README.md
  .env.example
  backend/
    pyproject.toml
    alembic.ini
    app/
      main.py
      core/
      api/
        v1/
      models/
      schemas/
      services/
      repositories/
      security/
      utils/
      tests/
      seed.py
  frontend/
    package.json
    vite.config.ts
    src/
      main.tsx
      App.tsx
      api/
      components/
      pages/
        public/
        user/
        admin/
      routes/
      store/
      types/
      styles/
```

---

## 10. Contrato de ejecución de fases

Debes trabajar en **7 fases cerradas**.

Cada fase debe incluir internamente:

1. objetivo;
2. alcance;
3. tareas backend;
4. tareas frontend;
5. cambios de base de datos;
6. endpoints incluidos;
7. pruebas mínimas;
8. criterios de aceptación;
9. pasos manuales para validarla;
10. actualización del README.

Cuando termines una fase:

- deja el proyecto arrancando;
- evita código roto o archivos huérfanos;
- corrige imports y dependencias;
- agrega seed o datos de prueba si hacen falta;
- escribe notas breves de lo implementado.

---

# FASE 1 — Base técnica, arquitectura y arranque del proyecto

## Objetivo

Dejar lista la base del proyecto full-stack, con estructura limpia, configuración por entorno, backend arrancable, frontend arrancable y persistencia mínima.

## Alcance

### Backend
- FastAPI configurado.
- SQLAlchemy configurado.
- Alembic configurado.
- SQLite funcionando.
- endpoint `/api/v1/health`.
- modelo User mínimo y Route mínimo.
- seed inicial.

### Frontend
- Vite + React + TypeScript.
- routing básico.
- layout base.
- HomePage provisional funcional.
- cliente API base.

## No hacer todavía

- auth completa;
- pagos;
- QR;
- panel usuario;
- panel admin complejo.

## Entregables mínimos de la fase

### Backend

- `GET /api/v1/health`
- conexión a base de datos
- migración inicial
- seed mínimo con:
  - admin demo
  - ruta demo publicada

### Frontend

- app arranca
- home pública con branding provisional
- página “Rutas” provisional consumiendo backend

## Criterios de aceptación

- backend levanta sin errores;
- frontend levanta sin errores;
- la home se renderiza;
- el healthcheck responde OK;
- una ruta demo se puede consultar desde frontend.

## Prueba manual

1. arrancar backend;
2. abrir `/api/v1/health`;
3. arrancar frontend;
4. comprobar Home;
5. comprobar listado de rutas demo.

---

# FASE 2 — Autenticación, autorización y sesión

## Objetivo

Disponer de registro, login, refresh token, protección de rutas y roles mínimos `user` y `admin`.

## Alcance

### Backend
- registro de usuario;
- login con JWT;
- refresh token;
- endpoint `GET /api/v1/me`;
- permisos básicos;
- password hashing.

### Frontend
- páginas Login y Register;
- store de sesión;
- guards de rutas;
- persistencia de sesión;
- logout.

## Endpoints mínimos

```txt
POST /api/v1/auth/register
POST /api/v1/auth/login
POST /api/v1/auth/refresh
GET  /api/v1/me
```

## Criterios de aceptación

- un usuario puede registrarse;
- un usuario puede iniciar sesión;
- un admin seed puede iniciar sesión;
- una ruta protegida no autenticada redirige al login;
- el frontend muestra el estado de sesión.

## Prueba manual

1. registrar usuario nuevo;
2. loguear usuario;
3. recargar página y mantener sesión;
4. cerrar sesión;
5. entrar con admin demo.

---

# FASE 3 — Catálogo público, rutas teaser y diseño inicial de producto

## Objetivo

Cerrar la parte pública mínima del producto: landing, “cómo funciona”, rutas teaser y catálogo de pasaportes por ruta.

## Alcance

### Backend
- listar rutas publicadas;
- obtener detalle público de ruta;
- listar tipos de pasaporte por ruta;
- exponer solo información teaser, no el contenido privado completo.

### Frontend
- HomePage con secciones:
  - hero,
  - cómo funciona,
  - elige tu pasaporte,
  - rutas destacadas,
  - CTA final;
- RoutesPage;
- RouteDetailPage pública;
- PassportCatalogPage.

### Diseño

Tomar inspiración del PDF aportado:

- hero emocional;
- cards elegantes;
- paleta calmada;
- sensación editorial;
- storytelling de viaje sin prisas.

## Endpoints mínimos

```txt
GET /api/v1/routes
GET /api/v1/routes/{slug}
GET /api/v1/routes/{slug}/passport-types
GET /api/v1/routes/{slug}/stamp-points/public
```

## Seed obligatorio de catálogo inicial

Crear al menos una ruta demo con tipos de pasaporte benchmarkados:

- Pasaporte Individual
- Pasaporte Pareja
- Pasaporte Mascota
- Super Pasaporte
- Welcome Pack TOP
- Welcome Pack Turbo

Con precios inspirados en los benchmarks públicos actuales, pero con naming y copy propios.

## Criterios de aceptación

- el visitante puede entender el producto sin registrarse;
- puede ver rutas teaser;
- puede ver catálogo de pasaportes;
- no puede ver el mapa privado completo ni puntos privados completos.

## Prueba manual

1. abrir home;
2. navegar a rutas;
3. abrir detalle de ruta;
4. abrir catálogo de pasaportes;
5. verificar que el contenido privado no está expuesto.

---

# FASE 4 — Panel administrador mínimo y CRUD de negocio principal

## Objetivo

Cerrar el panel admin mínimo para gestionar el núcleo del negocio.

## Alcance

### Backend
CRUD admin de:

- usuarios;
- rutas;
- puntos de sellado;
- tipos de pasaporte;
- pasaportes.

### Frontend
Páginas admin mínimas:

- AdminDashboardPage básica;
- AdminUsersPage;
- AdminRoutesPage;
- AdminRouteEditorPage;
- AdminStampPointsPage o editor embebido por ruta;
- AdminPassportTypesPage;
- AdminPassportsPage.

### Requisito funcional importante

Cuando el admin cree un `StampPoint`, el sistema debe:

1. generar token seguro;
2. generar `qr_public_code`;
3. guardar hash/tokens según diseño;
4. dejar disponible la representación QR para visualización o descarga.

## Endpoints mínimos

```txt
GET    /api/v1/admin/dashboard/summary
GET    /api/v1/admin/users
PATCH  /api/v1/admin/users/{user_id}
GET    /api/v1/admin/routes
POST   /api/v1/admin/routes
GET    /api/v1/admin/routes/{route_id}
PATCH  /api/v1/admin/routes/{route_id}
GET    /api/v1/admin/routes/{route_id}/stamp-points
POST   /api/v1/admin/routes/{route_id}/stamp-points
PATCH  /api/v1/admin/stamp-points/{stamp_point_id}
POST   /api/v1/admin/stamp-points/{stamp_point_id}/regenerate-qr
GET    /api/v1/admin/passport-types
POST   /api/v1/admin/passport-types
PATCH  /api/v1/admin/passport-types/{passport_type_id}
GET    /api/v1/admin/passports
PATCH  /api/v1/admin/passports/{passport_id}
```

## Criterios de aceptación

- admin puede crear una ruta;
- admin puede editar una ruta;
- admin puede crear puntos de sellado;
- admin puede regenerar QR;
- admin puede crear tipos de pasaporte;
- admin puede ver listado de pasaportes.

## Prueba manual

1. login como admin;
2. crear ruta nueva;
3. crear 2–3 puntos de sellado;
4. comprobar QR generado;
5. crear tipos de pasaporte;
6. visualizar pasaportes desde admin.

---

# FASE 5 — Carrito, pedidos, checkout mock y generación de pasaportes

## Objetivo

Cerrar el flujo mínimo de monetización del MVP usando un proveedor de pagos **mock** totalmente funcional.

## Alcance

### Backend
- carrito sencillo gestionado en frontend o backend ligero;
- creación de pedido;
- creación de items;
- checkout con `MockPaymentProvider`;
- confirmación de pago mock;
- creación de pasaportes inactivos asociados al pedido;
- seriales únicos;
- códigos únicos de activación.

### Frontend
- CheckoutPage;
- resumen del pedido;
- formulario del comprador;
- selector de método de pago visible (`card`, `bizum`) aunque ambos usen mock en MVP;
- página de resultado de pago.

### Regla importante

Aunque el método de pago se muestre como tarjeta o Bizum, en el MVP ambos pueden resolverse internamente a través del proveedor mock. La diferencia visual/funcional solo debe servir para:

- probar el flujo;
- dejar preparada la abstracción futura.

## Endpoints mínimos

```txt
POST /api/v1/orders
POST /api/v1/payments/checkout-session
POST /api/v1/payments/mock/confirm
GET  /api/v1/me/orders
```

## Lógica obligatoria

Al pagar correctamente:

1. `Order.status = paid`
2. crear `Payment.status = paid`
3. generar uno o varios `Passport` según cantidad
4. dejar cada pasaporte en `inactive`
5. asignar serial único y código de activación único

## Criterios de aceptación

- un visitante puede completar una compra mock;
- se crea pedido;
- se crean pasaportes;
- los pasaportes quedan inactivos hasta activación;
- el comprador puede consultar su pedido si tiene sesión.

## Prueba manual

1. elegir ruta y tipo de pasaporte;
2. pasar a checkout;
3. completar pago mock con éxito;
4. comprobar pedido en base de datos;
5. comprobar pasaporte generado.

---

# FASE 6 — Activación de pasaporte y área privada del usuario

## Objetivo

Cerrar el flujo clave del producto: el pasaporte físico comprado se activa y desbloquea la experiencia privada.

## Alcance

### Backend
- endpoint de activación de pasaporte;
- asociación del pasaporte al usuario autenticado;
- actualización de estado a `active`;
- endpoints privados para listar pasaportes y detalle;
- endpoint de ruta privada del usuario.

### Frontend
- UserDashboardPage;
- MyPassportsPage;
- PassportDetailPage;
- formulario de activación de pasaporte;
- mapa privado de la ruta;
- puntos visibles con estado sellado/no sellado.

### Regla de negocio

El usuario llega al sitio por el QR común del pasaporte o directamente por la web. Después:

1. se registra o inicia sesión;
2. introduce el código único del pasaporte;
3. activa el pasaporte;
4. desbloquea su ruta y su panel.

## Endpoints mínimos

```txt
POST /api/v1/me/passports/activate
GET  /api/v1/me/passports
GET  /api/v1/me/passports/{passport_id}
GET  /api/v1/me/routes
GET  /api/v1/me/orders
```

## Criterios de aceptación

- un usuario autenticado puede activar un pasaporte válido;
- el pasaporte queda asociado a su cuenta;
- el estado cambia a `active`;
- puede entrar a su panel y ver su ruta privada;
- un código inválido devuelve error claro.

## Prueba manual

1. comprar o usar seed de pasaporte generado;
2. registrar usuario final;
3. introducir código único;
4. activar pasaporte;
5. abrir detalle del pasaporte y comprobar mapa privado.

---

# FASE 7 — Sellado por QR, progreso y cierre operativo del MVP

## Objetivo

Cerrar el núcleo diferenciador del producto: sellado real de pasaporte por QR en puntos oficiales y progreso del viaje.

## Alcance

### Backend
- resolver validación del QR de punto;
- registrar sellos;
- evitar duplicados válidos por punto;
- recalcular progreso;
- actualizar `stamp_status`;
- marcar `completed` si alcanza el mínimo configurado.

### Frontend
- ScanStampPage;
- cámara o input de prueba;
- confirmación de sello;
- mensajes de estado (`success`, `duplicate`, `invalid`);
- timeline/listado de sellos;
- barra de progreso.

### Admin
- ver sellos por pasaporte;
- sello manual justificado opcional mínimo;
- resumen KPI básico:
  - usuarios,
  - rutas,
  - pedidos pagados,
  - pasaportes activos,
  - sellos realizados.

## Endpoints mínimos

```txt
POST /api/v1/me/passports/{passport_id}/scan
GET  /api/v1/me/passports/{passport_id}/stamps
POST /api/v1/admin/passports/{passport_id}/manual-stamp
GET  /api/v1/admin/dashboard/summary
GET  /api/v1/admin/orders
```

## Validaciones obligatorias del backend

Antes de crear un sello debes comprobar:

- usuario autenticado;
- pasaporte activo;
- QR válido;
- punto de sellado activo;
- el punto pertenece a la misma ruta del pasaporte;
- no existe ya sello válido para ese punto y ese pasaporte.

## Reglas de resultado

- primer escaneo válido: crear sello y actualizar progreso;
- segundo escaneo del mismo punto: responder `duplicate` sin sumar progreso;
- QR inválido: error controlado;
- si alcanza mínimo de sellos: `stamp_status = fully_stamped` y opcionalmente `operational_status = completed`.

## Criterios de aceptación

- el usuario puede escanear un QR válido;
- el sello se registra;
- el progreso se actualiza;
- un escaneo duplicado no suma dos veces;
- el admin ve el resumen actualizado;
- el MVP queda funcional de extremo a extremo.

## Prueba manual

1. login con usuario que tenga pasaporte activo;
2. abrir scanner;
3. escanear QR de un punto;
4. comprobar sello;
5. repetir QR y comprobar duplicado;
6. revisar progreso;
7. revisar admin dashboard.

---

## 11. Endpoints finales esperados al cerrar la fase 7

### Públicos

```txt
GET    /api/v1/health
GET    /api/v1/routes
GET    /api/v1/routes/{slug}
GET    /api/v1/routes/{slug}/passport-types
GET    /api/v1/routes/{slug}/stamp-points/public
POST   /api/v1/auth/register
POST   /api/v1/auth/login
POST   /api/v1/auth/refresh
POST   /api/v1/orders
POST   /api/v1/payments/checkout-session
POST   /api/v1/payments/mock/confirm
```

### Usuario autenticado

```txt
GET    /api/v1/me
GET    /api/v1/me/orders
GET    /api/v1/me/routes
GET    /api/v1/me/passports
GET    /api/v1/me/passports/{passport_id}
POST   /api/v1/me/passports/activate
POST   /api/v1/me/passports/{passport_id}/scan
GET    /api/v1/me/passports/{passport_id}/stamps
```

### Admin

```txt
GET    /api/v1/admin/dashboard/summary
GET    /api/v1/admin/users
PATCH  /api/v1/admin/users/{user_id}
GET    /api/v1/admin/routes
POST   /api/v1/admin/routes
GET    /api/v1/admin/routes/{route_id}
PATCH  /api/v1/admin/routes/{route_id}
GET    /api/v1/admin/routes/{route_id}/stamp-points
POST   /api/v1/admin/routes/{route_id}/stamp-points
PATCH  /api/v1/admin/stamp-points/{stamp_point_id}
POST   /api/v1/admin/stamp-points/{stamp_point_id}/regenerate-qr
GET    /api/v1/admin/passport-types
POST   /api/v1/admin/passport-types
PATCH  /api/v1/admin/passport-types/{passport_type_id}
GET    /api/v1/admin/passports
PATCH  /api/v1/admin/passports/{passport_id}
POST   /api/v1/admin/passports/{passport_id}/manual-stamp
GET    /api/v1/admin/orders
```

---

## 12. Seed obligatorio del MVP

Debes crear un seed verificable con:

### Usuarios
- `admin@example.com` / `Admin1234!`
- `user@example.com` / `User1234!`

### Rutas
Al menos una ruta demo publicada basada en el concepto “Extremadura sin prisas”.

### Puntos de sellado
Entre 6 y 10 puntos demo con coordenadas válidas o claramente marcadas como demo.

### Tipos de pasaporte demo
- Individual
- Pareja
- Mascota
- Super
- Welcome Pack TOP
- Welcome Pack Turbo

### Pedidos / pasaportes demo
- al menos 1 pedido pagado mock;
- al menos 1 pasaporte inactivo;
- al menos 1 pasaporte activo;
- al menos 1 sello demo opcional.

---

## 13. Diseño visual del MVP

No clones ninguna web. Reinterpreta el estilo del PDF subido.

### Identidad visual sugerida

- base clara o marfil suave para secciones editoriales públicas;
- verdes profundos y verdes suaves como acento;
- detalles oro/mostaza muy contenidos para resaltar “pasaporte” y “experiencia”; 
- tipografía elegante para títulos y muy legible para el cuerpo;
- sensación de viaje pausado, naturaleza, patrimonio y objeto físico premium.

### Piezas visuales mínimas

- HeroSection
- HowItWorksSection
- PassportTypesSection
- RoutesTeaserSection
- ProtectedMapTeaserSection
- TestimonialsSection
- FinalCTASection
- RouteCard
- PassportCard
- StatusBadge
- ProgressBar
- AdminTable
- MapPanel
- QrScannerPanel

### Responsive

Debe funcionar al menos en:

- móvil;
- tablet;
- desktop.

El scanner QR debe priorizar experiencia móvil.

---

## 14. Seguridad mínima obligatoria

Implementa como mínimo:

- contraseñas hasheadas;
- JWT con expiración;
- control de permisos por rol;
- validación de input;
- CORS configurable por entorno;
- no exponer tokens QR sensibles en respuestas innecesarias;
- logs básicos de auditoría;
- protección razonable contra duplicado de sellos;
- no almacenar datos de tarjeta.

---

## 15. Pagos: instrucciones precisas para el MVP y la evolución

## 15.1 En el MVP

Implementa un `MockPaymentProvider` completamente funcional.

Debe permitir:

- pago correcto;
- pago fallido;
- cancelación;
- selección visual de método `card` o `bizum` aunque ambos usen mock.

## 15.2 Preparación para Stripe

Deja una interfaz/adaptador preparado para Stripe. Documenta en README y en `docs/payment-gateways.md` que Stripe soporta Bizum como método de pago en España, donde el comprador paga con el número de móvil vinculado a Bizum y confirma en su app bancaria.

Variables esperadas:

- `STRIPE_SECRET_KEY`
- `STRIPE_PUBLIC_KEY`
- `STRIPE_WEBHOOK_SECRET`

No implementes a fondo la integración real si eso retrasa el MVP, pero sí deja:

- interfaz del provider;
- archivos de estructura;
- notas claras de integración;
- flujo por webhook previsto.

## 15.3 Preparación para Redsys / Bizum

Deja también un adaptador preparado para Redsys. Documenta que la Pasarela Unificada de Redsys contempla pago por tarjeta y Bizum, y que Redsys dispone de sandbox/tarjetas y entornos de prueba, además de guías de integración y documentación para Bizum.

Variables esperadas:

- `REDSYS_MERCHANT_CODE`
- `REDSYS_TERMINAL`
- `REDSYS_SECRET_KEY`
- `REDSYS_ENV`
- `REDSYS_CURRENCY`
- `REDSYS_TRANSACTION_TYPE`

No bloquees el MVP intentando cerrar la firma real desde el inicio.

---

## 16. README obligatorio

Debes actualizar `README.md` durante las fases para que al final incluya, como mínimo:

1. descripción del proyecto;
2. arquitectura;
3. stack;
4. instalación backend;
5. instalación frontend;
6. variables de entorno;
7. migraciones;
8. seed;
9. cómo arrancar el proyecto;
10. credenciales demo;
11. cómo probar el checkout mock;
12. cómo activar un pasaporte;
13. cómo probar el scanner QR;
14. cómo entrar al panel admin;
15. qué queda preparado para Stripe y Redsys/Bizum.

---

## 17. Tests mínimos obligatorios

Debes crear tests backend al menos para:

- healthcheck;
- registro/login;
- permisos admin;
- creación de ruta admin;
- creación de punto de sellado con QR;
- compra mock;
- activación de pasaporte;
- sellado válido;
- sellado duplicado;
- intento de sellado de punto de otra ruta.

Si el tiempo lo permite, añade tests frontend básicos de render y navegación.

---

## 18. Definición de “MVP cerrado”

El MVP se considera cerrado solo si al terminar la fase 7 se cumple todo esto:

- backend arranca;
- frontend arranca;
- existe seed funcional;
- visitante puede ver home, rutas y catálogo;
- visitante puede comprar con mock;
- se genera pedido;
- se generan pasaportes;
- usuario puede registrarse e iniciar sesión;
- usuario puede activar un pasaporte con código único;
- usuario puede ver su ruta privada y su pasaporte;
- usuario puede escanear un QR válido;
- el sistema registra el sello;
- el progreso se actualiza;
- duplicados no suman doble;
- admin puede crear y editar rutas;
- admin puede crear puntos de sellado;
- admin puede ver pasaportes y pedidos;
- admin puede ver resumen operativo básico.

Si falta una de estas piezas, el MVP no está cerrado.

---

## 19. Entregables esperados de CODEX

Al finalizar debes entregar:

1. código fuente backend;
2. código fuente frontend;
3. migraciones;
4. seed;
5. proveedor mock de pagos;
6. estructura de providers para Stripe y Redsys;
7. generación de QR de puntos;
8. activación de pasaporte;
9. scanner de sellado;
10. dashboard admin mínimo;
11. README completo;
12. documentación técnica auxiliar;
13. tests mínimos.

---

## 20. Instrucción final de ejecución

Construye el proyecto **en orden**, fase por fase, manteniendo siempre el sistema ejecutable.

### Reglas finales

- Prioriza lo imprescindible.
- No intentes “embellecer” antes de cerrar la lógica principal.
- No introduzcas complejidad prematura.
- No conviertas el MVP en un ERP.
- Deja lo futuro preparado, pero no dependas de ello.
- Cada fase debe dejar el repositorio en mejor estado que al empezar.

### Al terminar cada fase, documenta brevemente:

- qué has implementado,
- qué endpoints/páginas han quedado funcionales,
- cómo probar esa fase,
- qué queda pendiente de la siguiente.

### Al terminar la fase 7, explica:

1. cómo arrancar backend y frontend;
2. qué credenciales demo usar;
3. cómo hacer una compra mock;
4. cómo localizar el código único de activación del pasaporte demo;
5. cómo escanear o simular un QR de punto de sellado;
6. qué piezas están preparadas pero fuera del MVP;
7. qué pasos concretos hay que seguir para activar Stripe y Redsys/Bizum reales en una fase posterior.
