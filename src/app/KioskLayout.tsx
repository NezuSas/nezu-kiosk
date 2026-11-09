import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useKiosk } from "./kiosk";
import { useIdleReturn } from "@/shared/hooks/useIdleReturn";
import { useSelectionStore } from "@/state/selectionStore";
import { useHandoffStore } from "@/state/handoffStore";
import { asset } from "@/shared/utils/asset";
import styles from "./KioskLayout.module.css";

/**
 * Envoltorio de las pantallas del tótem: tras el tiempo de reposo vacía la selección y vuelve a la portada (o
 * muestra el vídeo de atracción si hay uno), para que el siguiente cliente no encuentre una sesión ajena.
 */
export const KioskLayout = () => {
  const { config } = useKiosk();
  const navigate = useNavigate();
  const location = useLocation();
  const clear = useSelectionStore((state) => state.clear);
  const reset = useHandoffStore((state) => state.reset);

  const idle = useIdleReturn(config.idle.returnHomeAfterSeconds, () => {
    clear();
    reset();
    if (location.pathname !== "/") navigate("/");
  });

  return (
    <>
      <Outlet />
      {idle && config.idle.attractVideo && (
        <div className={styles.attract}>
          <video autoPlay loop muted playsInline src={asset(config.idle.attractVideo)} />
        </div>
      )}
    </>
  );
};
