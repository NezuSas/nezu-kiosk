import { QRCodeSVG } from "qrcode.react";
import { Navigate, useNavigate } from "react-router-dom";
import { useKiosk } from "@/app/kiosk";
import { useHandoffStore } from "@/state/handoffStore";
import { Screen } from "@/ui/layout";
import { Button } from "@/ui/primitives";
import { Icon } from "@/ui/icons/Icon";
import { KioskFooter } from "@/features/catalog/KioskFooter";
import styles from "./PaymentScreens.module.css";

/** Modo pago · el cliente eligió QR: los códigos de los bancos configurados. */
export const PaymentOptionsScreen = () => {
  const navigate = useNavigate();
  const { config, texts } = useKiosk();
  const submission = useHandoffStore((state) => state.submission);
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
      <div className={styles.actions}>
        <Button size="large" icon="check" onClick={() => navigate("/thanks")}>
          {texts.payment.continue}
        </Button>
      </div>
    </Screen>
  );
};

/** Modo pago · el cliente eligió tarjeta: sigue las instrucciones del datáfono. */
export const CardInstructionsScreen = () => {
  const navigate = useNavigate();
  const { texts } = useKiosk();
  const submission = useHandoffStore((state) => state.submission);
  if (!submission) return <Navigate to="/selection" replace />;

  return (
    <Screen title={texts.payment.cardTitle} onBack={() => navigate("/selection")} backLabel={texts.catalog.back} footer={<KioskFooter />}>
      <div className={styles.card}>
        <h2 className={styles.cardTitle}>{texts.payment.cardHelp}</h2>
        <Icon name="arrow-right" size="4rem" className={styles.arrow} style={{ transform: "rotate(90deg)" }} />
        <Button size="large" icon="check" onClick={() => navigate("/thanks")}>
          {texts.payment.continue}
        </Button>
      </div>
    </Screen>
  );
};
