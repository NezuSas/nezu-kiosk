import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useKiosk } from "./kiosk";
import { useIdleReturn } from "@/shared/hooks/useIdleReturn";
import { useSelectionStore } from "@/state/selectionStore";
import { useHandoffStore } from "@/state/handoffStore";
import { useLanguageStore } from "@/state/languageStore";
import { asset } from "@/shared/utils/asset";
import { ErrorBoundary } from "@/features/kiosk/ErrorBoundary";
import { OfflineBanner } from "@/features/kiosk/OfflineBanner";
import styles from "./KioskLayout.module.css";

/**
 * Envoltorio de las pantallas del tótem: registra cada pantalla vista, atrapa errores, avisa si no hay red y,
 * tras el tiempo de reposo, vacía la selección, vuelve al idioma de arranque y a la portada (o muestra el vídeo de
 * atracción si hay uno), para que el siguiente cliente no encuentre una sesión ajena.
 */
export const KioskLayout = () => {
  const { config, texts, events } = useKiosk();
  const navigate = useNavigate();
  const location = useLocation();
  const clear = useSelectionStore((state) => state.clear);
  const reset = useHandoffStore((state) => state.reset);
  const resetLanguage = useLanguageStore((state) => state.reset);
  const language = useLanguageStore((state) => state.language);

  useEffect(() => {
    events.track({ name: "screen_view", screen: location.pathname, language });
  }, [events, location.pathname, language]);

  const idle = useIdleReturn(config.idle.returnHomeAfterSeconds, () => {
    events.track({ name: "idle_reset", screen: location.pathname });
    clear();
    reset();
    resetLanguage();
    if (location.pathname !== "/") navigate("/");
  });

  return (
    <div className={styles.kiosk}>
      <ErrorBoundary texts={texts.kiosk} events={events} homeHref={import.meta.env.BASE_URL}>
        <Outlet />
      </ErrorBoundary>
      <OfflineBanner />
      {idle && config.idle.attractVideo && (
        <div className={styles.attract}>
          <video autoPlay loop muted playsInline src={asset(config.idle.attractVideo)} />
        </div>
      )}
    </div>
  );
};
