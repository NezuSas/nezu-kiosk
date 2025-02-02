import React from 'react';
import { Mail, MapPin } from 'lucide-react';
import type { FooterProps } from './Footer.types';
import styles from './Footer.module.css';

export const Footer: React.FC<FooterProps> = ({
  logo,
  slogan,
  contact,
  location,
  branchName,
  className = '',
}) => {
  return (
    <footer className={`${styles.footer} ${className}`}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {/* Logo y Slogan */}
          <div className={styles.logoSection}>
            <img 
              src={logo} 
              alt="Logo"
              className={styles.logo}
            />
            <div className={styles.sucursal}>
            <p className={styles.slogan}>
              {slogan}
            </p>
            {branchName && (
              <p className={styles.branchName}>
                Sucursal: {branchName}
              </p>
            )}
            </div>
          </div>

          {/* Contacto */}
          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>Contáctanos</h4>
            <div className={styles.infoContainer}>
              <Mail className={styles.icon} />
              <span>{contact}</span>
            </div>
          </div>

          {/* Ubicación */}
          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>Ubicación</h4>
            <div className={styles.locationContainer}>
              <MapPin className={styles.icon} />
              <span>{location}</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};