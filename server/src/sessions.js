/**
 * Registro de sesiones: qué socket del kiosko espera la respuesta de cada sesión.
 *
 * Es una estructura pura (sin red ni temporizadores propios) para poder probarla sola; el ciclo de limpieza
 * lo dispara quien la usa llamando a `evictExpired(now)`.
 */
export class SessionRegistry {
  #sessions = new Map();
  #ttlMs;

  constructor({ ttlMs }) {
    this.#ttlMs = ttlMs;
  }

  /** El kiosko con `socketId` queda a la espera de `sessionId`. Una sesión nueva reemplaza a una anterior con el mismo id. */
  register(sessionId, socketId, now = Date.now()) {
    if (typeof sessionId !== "string" || !sessionId) return false;
    this.#sessions.set(sessionId, { socketId, touchedAt: now });
    return true;
  }

  /** Socket del kiosko que espera esta sesión, o `undefined` si no existe o venció. */
  kioskFor(sessionId, now = Date.now()) {
    const session = this.#sessions.get(sessionId);
    if (!session) return undefined;
    if (now - session.touchedAt > this.#ttlMs) {
      this.#sessions.delete(sessionId);
      return undefined;
    }
    session.touchedAt = now;
    return session.socketId;
  }

  /** Olvida todas las sesiones de un socket (el kiosko se desconectó). Devuelve cuántas quitó. */
  forgetSocket(socketId) {
    let removed = 0;
    for (const [sessionId, session] of this.#sessions) {
      if (session.socketId === socketId) {
        this.#sessions.delete(sessionId);
        removed += 1;
      }
    }
    return removed;
  }

  /** Quita las sesiones sin actividad desde hace más del TTL. Devuelve cuántas quitó. */
  evictExpired(now = Date.now()) {
    let removed = 0;
    for (const [sessionId, session] of this.#sessions) {
      if (now - session.touchedAt > this.#ttlMs) {
        this.#sessions.delete(sessionId);
        removed += 1;
      }
    }
    return removed;
  }

  get size() {
    return this.#sessions.size;
  }
}
