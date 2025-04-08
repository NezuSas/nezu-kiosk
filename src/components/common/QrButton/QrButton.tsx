import React from "react";
import { QRCodeSVG } from "qrcode.react";
import { v4 as uuidv4 } from "uuid";
import type { QrButtonProps } from "./QrButton.types";
import styles from "./QrButton.module.css";
import { useMediaQuery } from 'react-responsive';

const QrModal = ({
  isOpen,
  onClose,
  qrUrl,
}: {
  isOpen: boolean;
  onClose: () => void;
  qrUrl: string;
}) => {
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const isSmallMobile = useMediaQuery({ query: "(max-width: 480px)" });

  let qrSize = 500;
  if (isSmallMobile) {
    qrSize = 200;
  } else if (isTabletOrMobile) {
    qrSize = 300;
  }
  if (!isOpen) return null;


  return (
    <div
      className={styles.modalOverlay}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Cerrar"
        >
          ×
        </button>
        <div className={styles.qrContainer}>
          <h2 className={styles.qrTitle}>Escanea el código QR</h2>
          <div className={styles.qrCode}>
            <QRCodeSVG value={qrUrl} size={qrSize} level="H" />
            <div className={styles.qrStyle}>
              <img
                src="/images/logo_negro.avif"
                alt="Logo de Nezu"
                style={{ width: "80%", height: "80%" }}
              />
            </div>
          </div>
          <p className={styles.qrDescription}>
            Escanee este código QR con su dispositivo móvil para continuar con
            el proceso de pago
          </p>
        </div>
      </div>
    </div>
  );
};

export const QrButton: React.FC<
  QrButtonProps & { setSessionId: (id: string) => void }
> = ({ className = "", setSessionId }) => {
  const [state, setState] = React.useState({
    isModalOpen: false,
    isDataModalOpen: false,
    sessionId: "",
    formData: null,
  });

  const handleClick = React.useCallback(() => {
    const newSessionId = uuidv4();

    setState((prev) => ({
      ...prev,
      isModalOpen: true,
      sessionId: newSessionId,
    }));

    setSessionId(newSessionId);
  }, [setSessionId]);

  const handleCloseModal = React.useCallback(() => {
    setState((prev) => ({
      ...prev,
      isModalOpen: false,
    }));
  }, []);

  const qrUrl = React.useMemo(() => {
    if (!state.sessionId) return "";
    const baseUrl = "https://d32f-190-123-34-99.ngrok-free.app/form";
    const url = new URL(baseUrl);
    url.searchParams.append("session", state.sessionId);

    return url.toString();
  }, [state.sessionId]);

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        className={`${styles.button} ${className}`}
      >
        Continuar con el pago
      </button>
      <QrModal
        isOpen={state.isModalOpen}
        onClose={handleCloseModal}
        qrUrl={qrUrl}
      />
    </>
  );
};
