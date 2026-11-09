# Servidor en tiempo real

Une el kiosko con el teléfono del cliente. El kiosko registra la sesión que muestra en el QR; el teléfono envía los datos con ese mismo id y el servidor se los entrega solo a ese kiosko. Sin este servidor el tótem funciona igual: solo falta el salto automático a la pantalla final.

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

`GET /health` responde `{ ok, sessions }`.

```text
src/
  config.js    variables de entorno con valores por defecto
  sessions.js  registro de sesiones (puro, con pruebas)
  realtime.js  protocolo register_session / message sobre Socket.IO
  app.js       Express: salud y, si se pide, la build del kiosko
  index.js     arranque, limpieza periódica y apagado ordenado
```
