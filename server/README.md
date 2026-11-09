# Servidor en tiempo real

Une el kiosko con el teléfono del cliente, **entrega las solicitudes al negocio** y ofrece en `/admin` la caja y el panel de uso. El kiosko registra la sesión que muestra en el QR; el teléfono envía sus datos y su selección con ese mismo id; el servidor guarda la solicitud en disco, la envía por correo o webhook y avisa solo a ese kiosko. Si el socket del teléfono no conecta, la misma solicitud llega por `POST /api/leads`.

```bash
npm install
npm run dev      # recarga al guardar
npm start        # producción
npm test         # node --test
```

En producción lo normal es no arrancarlo a mano: el `docker-compose.yml` de la raíz construye el kiosko y lo sirve desde este servidor (`STATIC_DIR`), con los datos en `./data`.

| Variable | Por defecto | Qué hace |
|---|---|---|
| `PORT` | `4000` | Puerto HTTP y de Socket.IO. |
| `CORS_ORIGIN` | `*` | Orígenes permitidos separados por comas. |
| `SESSION_TTL_MINUTES` | `60` | Minutos sin actividad antes de olvidar una sesión. |
| `STATIC_DIR` | vacío | Carpeta con la build del kiosko (`../dist`) para servirla desde aquí. |
| `ADMIN_TOKEN` | vacío | Token de `POST /api/payments/confirm` y `GET /api/stats` (`Authorization: Bearer …`). Sin él, esas rutas responden 503. |
| `DATA_DIR` | `./data` | Carpeta base de los registros: `leads/`, `events/` y `payments/`. |
| `BUSINESS_NAME` | `NEZU` | Nombre del negocio en el asunto de los correos. |
| `LEADS_DIR` | `DATA_DIR/leads` | Sobrescribe la carpeta de las solicitudes; vacío explícito para no guardarlas. |
| `LEADS_WEBHOOK_URL` | vacío | URL que recibe cada solicitud por POST en JSON (CRM, hoja de cálculo, automatización). |
| `LEADS_WEBHOOK_SECRET` | vacío | Si se define, el cuerpo va firmado en `X-Kiosk-Signature: sha256=…` (HMAC). |
| `SMTP_URL` | vacío | Servidor de correo, p. ej. `smtps://usuario:clave@smtp.ejemplo.com:465`. |
| `LEADS_EMAIL_TO` / `LEADS_EMAIL_FROM` | vacío | Destinatario y remitente del correo de cada solicitud; el `Reply-To` es el cliente. |

Rutas HTTP:

| Ruta | Quién | Qué hace |
|---|---|---|
| `GET /health` | cualquiera | `{ ok, sessions }`. |
| `POST /api/leads` | el teléfono | La misma solicitud que el socket, por si este no conecta (20 por minuto y dirección). Responde `202 { ok, id }`. |
| `POST /api/events` | el kiosko | Lote de eventos de uso (`{ kioskId, events: [{ name, screen, ref, at }] }`, máximo 50). Se guardan en `events/`. |
| `POST /api/payments/confirm` | pasarela, caja o mostrador, con token | `{ sessionId, method, reference, amount }` con `method` `qr` o `card`. Guarda la confirmación y emite `payment_confirmed` al kiosko de esa sesión, que avanza solo. |
| `GET /api/stats` | administración, con token | Solicitudes, eventos y pagos por día de la última semana, totales por tipo de evento y los diez servicios más añadidos. |
| `GET /api/payments/pending` | administración, con token | Clientes que eligieron pagar y aún no tienen el cobro confirmado (cliente, método, servicios, importe). |
| `GET /admin/` | administración | Página con la caja y el panel; pide el token y lo guarda solo en la pestaña. |

La forma normal de confirmar un cobro es la caja de `/admin`: cada cliente a la espera aparece con sus servicios y su importe, la persona escribe la referencia del datáfono o del banco y pulsa «Confirmar cobro». Por API, por ejemplo desde una pasarela:

```bash
curl -X POST http://localhost:4000/api/payments/confirm -H "Authorization: Bearer $ADMIN_TOKEN" -H "Content-Type: application/json" -d '{"sessionId":"<id de la sesión del QR>","method":"card","reference":"AUTH-1234","amount":45.5}'
```

El servidor añade cabeceras de seguridad básicas (`nosniff`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`) y en producción conviene acotar `CORS_ORIGIN` a las URL del kiosko y del teléfono.

Cada solicitud guardada tiene `id`, `receivedAt`, `sessionId`, `mode`, `channel` (`whatsapp` si el cliente abrió el chat, `email` si usó el formulario), `contact` e `items`. Una misma sesión y canal no se registra dos veces en diez minutos, así el respaldo HTTP no duplica.

```text
src/
  config.js     variables de entorno con valores por defecto
  sessions.js   registro de sesiones (puro, con pruebas)
  realtime.js   protocolo register_session / message sobre Socket.IO
  leads.js      normaliza la solicitud y la escribe como texto
  storage.js    almacén JSON Lines por día (solicitudes, eventos, pagos)
  delivery.js   entregas: webhook firmado y correo (nodemailer)
  intake.js     valida, deduplica, guarda y entrega; lo usan el socket y la ruta HTTP
  events.js     eventos de uso y el resumen de estadísticas
  payments.js   confirmación de pagos y comprobación del token
  pending.js    pagos a la espera, en memoria, para la caja
  rateLimit.js  límite de peticiones por dirección
  app.js        Express: salud, solicitudes, eventos, pagos, estadísticas y, si se pide, la build del kiosko
  index.js      arranque, limpieza periódica y apagado ordenado
admin/
  index.html, admin.css, admin.js   la página de administración, sin build
```
