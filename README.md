# Extremadura sin prisas

MVP full-stack para una plataforma de rutas camper con pasaporte fisico, activacion digital, contenido privado por ruta, sellado oficial por QR y panel admin operativo.

## Estado actual

El proyecto ya cubre:

- area publica editorial con home, rutas, teaser map y catalogo de pasaportes,
- compra mock de pasaportes fisicos y generacion de pasaportes asociados al pedido,
- alta de usuario solo mediante codigo de activacion de pasaporte fisico,
- area privada con mis pedidos, mis pasaportes, detalle de ruta privada y escaneo QR,
- panel admin con dashboard, usuarios, rutas, puntos oficiales, puntos de interes, tipos, pasaportes, pedidos, pasaportes activos y auditoria de sellos,
- trazabilidad operativa entre compra, activacion, sellado manual, sellado QR y actividad auditada.

## Arquitectura

- `backend/`: FastAPI, SQLAlchemy 2, Alembic, JWT, seed demo, endpoints publicos, privados y admin.
- `frontend/`: React + Vite + TypeScript, React Router, React Hook Form, Leaflet, scanner QR y panel admin.
- `docs/payment-gateways.md`: notas para Stripe y Redsys/Bizum reales.

## Stack

- Frontend: React 18, Vite, TypeScript, React Router, React Hook Form, Zod, React Leaflet, html5-qrcode.
- Backend: Python 3.12+, FastAPI, SQLAlchemy 2, Alembic, Pydantic Settings, PyJWT, passlib/bcrypt.
- Base de datos: SQLite en desarrollo.

## Estructura funcional

### Publico

- `/`
- `/rutas`
- `/rutas/:slug`
- `/catalogo`
- `/checkout`
- `/checkout/resultado`
- `/login`
- `/register`
- `/activar`

### Usuario autenticado

- `/mi`
- `/mi/pedidos`
- `/mi/pasaportes`
- `/mi/pasaportes/:passportId`
- `/mi/pasaportes/:passportId/scan`

### Admin

- `/admin`
- `/admin/usuarios`
- `/admin/usuarios/:userId`
- `/admin/rutas`
- `/admin/rutas/:routeId`
- `/admin/tipos`
- `/admin/pasaportes`
- `/admin/pasaportes-activos`
- `/admin/pedidos`
- `/admin/pedidos/:orderId`
- `/admin/sellos`

## Instalacion

### 1. Crear entorno e instalar backend

```powershell
python -m venv .venv
.venv\Scripts\Activate.ps1
python -m pip install -e .\backend[dev]
```

### 2. Instalar frontend

```powershell
cd frontend
npm install
cd ..
```

### 3. Configurar entorno

```powershell
Copy-Item .env.example .env
```

Variables principales:

- `DATABASE_URL=sqlite:///C:/dev/extremadurasinprisa/extremadura_sin_prisas.db`
- `SECRET_KEY=change-me-in-production-with-32-bytes`
- `FRONTEND_URL=http://localhost:5173`
- `COMMON_PASSPORT_QR_URL=http://localhost:5173/activar`
- `VITE_API_URL=http://localhost:8000/api/v1`

Nota:

- si no defines `DATABASE_URL`, el backend usa por defecto `C:/dev/extremadurasinprisa/extremadura_sin_prisas.db`.
- backend y Alembic ya no dependen del directorio actual para resolver la SQLite.

### 4. Aplicar migraciones

```powershell
alembic -c .\backend\alembic.ini upgrade head
```

Si ya existe una base creada fuera de Alembic y ves errores como `table users already exists` o `table orders has no column named fulfillment_status`, elimina primero la SQLite local y vuelve a migrar:

```powershell
Remove-Item .\extremadura_sin_prisas.db -ErrorAction SilentlyContinue
Remove-Item .\backend\extremadura_sin_prisas.db -ErrorAction SilentlyContinue
alembic -c .\backend\alembic.ini upgrade head
```

Migraciones actuales:

