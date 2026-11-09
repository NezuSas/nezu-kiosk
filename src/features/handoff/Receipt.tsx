import { forwardRef } from "react";
import type { KioskConfig } from "@/config/kiosk.config";
import type { Contact } from "@/domain/request";
import type { SelectionItem } from "@/domain/selection";
import { asset } from "@/shared/utils/asset";
import styles from "./Receipt.module.css";

export interface ReceiptProps {
  business: KioskConfig["business"];
  customer?: Contact;
  items: SelectionItem[];
  /** Total ya formateado; ausente cuando algún servicio no tiene precio. */
  total?: string;
  formatPrice: (amount: number) => string;
}

/** Comprobante para la impresora térmica; se fotografía con html2canvas, por eso no usa variables de color. */
export const Receipt = forwardRef<HTMLDivElement, ReceiptProps>(({ business, customer, items, total, formatPrice }, ref) => (
  <div ref={ref} className={styles.receipt}>
    <img src={asset(business.logoDark)} alt="" className={styles.logo} />
    <div className={styles.head}>
      <strong>{business.legalName}</strong>
      <span>{business.address}</span>
      <br />
      <span>{new Date().toLocaleString("es-EC")}</span>
    </div>
    {customer && (
      <div className={styles.customer}>
        {customer.businessName && <div>{customer.businessName}</div>}
        {customer.taxId && <div>RUC {customer.taxId}</div>}
        {customer.name && <div>{customer.name}</div>}
        {customer.email && <div>{customer.email}</div>}
      </div>
    )}
    <table className={styles.table}>
      <thead>
        <tr>
          <th>Detalle</th>
          <th>Cant.</th>
          <th>Importe</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item) => (
          <tr key={item.serviceId}>
            <td>{item.name}</td>
            <td>{item.quantity}</td>
            <td>{item.price === undefined ? "—" : formatPrice(item.price * item.quantity)}</td>
          </tr>
        ))}
      </tbody>
    </table>
    {total && (
      <div className={styles.total}>
        <span>Total</span>
        <span>{total}</span>
      </div>
    )}
    <p className={styles.foot}>
      {business.website.replace(/^https?:\/\//, "")} · {business.phoneDisplay}
    </p>
  </div>
));

Receipt.displayName = "Receipt";
