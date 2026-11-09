import { normalizeLead } from "./leads.js";
import { deliverLead } from "./delivery.js";

/**
 * Entrada de solicitudes: valida el mensaje del teléfono, lo guarda y lo entrega. Es el mismo camino para lo que
 * llega por Socket.IO y para lo que llega por `POST /api/leads`, así ninguna solicitud depende de que el kiosko
 * esté encendido. Evita duplicados cuando el teléfono envía la misma sesión por los dos canales.
 */
export const createIntake = ({ store, deliveries, log = console, dedupeTtlMs = 10 * 60_000 }) => {
  const seen = new Map();

  const alreadySeen = (lead, now) => {
    for (const [key, at] of seen) if (now - at > dedupeTtlMs) seen.delete(key);
    const key = `${lead.sessionId}:${lead.channel}`;
    if (seen.has(key)) return true;
    seen.set(key, now);
    return false;
  };

  return {
    /** Devuelve `{ accepted: false, reason }` o `{ accepted: true, lead, deliveries }`. */
    async receive(payload, { now = Date.now() } = {}) {
      const lead = normalizeLead(payload, { now: new Date(now) });
      if (!lead) return { accepted: false, reason: "invalid" };
      if (alreadySeen(lead, now)) return { accepted: true, lead, deliveries: [], duplicate: true };
      try {
        await store.save(lead);
      } catch (error) {
        log.warn(`solicitud ${lead.id}: no se pudo guardar: ${error.message}`);
      }
      const results = await deliverLead(lead, deliveries, log);
      return { accepted: true, lead, deliveries: results };
    },
  };
};
