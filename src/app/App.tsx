import { useEffect } from "react";
import { BrowserRouter, useLocation } from "react-router-dom";
import type { Kiosk } from "./kiosk";
import { KioskProvider } from "./KioskProvider";
import { AppRouter } from "./router";
import "@/ui/base.css";

/** Cada cambio de ruta empieza arriba, como en una app nativa. */
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

export const App = ({ kiosk }: { kiosk?: Kiosk }) => (
  <KioskProvider kiosk={kiosk}>
    {/* BASE_URL permite servir la misma build en la raíz (Vercel) o bajo una sub-ruta (demo en GitHub Pages). */}
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <ScrollToTop />
      <AppRouter />
    </BrowserRouter>
  </KioskProvider>
);
