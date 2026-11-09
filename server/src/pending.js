/**
 * Pagos a la espera: lo que el teléfono envió en modo pago y todavía nadie confirmó. Vive en memoria (una
 * sesión de kiosko es cosa de minutos) y alimenta la pantalla de caja de `/admin`, donde una persona confirma el
 * cobro con la referencia del datáfono o del banco.
 */
const text = (value, max = 120) => (typeof value === "string" ? value.trim().slice(0, max) : "");

const totalOf = (items) => {
  if (!items.length || items.some((item) => typeof item.price !== "number")) return undefined;
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
};

export const createPendingPayments = ({ ttlMs = 2 * 60 * 60_000 } = {}) => {
  const pending = new Map();

  const sweep = (now) => {
    for (const [sessionId, entry] of pending) if (now - entry.receivedAtMs > ttlMs) pending.delete(sessionId);
  };

  return {
    /** Recuerda la sesión si el mensaje del teléfono es un pedido con pago; devuelve si la recordó. */
    remember(payload, now = Date.now()) {
      if (!payload || typeof payload !== "object" || payload.mode !== "payment") return false;
      const sessionId = text(payload.sessionId, 80);
      if (!sessionId) return false;
      const contact = payload.contact && typeof payload.contact === "object" ? payload.contact : {};
      const items = (Array.isArray(payload.summary?.items) ? payload.summary.items : [])
        .filter((item) => item && typeof item === "object" && typeof item.name === "string")
        .map((item) => ({
          name: text(item.name),
          quantity: Number.isInteger(item.quantity) && item.quantity > 0 ? item.quantity : 1,
          ...(typeof item.price === "number" ? { price: item.price } : {}),
        }));
      pending.set(sessionId, {
        sessionId,
        receivedAtMs: now,
        receivedAt: new Date(now).toISOString(),
        customer: text(contact.businessName) || text(contact.name) || text(contact.phone) || text(contact.email) || "cliente",
        taxId: text(contact.taxId, 20),
        paymentMethod: payload.paymentMethod === "card" ? "card" : "qr",
        items,
        total: totalOf(items),
      });
      return true;
    },

    /** Sesiones a la espera, las más recientes primero, sin la marca interna de tiempo. */
    list(now = Date.now()) {
      sweep(now);
      return Array.from(pending.values())
        .sort((a, b) => b.receivedAtMs - a.receivedAtMs)
        .map(({ receivedAtMs: _ignored, ...entry }) => entry);
    },

    /** Da por cobrada una sesión; devuelve lo que había o `undefined`. */
    settle(sessionId) {
      const entry = pending.get(sessionId);
      pending.delete(sessionId);
      return entry;
    },

    get size() {
      return pending.size;
    },
  };
};
