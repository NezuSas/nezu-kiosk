import { useMemo, useState, type FormEvent } from "react";
import { useSearchParams } from "react-router-dom";
import { useKiosk } from "@/app/kiosk";
import { decodeSummary, whatsAppLink, whatsAppMessage, type Contact, type PaymentMethod } from "@/domain/request";
import { asset } from "@/shared/utils/asset";
import { cn } from "@/shared/utils/cn";
import { Button } from "@/ui/primitives";
import { Icon } from "@/ui/icons/Icon";
import styles from "./PhonePage.module.css";

type Status = "editing" | "sending" | "sent" | "failed";

const emptyContact: Contact = { name: "", phone: "", email: "", city: "", notes: "", businessName: "", taxId: "" };

/**
 * Lo que abre el teléfono del cliente al escanear el QR. Muestra la selección y pide los datos; en modo
 * cotización ofrece WhatsApp con el mensaje ya escrito, en modo pago pide razón social, RUC y método de pago.
 */
export const PhonePage = () => {
  const [params] = useSearchParams();
  const { config, texts, handoff, formatPrice } = useKiosk();
  const sessionId = params.get("session");
  const summary = useMemo(() => decodeSummary(params.get("s")), [params]);
  const [contact, setContact] = useState<Contact>(emptyContact);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("qr");
  const [status, setStatus] = useState<Status>("editing");
  const quote = config.mode === "quote";
  const phoneTexts = texts.phone;

  const update = (field: keyof Contact) => (event: { target: { value: string } }) =>
    setContact((current) => ({ ...current, [field]: event.target.value }));

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!sessionId) return;
    setStatus("sending");
    try {
      await handoff.submit({ sessionId, contact, paymentMethod: quote ? undefined : paymentMethod, channel: quote ? "email" : undefined });
      setStatus("sent");
    } catch {
      setStatus("failed");
    }
  };

  const whatsapp =
    quote && config.business.whatsapp && summary
      ? whatsAppLink(config.business.whatsapp, whatsAppMessage({ businessName: config.business.name, contact, summary }))
      : null;

  const notifyKioskAndOpenWhatsApp = () => {
    if (sessionId) void handoff.submit({ sessionId, contact, channel: "whatsapp" }).catch(() => undefined);
  };

  return (
    <div className={cn(styles.page, "light")}>
      <div className={styles.inner}>
        <img src={asset(config.business.logoDark)} alt={config.business.name} className={styles.logo} />
        <h1 className={styles.title}>{phoneTexts.title}</h1>

        {!sessionId || !summary ? (
          <p className={styles.error}>{phoneTexts.invalidSession}</p>
        ) : status === "sent" ? (
          <div className={styles.done} role="status">
            <span className={styles.doneTitle}>{phoneTexts.sentTitle}</span>
            <span>{phoneTexts.sentBody}</span>
          </div>
        ) : (
          <>
            <section>
              <p className={styles.summaryTitle}>{phoneTexts.summary}</p>
              <ul className={styles.summary}>
                {summary.items.map((item) => (
                  <li key={item.serviceId}>
                    <span>
                      {item.name}
                      <small>
                        {item.categoryName} · {item.lineName}
                      </small>
                    </span>
                    <span>{item.price === undefined ? (item.quantity > 1 ? `×${item.quantity}` : "") : formatPrice(item.price * item.quantity)}</span>
                  </li>
                ))}
              </ul>
            </section>

            <form className={styles.form} onSubmit={submit}>
              <label className={styles.field}>
                <span>{phoneTexts.name}</span>
                <input className={styles.input} value={contact.name} onChange={update("name")} autoComplete="name" required />
              </label>
              <label className={styles.field}>
                <span>{phoneTexts.phone}</span>
                <input className={styles.input} type="tel" value={contact.phone} onChange={update("phone")} autoComplete="tel" required />
              </label>
              <label className={styles.field}>
                <span>{phoneTexts.email}</span>
                <input className={styles.input} type="email" value={contact.email} onChange={update("email")} autoComplete="email" required={!quote} />
              </label>
              {quote ? (
                <>
                  <label className={styles.field}>
                    <span>{phoneTexts.city}</span>
                    <input className={styles.input} value={contact.city} onChange={update("city")} autoComplete="address-level2" />
                  </label>
                  <label className={styles.field}>
                    <span>{phoneTexts.notes}</span>
                    <textarea className={styles.input} value={contact.notes} onChange={update("notes")} />
                  </label>
                </>
              ) : (
                <>
                  <label className={styles.field}>
                    <span>{phoneTexts.businessName}</span>
                    <input className={styles.input} value={contact.businessName} onChange={update("businessName")} autoComplete="organization" required />
                  </label>
                  <label className={styles.field}>
                    <span>{phoneTexts.taxId}</span>
                    <input className={styles.input} value={contact.taxId} onChange={update("taxId")} inputMode="numeric" required />
                  </label>
                  <fieldset className={styles.field}>
                    <legend>
                      <span>{phoneTexts.paymentMethod}</span>
                    </legend>
                    <div className={styles.choices}>
                      <label className={styles.choice}>
                        <input type="radio" name="payment" checked={paymentMethod === "qr"} onChange={() => setPaymentMethod("qr")} />
                        {phoneTexts.paymentQr}
                      </label>
                      <label className={styles.choice}>
                        <input type="radio" name="payment" checked={paymentMethod === "card"} onChange={() => setPaymentMethod("card")} />
                        {phoneTexts.paymentCard}
                      </label>
                    </div>
                  </fieldset>
                </>
              )}

              <div className={styles.actions}>
                {whatsapp && (
                  <a className={styles.whatsapp} href={whatsapp} target="_blank" rel="noreferrer" onClick={notifyKioskAndOpenWhatsApp}>
                    <Icon name="whatsapp" />
                    {phoneTexts.whatsapp}
                  </a>
                )}
                <Button type="submit" variant={whatsapp ? "secondary" : "primary"} block disabled={status === "sending"}>
                  {phoneTexts.send}
                </Button>
                {status === "failed" && <p className={styles.error}>{phoneTexts.invalidSession}</p>}
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
