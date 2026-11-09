import { randomUUID } from "node:crypto";

/**
 * Una solicitud («lead») es lo que el negocio recibe cuando un cliente termina en el kiosko: sus datos de contacto,
 * lo que eligió y por dónde quiere que le respondan. Este módulo la construye a partir del mensaje del teléfono y
 * la convierte en texto legible; no sabe de red ni de disco.
 */

const text = (value, max = 300) => (typeof value === "string" ? value.trim().slice(0, max) : "");

const normalizeItems = (summary) => {
  const items = Array.isArray(summary?.items) ? summary.items : [];
  return items
    .filter((item) => item && typeof item === "object")
    .slice(0, 100)
    .map((item) => ({
      serviceId: text(item.serviceId, 80),
      name: text(item.name, 120),
      quantity: Number.isInteger(item.quantity) && item.quantity > 0 ? item.quantity : 1,
      lineName: text(item.lineName, 120),
      categoryName: text(item.categoryName, 120),
      ...(typeof item.price === "number" && Number.isFinite(item.price) ? { price: item.price } : {}),
    }))
    .filter((item) => item.name);
};

/** Convierte el mensaje del teléfono en una solicitud válida, o devuelve `null` si no tiene lo mínimo. */
export const normalizeLead = (payload, { now = new Date(), id = randomUUID() } = {}) => {
  if (!payload || typeof payload !== "object") return null;
  const contact = payload.contact && typeof payload.contact === "object" ? payload.contact : null;
  if (!contact) return null;
  const sessionId = text(payload.sessionId, 80);
  if (!sessionId) return null;

  const normalizedContact = {
    name: text(contact.name, 120),
    phone: text(contact.phone, 40),
    email: text(contact.email, 160),
    city: text(contact.city, 80),
    notes: text(contact.notes, 1000),
    businessName: text(contact.businessName, 160),
    taxId: text(contact.taxId, 20),
  };
  if (!normalizedContact.name && !normalizedContact.phone && !normalizedContact.email) return null;

  return {
    id,
    receivedAt: now.toISOString(),
    sessionId,
    mode: payload.mode === "payment" ? "payment" : "quote",
    channel: payload.channel === "whatsapp" ? "whatsapp" : "email",
    paymentMethod: payload.paymentMethod === "card" ? "card" : payload.paymentMethod === "qr" ? "qr" : undefined,
    contact: normalizedContact,
    items: normalizeItems(payload.summary),
  };
};

/** Texto plano de la solicitud, para el correo y para leer el archivo de registro a simple vista. */
export const leadToText = (lead) => {
  const { contact } = lead;
  const items = lead.items.length
    ? lead.items.map((item) => `• ${item.name} (${item.categoryName} · ${item.lineName})${item.quantity > 1 ? ` ×${item.quantity}` : ""}`)
    : ["• (sin servicios en la selección)"];
  const who = [
    contact.name && `Nombre: ${contact.name}`,
    contact.phone && `Teléfono: ${contact.phone}`,
    contact.email && `Correo: ${contact.email}`,
    contact.city && `Ciudad: ${contact.city}`,
    contact.businessName && `Razón social: ${contact.businessName}`,
    contact.taxId && `RUC: ${contact.taxId}`,
    contact.notes && `Nota: ${contact.notes}`,
  ].filter(Boolean);
  const via = lead.channel === "whatsapp" ? "WhatsApp (el cliente abrió el chat desde el teléfono)" : "formulario";
  return [
    `Solicitud ${lead.id}`,
    `Recibida: ${lead.receivedAt}`,
    `Modo: ${lead.mode === "payment" ? "pedido con pago" : "cotización"} · vía ${via}`,
    lead.paymentMethod ? `Pago: ${lead.paymentMethod === "card" ? "tarjeta" : "QR bancario"}` : "",
    "",
    "Cliente",
    ...who,
    "",
    "Servicios elegidos",
    ...items,
  ]
    .filter((line, index, all) => !(line === "" && all[index - 1] === ""))
    .join("\n");
};

/** Asunto del correo: quién y cuántos servicios. */
export const leadSubject = (lead, businessName) => {
  const who = lead.contact.name || lead.contact.phone || lead.contact.email;
  const count = lead.items.length;
  return `[${businessName}] Solicitud del kiosko · ${who} · ${count} servicio${count === 1 ? "" : "s"}`;
};
