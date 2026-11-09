# Servidor en tiempo real

Une el kiosko con el teléfono del cliente y **entrega las solicitudes al negocio**. El kiosko registra la sesión que muestra en el QR; el teléfono envía sus datos y su selección con ese mismo id; el servidor guarda la solicitud en disco, la envía por correo o webhook y avisa solo a ese kiosko. Si el socket del teléfono no conecta, la misma solicitud llega por `POST /api/leads`.

```bash
npm install
npm run dev      # recarga al guardar
npm start        # producción
npm test         # node --test
```

| Variable | Por defecto | Qué hace |
|---|---|---|
| `PORT` | `4000` | Puerto HTTP y de Socket.IO. |
| `CORS_ORIGIN` | `*` | Orígenes permitidos separados por comas. |
| `SESSION_TTL_MINUTES` | `60` | Minutos sin actividad antes de olvidar una sesión. |
| `STATIC_DIR` | vacío | Carpeta con la build del kiosko (`../dist`) para servirla desde aquí. |
| `BUSINESS_NAME` | `NEZU` | Nombre del negocio en el asunto de los correos. |
| `LEADS_DIR` | `./data/leads` | Carpeta de las solicitudes, un archivo JSON Lines por día; vacío para no guardar. |
| `LEADS_WEBHOOK_URL` | vacío | URL que recibe cada solicitud por POST en JSON (CRM, hoja de cálculo, automatización). |
| `LEADS_WEBHOOK_SECRET` | vacío | Si se define, el cuerpo va firmado en `X-Kiosk-Signature: sha256=…` (HMAC). |
| `SMTP_URL` | vacío | Servidor de correo, p. ej. `smtps://usuario:clave@smtp.ejemplo.com:465`. |
| `LEADS_EMAIL_TO` / `LEADS_EMAIL_FROM` | vacío | Destinatario y remitente del correo de cada solicitud; el `Reply-To` es el cliente. |

Rutas HTTP: `GET /health` responde `{ ok, sessions }`; `POST /api/leads` recibe la misma solicitud que el socket (límite de 20 por minuto y dirección) y responde `202 { ok, id }`.

Cada solicitud guardada tiene `id`, `receivedAt`, `sessionId`, `mode`, `channel` (`whatsapp` si el cliente abrió el chat, `email` si usó el formulario), `contact` e `items`. Una misma sesión y canal no se registra dos veces en diez minutos, así el respaldo HTTP no duplica.

```text
src/
  config.js     variables de entorno con valores por defecto
  sessions.js   registro de sesiones (puro, con pruebas)
  realtime.js   protocolo register_session / message sobre Socket.IO
  leads.js      normaliza la solicitud y la escribe como texto
  storage.js    almacén JSON Lines por día
  delivery.js   entregas: webhook firmado y correo (nodemailer)
  intake.js     valida, deduplica, guarda y entrega; lo usan el socket y la ruta HTTP
  rateLimit.js  límite de peticiones por dirección
  app.js        Express: salud, POST /api/leads y, si se pide, la build del kiosko
  index.js      arranque, limpieza periódica y apagado ordenado
```
