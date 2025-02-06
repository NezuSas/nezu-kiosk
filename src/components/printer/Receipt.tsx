import React, { useState } from "react";
import styles from "./Receipt.module.css";
import { ReceiptData } from "../../pages/Printer/Printer.types";

interface ReceiptProps extends ReceiptData {}

const Receipt: React.FC<ReceiptProps> = ({
  orderNumber,
  customerName,
  items,
  total,
}) => {
  const [_qrLoaded, setQrLoaded] = useState(false);
  return (
    <div id="receipt" className={styles.receipt}>
      {/* Logo Nezu */}
      <div className={styles.logoContainer}>
        <img
          src="/images/logo_negro.avif"
          alt="Nezu"
          className={styles.logo}
        />
      </div>

      {/* Separador */}
      <hr className={styles.separator} />

      {/* Nombre del Cliente */}
      <p className={styles.customerName}>{customerName}</p>
      <p className={styles.customerCompany}>Nezu</p>

      {/* QR Code */}
      <div className={styles.qrContainer}>
        <img
          src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://nezu.com"
          alt="QR Code"
          className={styles.qrCode}
          onLoad={() => setQrLoaded(true)} // Espera a que el QR se cargue completamente
        />
      </div>

      {/* Número de Orden */}
      <p className={styles.orderNumber}>Orden N° {orderNumber}</p>

      {/* Separador */}
      <hr className={styles.separator} />

      {/* Tabla de Productos */}
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Descripción</th>
            <th>Cant</th>
            <th>V. Unit</th>
            <th>V. Total</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={index}>
              <td>{item.name}</td>
              <td>{item.quantity}</td>
              <td>${item.unitPrice.toFixed(2)}</td>
              <td>${(item.quantity * item.unitPrice).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Total */}
      <p className={styles.total}>
        <span className={styles.totalLabel}>Total de la compra:</span>{" "}
        <strong>${total.toFixed(2)}</strong>
      </p>

      {/* Mensaje Final */}
      <p className={styles.thankYou}>Gracias por su compra.</p>
    </div>
  );
};

export default Receipt;
