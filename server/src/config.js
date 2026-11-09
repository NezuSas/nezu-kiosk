/**
 * Configuración del servidor, leída del entorno con valores por defecto para desarrollo.
 *
 * - PORT: puerto HTTP y de Socket.IO (4000).
 * - CORS_ORIGIN: orígenes permitidos separados por comas, o «*» (por defecto) para cualquiera: el teléfono del
 *   cliente llega desde la red móvil y el kiosko desde la LAN, normalmente por un túnel.
 * - SESSION_TTL_MINUTES: cuánto vive una sesión del kiosko sin actividad antes de olvidarla (60).
 * - STATIC_DIR: carpeta con la build del kiosko para servirla desde aquí; vacío para no servir archivos.
 */
export const loadConfig = (env = process.env) => {
  const origins = (env.CORS_ORIGIN ?? "*").split(",").map((origin) => origin.trim()).filter(Boolean);
  const minutes = Number(env.SESSION_TTL_MINUTES ?? 60);
  return {
    port: Number(env.PORT ?? 4000),
    corsOrigin: origins.length === 1 && origins[0] === "*" ? "*" : origins,
    sessionTtlMs: (Number.isFinite(minutes) && minutes > 0 ? minutes : 60) * 60_000,
    staticDir: env.STATIC_DIR?.trim() || "",
  };
};