- `20260612_0001_initial.py`
- `20260613_0002_add_order_fulfillment_fields.py`
- `20260613_0003_add_interest_points.py`

### 5. Cargar seed demo

```powershell
python .\backend\app\seed.py
```

## Levantar la aplicacion

### Terminal 1: backend

```powershell
.venv\Scripts\Activate.ps1
python -m uvicorn app.main:app --reload --app-dir backend
```

Backend disponible en `http://localhost:8000`.

### Terminal 2: frontend

```powershell
cd frontend
npm run dev
```

Frontend disponible en `http://localhost:5173`.

## Seed demo

El seed crea:

- `admin@example.com` / `Admin1234!`
- `user@example.com` / `User1234!`
- 1 ruta publicada,
- 6 puntos oficiales de sellado,
- 2 puntos de interes editoriales,
- 6 tipos de pasaporte,
- 1 pedido demo pagado y entregado,
- 1 pasaporte inactivo,
- 1 pasaporte activo con sello demo.

Codigos utiles del seed:

- `DEMO-ACT-001`: pasaporte inactivo listo para activacion por usuario.
- `DEMO-ACT-002`: pasaporte ya activado por `user@example.com`.

## Reglas de acceso vigentes

- El alta publica directa esta deshabilitada.
- `POST /api/v1/auth/register` responde `403`.
- El flujo correcto de alta es `/register`, que usa `POST /api/v1/auth/activation/register`.
- Solo puede existir usuario operativo cuando ya existe un pasaporte fisico con codigo de activacion valido.

## Procesos principales

### 1. Compra mock

1. Abre `/catalogo`.
2. Selecciona un pasaporte y ve a `/checkout`.
3. Completa comprador y metodo visible.
4. Confirma el resultado mock.
5. Si el resultado es `success`, el pedido pasa a `paid` y se generan pasaportes fisicos asociados.

### 2. Alta y activacion con codigo unico

1. Abre `/register`.
2. Introduce email, password y codigo de activacion del pasaporte fisico.
3. Si el codigo es valido, se crea el usuario y el pasaporte queda activado.
4. Tambien puedes usar `/activar` si ya tienes cuenta autenticada.

### 3. Escaneo QR de sello

1. Entra con una cuenta que tenga pasaporte activo.
2. Abre `/mi/pasaportes/{id}/scan`.
3. Escanea o pega un valor `ESPSTAMP|...`.
4. El backend registra el sello si pertenece a la ruta correcta y no es duplicado.

### 4. Sellado manual admin

1. Entra en `/admin/pasaportes`.
2. Usa la accion de sellado manual sobre un pasaporte.
3. El sistema registra un `Stamp` con `scan_source = admin_manual`.
4. El modulo `/admin/sellos` muestra el evento y el actor admin que lo registró.

### 5. Operacion de pedidos

1. Entra en `/admin/pedidos`.
2. Revisa el listado y abre `/admin/pedidos/:orderId`.
3. Actualiza `fulfillment_status`, `tracking_code` y `admin_notes`.
4. Pago y logistica fisica quedan separados.

### 6. Gestion de rutas

1. Entra en `/admin/rutas`.
2. Crea una ruta o abre una existente.
3. En el editor de ruta puedes:
   - editar metadatos de la ruta,
   - crear y editar `StampPoint`,
   - crear y editar `InterestPoint`,
   - activar o desactivar puntos sin borrado fisico,
   - regenerar QR de puntos oficiales,
   - ver mapa mixto de sellos y puntos de interes.

### 7. Seguimiento operativo de pasaportes

1. Entra en `/admin/pasaportes-activos`.
2. Revisa el listado de pasaportes en `operational_status = active`.
3. Abre un pasaporte para ver:
   - usuario,
   - ruta,
   - progreso,
   - ultimo punto sellado,
   - mapa de avance,
   - timeline de sellos.

### 8. Auditoria de sellos

1. Entra en `/admin/sellos`.
2. Filtra por fuente, usuario, pasaporte, punto o texto libre.
3. Revisa cada evento con:
   - `scan_source`,
   - estado,
   - ruta,
   - pasaporte,
   - punto,
   - viajero,
   - actor que registró el sello,
   - accion auditada asociada.

