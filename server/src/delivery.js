import { createHmac } from "node:crypto";
import { leadSubject, leadToText } from "./leads.js";

/**
 * Entregas de una solicitud al negocio. Cada entrega es `{ name, send(lead) }`; `deliverLead` las ejecuta todas y
 * devuelve qué pasó con cada una, sin que el fallo de una detenga a las demás.
 */

/** POST JSON a una URL del negocio (CRM, hoja de cálculo, automatización). Firma HMAC opcional. */
export const createWebhookDelivery = ({ url, secret = "", fetchImpl = fetch, timeoutMs = 8000 }) => ({
  name: "webhook",
  async send(lead) {
    const body = JSON.stringify(lead);
    const headers = { "Content-Type": "application/json", "User-Agent": "nezu-kiosk-server" };
    if (secret) headers["X-Kiosk-Signature"] = `sha256=${createHmac("sha256", secret).update(body).digest("hex")}`;
    const response = await fetchImpl(url, { method: "POST", headers, body, signal: AbortSignal.timeout(timeoutMs) });
    if (!response.ok) throw new Error(`webhook respondió ${response.status}`);
  },
});

/**
 * Correo con el texto de la solicitud. `transport` es cualquier objeto con `sendMail({ from, to, subject, text })`,
 * por ejemplo un transporte de nodemailer; así la prueba no necesita un servidor SMTP.
 */
export const createEmailDelivery = ({ transport, from, to, businessName }) => ({
  name: "email",
  async send(lead) {
    await transport.sendMail({
      from,
      to,
      subject: leadSubject(lead, businessName),
      text: leadToText(lead),
      ...(lead.contact.email ? { replyTo: lead.contact.email } : {}),
    });
  },
});

/** Ejecuta todas las entregas y resume el resultado: `[{ name, ok, error? }]`. */
export const deliverLead = async (lead, deliveries, log = console) => {
  const results = await Promise.all(
    deliveries.map(async (delivery) => {
      try {
        await delivery.send(lead);
        log.info(`solicitud ${lead.id}: entregada por ${delivery.name}`);
        return { name: delivery.name, ok: true };
      } catch (error) {
        log.warn(`solicitud ${lead.id}: falló ${delivery.name}: ${error.message}`);
        return { name: delivery.name, ok: false, error: error.message };
      }
    })
  );
  return results;
};

/** Construye las entregas a partir de la configuración; sin SMTP ni webhook devuelve una lista vacía. */
export const createDeliveries = async (config, { log = console } = {}) => {
  const deliveries = [];
  if (config.leadsWebhookUrl) {
    deliveries.push(createWebhookDelivery({ url: config.leadsWebhookUrl, secret: config.leadsWebhookSecret }));
  }
  if (config.smtpUrl && config.leadsEmailTo) {
    const { createTransport } = await import("nodemailer");
    deliveries.push(
      createEmailDelivery({
        transport: createTransport(config.smtpUrl),
        from: config.leadsEmailFrom || config.leadsEmailTo,
        to: config.leadsEmailTo,
        businessName: config.businessName,
      })
    );
  }
  if (deliveries.length === 0) log.warn("sin entregas configuradas: las solicitudes solo se guardan en disco");
  return deliveries;
};
