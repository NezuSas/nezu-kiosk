import React from "react";
import { createPortal } from "react-dom";
import { QRCodeSVG } from "qrcode.react";
import { v4 as uuidv4 } from "uuid";
import type { QrButtonProps } from "./QrButton.types";
import styles from "./QrButton.module.css";
import { useMediaQuery } from "react-responsive";
import { asset } from "@/utils/asset";
import { kioskConfig } from "@/kiosk.config";

const { business, texts } = kioskConfig;

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

  // Rendered on <body>: the glass panels use backdrop-filter, which would otherwise trap a fixed overlay inside them.
  return createPortal(
    <div
      className={styles.modalOverlay}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="qr-title"
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
          <h2 id="qr-title" className={styles.qrTitle}>{texts.scanQrTitle}</h2>
          <div className={styles.qrCode}>
            <QRCodeSVG value={qrUrl} size={qrSize} level="H" />
            <div className={styles.qrStyle}>
              <img
                src={asset(business.logoDark)}
                alt=""
                style={{ width: "80%", height: "80%" }}
              />
            </div>
          </div>
          <p className={styles.qrDescription}>{texts.scanQrHelp}</p>
        </div>
      </div>
    </div>,
    document.body
  );
};

export const QrButton: React.FC<
  QrButtonProps & { setSessionId: (id: string) => void }
> = ({ className = "", setSessionId }) => {
  const [state, setState] = React.useState({
    isModalOpen: false,
    sessionId: "",
  });

  const handleClick = React.useCallback(() => {
    const newSessionId = uuidv4();
    setState({ isModalOpen: true, sessionId: newSessionId });
    setSessionId(newSessionId);
  }, [setSessionId]);

  const handleCloseModal = React.useCallback(() => {
    setState((prev) => ({ ...prev, isModalOpen: false }));
  }, []);

  const qrUrl = React.useMemo(() => {
    if (!state.sessionId) return "";
    const baseUrl = import.meta.env.VITE_QR_BASE_URL || `${window.location.origin}${import.meta.env.BASE_URL}form`;
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
        {texts.continueToPayment}
      </button>
      <QrModal
        isOpen={state.isModalOpen}
        onClose={handleCloseModal}
        qrUrl={qrUrl}
      />
    </>
  );
};