## Endpoints principales

### Publicos

- `GET /api/v1/health`
- `GET /api/v1/routes`
- `GET /api/v1/routes/{slug}`
- `GET /api/v1/routes/{slug}/passport-types`
- `GET /api/v1/routes/{slug}/stamp-points/public`
- `GET /api/v1/routes/{slug}/interest-points/public`
- `POST /api/v1/auth/register`
- `POST /api/v1/auth/activation/register`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/refresh`
- `POST /api/v1/orders`
- `POST /api/v1/payments/checkout-session`
- `POST /api/v1/payments/mock/confirm`

### Usuario autenticado

- `GET /api/v1/me`
- `GET /api/v1/me/orders`
- `GET /api/v1/me/routes`
- `GET /api/v1/me/passports`
- `GET /api/v1/me/passports/{passport_id}`
- `POST /api/v1/me/passports/activate`
- `POST /api/v1/me/passports/{passport_id}/scan`
- `GET /api/v1/me/passports/{passport_id}/stamps`

### Admin

- `GET /api/v1/admin/dashboard/summary`
- `GET /api/v1/admin/stamps`
- `GET /api/v1/admin/users`
- `GET /api/v1/admin/users/{user_id}`
- `PATCH /api/v1/admin/users/{user_id}`
- `GET /api/v1/admin/routes`
- `POST /api/v1/admin/routes`
- `GET /api/v1/admin/routes/{route_id}`
- `PATCH /api/v1/admin/routes/{route_id}`
- `GET /api/v1/admin/routes/{route_id}/stamp-points`
- `POST /api/v1/admin/routes/{route_id}/stamp-points`
- `PATCH /api/v1/admin/stamp-points/{stamp_point_id}`
- `POST /api/v1/admin/stamp-points/{stamp_point_id}/regenerate-qr`
- `GET /api/v1/admin/routes/{route_id}/interest-points`
- `POST /api/v1/admin/routes/{route_id}/interest-points`
- `PATCH /api/v1/admin/interest-points/{interest_point_id}`
- `GET /api/v1/admin/passport-types`
- `POST /api/v1/admin/passport-types`
- `PATCH /api/v1/admin/passport-types/{passport_type_id}`
- `GET /api/v1/admin/passports`
- `GET /api/v1/admin/active-passports`
- `GET /api/v1/admin/active-passports/{passport_id}`
- `PATCH /api/v1/admin/passports/{passport_id}`
- `POST /api/v1/admin/passports/{passport_id}/manual-stamp`
- `GET /api/v1/admin/orders`
- `GET /api/v1/admin/orders/{order_id}`
- `PATCH /api/v1/admin/orders/{order_id}`

## Pruebas y verificacion

### Backend

```powershell
.venv\Scripts\python -m pytest backend\app\tests
```

### Frontend

```powershell
cd frontend
npm run build
```

Nota:

- en entornos restringidos, Vite puede necesitar permiso para escribir su fichero temporal de configuracion durante `npm run build`.

## Verificacion manual recomendada

1. Levantar backend y frontend.
2. Comprobar `GET /api/v1/health`.
3. Navegar home, rutas y catalogo.
4. Hacer una compra mock.
5. Dar de alta un nuevo usuario con codigo de activacion o usar las credenciales demo.
6. Activar `DEMO-ACT-001` si quieres probar el flujo autenticado de activacion.
7. Generar un QR desde `/admin/rutas/:routeId` o usar sellado manual.
8. Revisar `/admin/pedidos`, `/admin/usuarios`, `/admin/pasaportes-activos` y `/admin/sellos`.

## Preparado pero fuera del MVP

- Stripe real con webhooks.
- Redsys / Bizum real con firma.
- diploma PDF.
- notificaciones reales.
- logistica avanzada.
- promociones complejas.
- gestion operativa de excepciones de activacion y reasignacion.
