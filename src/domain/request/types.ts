import type { SelectionItem } from "../selection/types";

/**
 * Cómo termina el recorrido en el kiosko.
 * - `quote`: el cliente deja sus datos y el negocio responde con una propuesta (no hay precios).
 * - `payment`: el cliente paga en el teléfono (QR bancario o tarjeta en el datáfono).
 */
export type KioskMode = "quote" | "payment";

export type PaymentMethod = "qr" | "card";

/** Datos que el cliente escribe en su teléfono. Los opcionales dependen del modo. */
export interface Contact {
  name: string;
  phone: string;
  email: string;
  city?: string;
  notes?: string;
  /** Razón social y RUC, solo en modo pago (comprobante). */
  businessName?: string;
  taxId?: string;
}

/** Lo que el teléfono envía al kiosko a través del canal en tiempo real. */
export interface PhoneSubmission {
  sessionId: string;
  contact: Contact;
  paymentMethod?: PaymentMethod;
  /** Cómo quiere ser contactado en modo cotización. */
  channel?: "whatsapp" | "email";
}

/** Resumen de la selección que viaja al teléfono dentro del enlace del QR. */
export interface SelectionSummary {
  items: Pick<SelectionItem, "serviceId" | "name" | "quantity" | "lineName" | "categoryName" | "price">[];
}
