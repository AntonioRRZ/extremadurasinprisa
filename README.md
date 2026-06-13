# Extremadura sin prisas

MVP full-stack para una plataforma de rutas camper con pasaporte fisico, activacion digital, contenido privado por ruta, sellado oficial por QR y panel admin minimo.

## Arquitectura

- `backend/`: FastAPI, SQLAlchemy 2, JWT, seed demo, endpoints publicos, privados y admin.
- `frontend/`: React + Vite + TypeScript, routing, sesion persistida, checkout mock, area de usuario y admin.
- `docs/payment-gateways.md`: preparacion de Stripe y Redsys/Bizum.

## Stack

- Frontend: React, Vite, TypeScript, React Router, React Hook Form, Zod, React Leaflet, html5-qrcode.
- Backend: Python 3.12+, FastAPI, SQLAlchemy 2, Alembic, Pydantic Settings, PyJWT, passlib/bcrypt.
- Base de datos: SQLite en desarrollo.

## Instalacion

### Backend

```powershell
python -m venv .venv
.venv\Scripts\Activate.ps1
python -m pip install -e .\backend[dev]
Copy-Item .env.example .env
python .\backend\app\seed.py
uvicorn app.main:app --reload --app-dir backend
```

### Frontend

```powershell
cd frontend
npm install
npm run dev
```

## Variables de entorno

Parte de `.env.example`. Para el frontend, `VITE_API_URL` debe apuntar al backend, por defecto `http://localhost:8000/api/v1`.

## Migraciones

Se incluye una migracion inicial en `backend/alembic/versions/20260612_0001_initial.py`.

Comando esperado:

```powershell
cd backend
alembic upgrade head
```

## Seed

```powershell
python .\backend\app\seed.py
```

El seed crea:

- usuarios demo,
- una ruta publicada,
- 6 puntos de sellado,
- 6 tipos de pasaporte,
- un pedido mock pagado,
- un pasaporte inactivo,
- un pasaporte activo con sello demo.

## Credenciales demo

- `admin@example.com` / `Admin1234!`
- `user@example.com` / `User1234!`

## Fases cerradas en esta entrega

1. Base tecnica: backend y frontend arrancables.
2. Auth: registro, login, refresh y `GET /me`.
3. Publico: home editorial, rutas teaser, catalogo y detalle publico.
4. Admin: dashboard, usuarios, rutas, puntos, tipos y pasaportes.
5. Monetizacion MVP: pedido, checkout mock y generacion de pasaportes.
6. Activacion: area privada, activacion y mapa por ruta.
7. Sellado: scanner QR, duplicados, progreso y cierre operativo.

## Como probar el checkout mock

1. Abre `/catalogo`.
2. Elige un pasaporte y entra en `/checkout`.
3. Rellena comprador, metodo visible (`card` o `bizum`) y resultado mock.
4. Confirma el flujo. Si eliges `success`, se crea el pedido y se generan pasaportes.

## Como activar un pasaporte

1. Si es tu primer acceso, abre `/register` y completa el alta con el codigo unico del pasaporte.
2. Si ya tienes cuenta, inicia sesion y abre `/activar`.
3. Introduce un codigo unico. El seed deja listo `DEMO-ACT-001`.
4. Al activarlo se desbloquea el detalle privado en `/mi/pasaportes`.

## Como probar el scanner QR

1. Entra con `user@example.com`.
2. Abre un pasaporte activo o activa `DEMO-ACT-001`.
3. Ve a `/mi/pasaportes/{id}/scan`.
4. Pega un valor QR valido generado desde admin.
5. El backend registra el sello y rechaza duplicados del mismo punto.

## Panel admin

1. Entra con `admin@example.com`.
2. Usa `/admin` como resumen.
3. Gestiona rutas en `/admin/rutas`.
4. Crea puntos oficiales desde el editor de ruta y copia el valor `ESPSTAMP|...`.
5. Revisa `/admin/tipos`, `/admin/pasaportes`, `/admin/pedidos` y `/admin/usuarios`.

## Endpoints principales

### Publicos

- `GET /api/v1/health`
- `GET /api/v1/routes`
- `GET /api/v1/routes/{slug}`
- `GET /api/v1/routes/{slug}/passport-types`
- `GET /api/v1/routes/{slug}/stamp-points/public`
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
- `GET /api/v1/admin/users`
- `PATCH /api/v1/admin/users/{user_id}`
- `GET /api/v1/admin/routes`
- `POST /api/v1/admin/routes`
- `GET /api/v1/admin/routes/{route_id}`
- `PATCH /api/v1/admin/routes/{route_id}`
- `GET /api/v1/admin/routes/{route_id}/stamp-points`
- `POST /api/v1/admin/routes/{route_id}/stamp-points`
- `PATCH /api/v1/admin/stamp-points/{stamp_point_id}`
- `POST /api/v1/admin/stamp-points/{stamp_point_id}/regenerate-qr`
- `GET /api/v1/admin/passport-types`
- `POST /api/v1/admin/passport-types`
- `PATCH /api/v1/admin/passport-types/{passport_type_id}`
- `GET /api/v1/admin/passports`
- `PATCH /api/v1/admin/passports/{passport_id}`
- `POST /api/v1/admin/passports/{passport_id}/manual-stamp`
- `GET /api/v1/admin/orders`

## Preparado pero fuera del MVP

- Stripe real con webhooks.
- Redsys / Bizum real con firma.
- diploma PDF.
- notificaciones reales.
- logistica avanzada.
- promociones complejas.

## Verificacion manual recomendada

1. Levantar backend y frontend.
2. Comprobar `GET /api/v1/health`.
3. Navegar home, rutas y catalogo.
4. Dar de alta un usuario con codigo unico o usar credenciales demo.
5. Simular una compra mock.
6. Activar `DEMO-ACT-001`.
7. Generar un QR desde admin y sellar el pasaporte.
