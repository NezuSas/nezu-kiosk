import { Icon } from "@/ui/icons/Icon";
import styles from "./Footer.module.css";

export interface FooterProps {
  phone?: string;
  email?: string;
  address?: string;
  hours?: string;
  credit?: { label: string; url: string };
}

/** Pie de contacto, una línea por dato; el crédito de la plantilla es opcional y discreto. */
export const Footer = ({ phone, email, address, hours, credit }: FooterProps) => (
  <footer className={styles.footer} role="contentinfo">
    <div className={styles.row}>
      {phone && (
        <span className={styles.item}>
          <Icon name="phone" />
          {phone}
        </span>
      )}
      {email && (
        <span className={styles.item}>
          <Icon name="mail" />
          {email}
        </span>
      )}
      {address && (
        <span className={styles.item}>
          <Icon name="pin" />
          {address}
        </span>
      )}
      {hours && (
        <span className={styles.item}>
          <Icon name="clock" />
          {hours}
        </span>
      )}
    </div>
    {credit && (
      <p className={styles.credit}>
        {credit.label} · <a href={credit.url}>{credit.url.replace(/^https?:\/\//, "")}</a>
      </p>
    )}
  </footer>
);
