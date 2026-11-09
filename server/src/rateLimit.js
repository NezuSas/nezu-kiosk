/**
 * Límite de peticiones por dirección IP en una ventana deslizante, en memoria. Suficiente para un servidor que
 * atiende un puñado de kioskos; protege `POST /api/leads` de un teléfono que reintente sin parar.
 */
export const createRateLimiter = ({ limit = 20, windowMs = 60_000 } = {}) => {
  const hits = new Map();
  return {
    /** Verdadero si la petición se permite. */
    allow(key, now = Date.now()) {
      const recent = (hits.get(key) ?? []).filter((at) => now - at < windowMs);
      if (recent.length >= limit) {
        hits.set(key, recent);
        return false;
      }
      recent.push(now);
      hits.set(key, recent);
      return true;
    },
    middleware() {
      return (request, response, next) => {
        if (this.allow(request.ip)) return next();
        response.status(429).json({ ok: false, error: "too_many_requests" });
      };
    },
  };
};
