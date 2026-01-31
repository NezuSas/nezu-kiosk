import React, { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import styles from "./PaymentOptions.module.css";
import { usePaymentStore } from "../../store/usePaymentStore";
import { QRCodeSVG } from "qrcode.react";

export const PaymentOptions: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get("session");

  const { userData, setUserData, qrCodes } = usePaymentStore();

  useEffect(() => {
    if (!userData && sessionId) {
      const storedData = JSON.parse(
        localStorage.getItem(`formData-${sessionId}`) ?? "{}"
      );
      setUserData(storedData);
    }
  }, [sessionId, userData, setUserData]);

  if (!userData) {
    return <p className={styles.error}>No se encontró una sesión activa.</p>;
  }

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className={styles.container}>
      <button className={styles.backButton} onClick={handleGoBack}>
        ← Regresar
      </button>
      <h1 className={styles.title}>Opciones de Pago</h1>

      <div className={styles.userData}>
        <p>
          <strong>Razón Social:</strong> {userData.businessName}
        </p>
        <p>
          <strong>RUC:</strong> {userData.ruc}
        </p>
        <p>
          <strong>Dirección:</strong> {userData.address}
        </p>
        <p>
          <strong>Correo:</strong> {userData.email}
        </p>
        <p>
          <strong>Método de Pago:</strong> {userData.paymentMethod}
        </p>
      </div>

      <h2 className={styles.subtitle}>
        Escanea un código QR para continuar con el pago
      </h2>

      <div className={styles.qrContainer}>
        {qrCodes.map((qr, index) => (
          <div key={index} className={styles.qrItem}>
            <div className={styles.qrWrapper}>
              <QRCodeSVG value={qr.value} size={250} level="H" />
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: "60px",
                  height: "60px",
                  backgroundColor: "white",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
                }}
              >
                <img
                  src="/images/logo_negro.avif"
                  alt="Nezu"
                  style={{ width: "70%", height: "auto" }}
                />
              </div>
            </div>
            <p className={styles.qrLabel}>{qr.label}</p>
          </div>
        ))}
      </div>
      <button className={styles.continueButton} onClick={handleContinue}>
        Continuar
      </button>
    </div>
  );
};

export default PaymentOptions;