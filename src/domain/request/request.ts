import type { Selection } from "../selection/types";
import type { Contact, SelectionSummary } from "./types";

/** Reduce la selección a lo que cabe en un enlace: nombres, cantidades y contexto. */
export const summarizeSelection = (selection: Selection): SelectionSummary => ({
  items: selection.items.map(({ serviceId, name, quantity, lineName, categoryName, price }) => ({
    serviceId,
    name,
    quantity,
    lineName,
    categoryName,
    price,
  })),
});

/** Codifica el resumen para el parámetro de la URL del teléfono (UTF-8 seguro en base64url). */
export const encodeSummary = (summary: SelectionSummary): string => {
  const bytes = new TextEncoder().encode(JSON.stringify(summary));
  let binary = "";
  bytes.forEach((byte) => (binary += String.fromCharCode(byte)));
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
};

export const decodeSummary = (encoded: string | null): SelectionSummary | null => {
  if (!encoded) return null;
  try {
    const base64 = encoded.replace(/-/g, "+").replace(/_/g, "/");
    const binary = atob(base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "="));
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
    const parsed: unknown = JSON.parse(new TextDecoder().decode(bytes));
    if (typeof parsed !== "object" || parsed === null || !Array.isArray((parsed as SelectionSummary).items)) return null;
    return parsed as SelectionSummary;
  } catch {
    return null;
  }
};

/** Construye la URL que abre el teléfono: base configurada + sesión + resumen. */
export const phoneUrl = (base: string, sessionId: string, summary: SelectionSummary): string => {
  const url = new URL(base);
  url.searchParams.set("session", sessionId);
  url.searchParams.set("s", encodeSummary(summary));
  return url.toString();
};

export interface WhatsAppMessageInput {
  businessName: string;
  contact: Contact;
  summary: SelectionSummary;
}

/** Texto que el cliente envía por WhatsApp; el negocio lo recibe ya ordenado por línea. */
export const whatsAppMessage = ({ businessName, contact, summary }: WhatsAppMessageInput): string => {
  const lines = summary.items.map(
    (item) => `• ${item.name} (${item.lineName})${item.quantity > 1 ? ` ×${item.quantity}` : ""}`
  );
  const who = [contact.name, contact.city].filter(Boolean).join(", ");
  return [
    `Hola ${businessName}, estuve en su kiosko y me interesa:`,
    ...lines,
    "",
    who ? `Soy ${who}.` : "",
    contact.notes ? `Nota: ${contact.notes}` : "",
    "¿Podemos coordinar una evaluación?",
  ]
    .filter((line, index, all) => !(line === "" && all[index - 1] === ""))
    .join("\n");
};

/** Enlace wa.me con el mensaje precargado. El número va sin «+» ni espacios. */
export const whatsAppLink = (phone: string, message: string): string =>
  `https://wa.me/${phone.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;
