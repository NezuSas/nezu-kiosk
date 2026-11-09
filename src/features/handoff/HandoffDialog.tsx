import { useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import { useKiosk } from "@/app/kiosk";
import { asset } from "@/shared/utils/asset";
import { Modal } from "@/ui/primitives";
import { useHandoffSession } from "./useHandoffSession";
import styles from "./HandoffDialog.module.css";

export interface HandoffDialogProps {
  open: boolean;
  onClose: () => void;
}

/** El código QR que lleva la selección al teléfono del cliente; se queda esperando a que el teléfono responda. */
export const HandoffDialog = ({ open, onClose }: HandoffDialogProps) => {
  const { config, texts, events } = useKiosk();
  const { url } = useHandoffSession(open);

  useEffect(() => {
    if (open) events.track({ name: "handoff_opened" });
  }, [open, events]);

  return (
    <Modal open={open} onClose={onClose} labelledBy="handoff-title" closeLabel={texts.handoff.close} light>
      <h2 id="handoff-title" className={styles.title}>
        {texts.handoff.title}
      </h2>
      <p className={styles.help}>{texts.handoff.help}</p>
      <div className={styles.qr}>
        {url && <QRCodeSVG value={url} level="H" marginSize={0} />}
        <span className={styles.logo}>
          <img src={asset(config.business.logoDark)} alt="" />
        </span>
      </div>
      <p className={styles.waiting} aria-live="polite">
        <span className={styles.dot} aria-hidden="true" />
        {texts.handoff.waiting}
      </p>
    </Modal>
  );
};
