import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

/**
 * Tras `seconds` sin tocar la pantalla llama a `onIdle` y marca el estado como inactivo; cualquier toque lo
 * reinicia. Con `seconds <= 0` no hace nada. Devuelve si el kiosko está en reposo y la función que despierta.
 */
export const useIdleReturn = (seconds: number, onIdle: () => void) => {
  const location = useLocation();
  const [idle, setIdle] = useState(false);
  const timer = useRef<number | null>(null);
  const callback = useRef(onIdle);
  useEffect(() => {
    callback.current = onIdle;
  });

  useEffect(() => {
    if (seconds <= 0) return;
    const arm = () => {
      if (timer.current) window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => {
        setIdle(true);
        callback.current();
      }, seconds * 1000);
    };
    const wake = () => {
      setIdle(false);
      arm();
    };
    arm();
    const events: (keyof WindowEventMap)[] = ["pointerdown", "keydown", "touchstart"];
    events.forEach((event) => window.addEventListener(event, wake, { passive: true }));
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
      events.forEach((event) => window.removeEventListener(event, wake));
    };
  }, [seconds, location.pathname]);

  return idle;
};
