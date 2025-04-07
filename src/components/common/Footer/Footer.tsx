import { type FooterProps } from "./Footer.types";
import styles from "./Footer.module.css";

export const Footer = ({
  logo,
  slogan,
  contact,
  location,
  branchName,
  className = "",
}: FooterProps) => {
  return (
    <footer className={`${styles.footer} ${className}`}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {/* Logo y Slogan */}
          <div className={styles.logoSection}>
            <img src={logo} alt="Logo" className={styles.logo} />
            <div className={styles.sucursal}>
              <p className={styles.slogan}>{slogan}</p>
              {branchName && (
                <p className={styles.branchName}>Sucursal: {branchName}</p>
              )}
            </div>
          </div>

          {/* Contacto */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Contáctanos</h3>
            <div className={styles.infoContainer}>
              <img
                src="/images/icons/email.avif"
                alt="Correo electrónico"
                className={styles.iconEmail}
                width={20}
                height={20}
              />
              <span>{contact}</span>
            </div>
          </div>

          {/* Ubicación */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Ubicación</h3>
            <div className={styles.locationContainer}>
              <img
                src="/images/icons/ubication.avif"
                alt="Ubicación"
                className={styles.icon}
                width={20}
                height={30}
              />
              <span>{location}</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
