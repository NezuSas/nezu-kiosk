import { randomUUID } from "node:crypto";

/**
 * Confirmación de pago. El kiosko no puede saber por sí solo si el banco o el datáfono cobraron; quien lo sabe
 * (una pasarela por webhook, el sistema de caja o una persona en el mostrador) llama a `POST /api/payments/confirm`
 * con el token de administración y el servidor avisa al kiosko de esa sesión, que salta a la pantalla final.
 */

const text = (value, max = 120) => (typeof value === "string" ? value.trim().slice(0, max) : "");

export const normalizePaymentConfirmation = (payload, { now = new Date(), id = randomUUID() } = {}) => {
  if (!payload || typeof payload !== "object") return null;
  const sessionId = text(payload.sessionId, 80);
  if (!sessionId) return null;
  const amount = typeof payload.amount === "number" && Number.isFinite(payload.amount) && payload.amount >= 0 ? payload.amount : undefined;
  return {
    id,
    receivedAt: now.toISOString(),
    sessionId,
    method: payload.method === "card" ? "card" : payload.method === "qr" ? "qr" : "other",
    reference: text(payload.reference, 120),
    ...(amount === undefined ? {} : { amount }),
    confirmedBy: text(payload.confirmedBy, 80) || "api",
  };
};

/** Comprobación del token de administración en `Authorization: Bearer …`. Sin token configurado, nada pasa. */
export const authorize = (adminToken) => (request, response, next) => {
  if (!adminToken) return response.status(503).json({ ok: false, error: "admin_token_not_configured" });
  const header = request.get("authorization") ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7).trim() : "";
  if (token !== adminToken) return response.status(401).json({ ok: false, error: "unauthorized" });
  next();
};
