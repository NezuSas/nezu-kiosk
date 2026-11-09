import { useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Navigate, useNavigate } from "react-router-dom";
import { useKiosk } from "@/app/kiosk";
import { useHandoffStore } from "@/state/handoffStore";
import { Screen } from "@/ui/layout";
import { Button } from "@/ui/primitives";
import { Icon } from "@/ui/icons/Icon";
import { KioskFooter } from "@/features/catalog/KioskFooter";
import styles from "./PaymentScreens.module.css";

/**
 * Espera la confirmación del pago que el servidor emite cuando la pasarela, la caja o el mostrador la registran
 * (`POST /api/payments/confirm`); al llegar, guarda la referencia y salta a la pantalla final.
 */
const usePaymentConfirmation = () => {
  const navigate = useNavigate();
  const { handoff, events } = useKiosk();
  const sessionId = useHandoffStore((state) => state.sessionId);
  const confirmPayment = useHandoffStore((state) => state.confirmPayment);
  useEffect(() => {
    if (!sessionId) return;
    return handoff.listenPayment(sessionId, (confirmation) => {
      confirmPayment(confirmation);
      events.track({ name: "payment_confirmed", ref: confirmation.method });
      navigate("/thanks");
    });
  }, [sessionId, handoff, confirmPayment, events, navigate]);
};

const WaitingNote = ({ manual, onManual }: { manual: boolean; onManual: () => void }) => {
  const { texts } = useKiosk();
  return (
    <div className={styles.actions}>
      <p className={styles.waiting} aria-live="polite">
        <span className={styles.dot} aria-hidden="true" />
        {texts.payment.waitingConfirmation}
      </p>
      {manual && (
        <Button size="large" variant="secondary" icon="check" onClick={onManual}>
          {texts.payment.continue}
        </Button>
      )}
    </div>
  );
};

/** Modo pago · el cliente eligió QR: los códigos de los bancos configurados. */
export const PaymentOptionsScreen = () => {
  const navigate = useNavigate();
  const { config, texts } = useKiosk();
  const submission = useHandoffStore((state) => state.submission);
  usePaymentConfirmation();
  if (!submission) return <Navigate to="/selection" replace />;

  return (
    <Screen title={texts.payment.optionsTitle} onBack={() => navigate("/selection")} backLabel={texts.catalog.back} footer={<KioskFooter />}>
      <p className={styles.intro}>{texts.payment.optionsHelp}</p>
      <div className={styles.banks}>
        {config.payment.bankQrCodes.map((bank) => (
          <div key={bank.url} className={styles.bank}>
            <QRCodeSVG value={bank.url} level="M" marginSize={1} />
            <span className={styles.bankName}>{bank.label}</span>
          </div>
        ))}
      </div>
      <WaitingNote manual={config.payment.manualConfirmation} onManual={() => navigate("/thanks")} />
    </Screen>
  );
};

/** Modo pago · el cliente eligió tarjeta: sigue las instrucciones del datáfono. */
export const CardInstructionsScreen = () => {
  const navigate = useNavigate();
  const { config, texts } = useKiosk();
  const submission = useHandoffStore((state) => state.submission);
  usePaymentConfirmation();
  if (!submission) return <Navigate to="/selection" replace />;

  return (
    <Screen title={texts.payment.cardTitle} onBack={() => navigate("/selection")} backLabel={texts.catalog.back} footer={<KioskFooter />}>
      <div className={styles.card}>
        <h2 className={styles.cardTitle}>{texts.payment.cardHelp}</h2>
        <Icon name="arrow-right" size="4rem" className={styles.arrow} style={{ transform: "rotate(90deg)" }} />
      </div>
      <WaitingNote manual={config.payment.manualConfirmation} onManual={() => navigate("/thanks")} />
    </Screen>
  );
};
