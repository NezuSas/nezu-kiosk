import { useKiosk } from "@/app/kiosk";
import { useOnline } from "@/shared/hooks/useOnline";
import styles from "./OfflineBanner.module.css";

/** Franja discreta cuando el tótem pierde la red; el catálogo sigue usable gracias a la caché. */
export const OfflineBanner = () => {
  const { texts } = useKiosk();
  const online = useOnline();
  if (online) return null;
  return (
    <div className={styles.banner} role="status">
      {texts.kiosk.offline}
    </div>
  );
};
