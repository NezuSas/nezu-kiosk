import type { KioskTheme } from "@/config/kiosk.config";
import { asset } from "@/shared/utils/asset";

/** Lleva los colores de la configuración a las variables CSS que usan todas las hojas de estilo. */
export const applyTheme = (theme: KioskTheme, root: HTMLElement = document.documentElement): void => {
  root.style.setProperty("--k-primary", theme.primary);
  root.style.setProperty("--k-primary-strong", theme.primaryStrong);
  root.style.setProperty("--k-on-primary", theme.onPrimary);
  root.style.setProperty("--k-signal", theme.signal);
  root.style.setProperty("--k-ink", theme.ink);
  root.style.setProperty("--k-paper", theme.paper);
  root.style.setProperty("--k-home-image", theme.homeImage ? `url("${asset(theme.homeImage)}")` : "none");
};
