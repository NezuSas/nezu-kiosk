import { type FooterProps } from "./Footer.types";
import styles from "./Footer.module.css";
import { asset } from "@/utils/asset";
import { kioskConfig } from "@/kiosk.config";

const { texts, credit } = kioskConfig;

export const Footer = ({
  logo,
  slogan,
  contact,
  location,
  className = "",
}: FooterProps) => {
  return (
    <footer className={`${styles.footer} ${className}`} role="contentinfo">
      <div className={styles.container}>
        <div className={styles.grid}>
          <div className={styles.logoSection}>
            <img src={logo} alt="Logo" className={styles.logo} />
            <div className={styles.sucursal}>
              <p className={styles.slogan}>{slogan}</p>
            </div>
          </div>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>{texts.contactTitle}</h3>
            <div className={styles.infoContainer}>
              <img
                src={asset("/images/brand/icons/email.avif")}
                alt=""
                className={styles.iconEmail}
                width={20}
                height={20}
              />
              <span>{contact}</span>
            </div>
          </div>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>{texts.locationTitle}</h3>
            <div className={styles.locationContainer}>
              <img
                src={asset("/images/brand/icons/ubication.avif")}
                alt=""
                className={styles.icon}
                width={20}
                height={30}
              />
              <span>{location}</span>
            </div>
          </div>
        </div>
        {credit.show && (
          <p className={styles.credit}>
            {credit.label} · <span className={styles.creditUrl}>{credit.url.replace(/^https?:\/\//, "")}</span>
          </p>
        )}
      </div>
    </footer>
  );
};
