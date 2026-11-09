/**
 * Eventos de uso del kiosko: qué pantallas se ven, qué se añade, cuándo se abre el QR. Llegan en lotes desde el
 * tótem y se guardan tal cual, acotados, para que el negocio pueda medir qué interesa. No llevan datos personales.
 */

const EVENT_NAMES = new Set([
  "screen_view",
  "service_added",
  "service_removed",
  "selection_opened",
  "handoff_opened",
  "idle_reset",
  "language_changed",
  "payment_confirmed",
  "error",
]);

const text = (value, max = 120) => (typeof value === "string" ? value.trim().slice(0, max) : "");

/** Devuelve los eventos válidos de un lote (máximo 50), con la hora de recepción y el kiosko que los envía. */
export const normalizeEvents = (payload, { now = new Date(), maxBatch = 50 } = {}) => {
  const raw = Array.isArray(payload?.events) ? payload.events : Array.isArray(payload) ? payload : [];
  const kioskId = text(payload?.kioskId, 60) || "kiosk";
  return raw
    .slice(0, maxBatch)
    .filter((event) => event && typeof event === "object" && EVENT_NAMES.has(event.name))
    .map((event) => ({
      receivedAt: now.toISOString(),
      at: typeof event.at === "string" && !Number.isNaN(Date.parse(event.at)) ? event.at : now.toISOString(),
      kioskId,
      name: event.name,
      screen: text(event.screen, 80),
      ref: text(event.ref, 120),
      language: text(event.language, 8),
    }));
};

/** Resumen para `GET /api/stats`: totales por día de solicitudes, eventos y pagos, y los eventos más frecuentes. */
export const summarizeStats = async ({ leads, events, payments }, { days = 7, today = new Date() } = {}) => {
  const [leadCounts, eventCounts, paymentCounts] = await Promise.all([leads.countByDay(), events.countByDay(), payments.countByDay()]);
  const dayKeys = Array.from({ length: days }, (_, index) => {
    const date = new Date(today);
    date.setUTCDate(date.getUTCDate() - index);
    return date.toISOString().slice(0, 10);
  }).reverse();
  const byDay = dayKeys.map((day) => ({
    day,
    leads: leadCounts[day] ?? 0,
    events: eventCounts[day] ?? 0,
    payments: paymentCounts[day] ?? 0,
  }));

  const recentEvents = (await Promise.all(dayKeys.map((day) => events.list(new Date(`${day}T00:00:00Z`))))).flat();
  const byName = {};
  const byRef = {};
  for (const event of recentEvents) {
    byName[event.name] = (byName[event.name] ?? 0) + 1;
    if (event.name === "service_added" && event.ref) byRef[event.ref] = (byRef[event.ref] ?? 0) + 1;
  }
  const topServices = Object.entries(byRef)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([ref, count]) => ({ ref, count }));

  return { days: byDay, events: byName, topServices };
};
