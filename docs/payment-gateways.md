# Pasarelas preparadas

## MockPaymentProvider

El MVP usa un proveedor `mock` para completar el flujo de compra sin depender de terceros. Soporta estados `success`, `failed` y `cancelled`, y expone una abstraccion compatible con metodos visuales `card` y `bizum`.

## Stripe

La estructura del backend deja reservadas estas variables:

- `STRIPE_SECRET_KEY`
- `STRIPE_PUBLIC_KEY`
- `STRIPE_WEBHOOK_SECRET`

La siguiente fase real debe implementar:

- creacion de checkout session,
- recepcion de webhook de pago,
- conciliacion de `Payment` y `Order`,
- soporte de Bizum donde Stripe lo ofrezca en Espana.

## Redsys / Bizum

Tambien quedan preparadas estas variables:

- `REDSYS_MERCHANT_CODE`
- `REDSYS_TERMINAL`
- `REDSYS_SECRET_KEY`
- `REDSYS_ENV`
- `REDSYS_CURRENCY`
- `REDSYS_TRANSACTION_TYPE`

Para activar Redsys en una fase posterior faltaria:

- firma de parametros,
- generacion de formulario o redireccion,
- callback asincrono y validacion,
- conciliacion de estado de pago y pedido.
