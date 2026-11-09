/**
 * Configuración del servidor, leída del entorno con valores por defecto para desarrollo.
 *
 * Red
 * - PORT: puerto HTTP y de Socket.IO (4000).
 * - CORS_ORIGIN: orígenes permitidos separados por comas, o «*» (por defecto) para cualquiera: el teléfono del
 *   cliente llega desde la red móvil y el kiosko desde la LAN, normalmente por un túnel. En producción, pon aquí
 *   las URL del kiosko y del teléfono.
 * - SESSION_TTL_MINUTES: cuánto vive una sesión del kiosko sin actividad antes de olvidarla (60).
 * - STATIC_DIR: carpeta con la build del kiosko para servirla desde aquí; vacío para no servir archivos.
 * - ADMIN_TOKEN: token para `POST /api/payments/confirm` y `GET /api/stats` (`Authorization: Bearer …`).
 *   Sin token, esas rutas responden 503.
 *
 * Datos
 * - DATA_DIR: carpeta base de los registros (./data). Dentro van leads/, events/ y payments/.
 * - LEADS_DIR: sobrescribe la carpeta de solicitudes; vacío explícito desactiva el guardado.
 *
 * Solicitudes
 * - BUSINESS_NAME: nombre del negocio en el asunto de los correos (NEZU).
 * - LEADS_WEBHOOK_URL: URL que recibe cada solicitud por POST en JSON; LEADS_WEBHOOK_SECRET firma el cuerpo (HMAC).
 * - SMTP_URL: servidor de correo, por ejemplo smtps://usuario:clave@smtp.ejemplo.com:465.
 * - LEADS_EMAIL_TO / LEADS_EMAIL_FROM: destinatario y remitente del correo de cada solicitud.
 */
export const loadConfig = (env = process.env) => {
  const origins = (env.CORS_ORIGIN ?? "*").split(",").map((origin) => origin.trim()).filter(Boolean);
  const minutes = Number(env.SESSION_TTL_MINUTES ?? 60);
  const clean = (value) => (typeof value === "string" ? value.trim() : "");
  const dataDir = clean(env.DATA_DIR) || "./data";
  return {
    port: Number(env.PORT ?? 4000),
    corsOrigin: origins.length === 1 && origins[0] === "*" ? "*" : origins,
    sessionTtlMs: (Number.isFinite(minutes) && minutes > 0 ? minutes : 60) * 60_000,
    staticDir: clean(env.STATIC_DIR),
    adminToken: clean(env.ADMIN_TOKEN),
    dataDir,
    leadsDir: env.LEADS_DIR === undefined ? `${dataDir}/leads` : clean(env.LEADS_DIR),
    eventsDir: `${dataDir}/events`,
    paymentsDir: `${dataDir}/payments`,
    businessName: clean(env.BUSINESS_NAME) || "NEZU",
    leadsWebhookUrl: clean(env.LEADS_WEBHOOK_URL),
    leadsWebhookSecret: clean(env.LEADS_WEBHOOK_SECRET),
    smtpUrl: clean(env.SMTP_URL),
    leadsEmailTo: clean(env.LEADS_EMAIL_TO),
    leadsEmailFrom: clean(env.LEADS_EMAIL_FROM),
  };
};
