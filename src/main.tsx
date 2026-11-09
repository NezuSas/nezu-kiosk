import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./app/App";
import { applyTheme } from "./app/theme";
import { kioskConfig } from "./config/kiosk.config";
import { validateCatalog } from "./domain/catalog";
import { catalog } from "./content/catalog";

applyTheme(kioskConfig.theme);
document.title = `${kioskConfig.business.name} · Kiosk`;
document.documentElement.lang = kioskConfig.languages[0] ?? "es";

// Caché sin conexión: imágenes, fuentes y la aplicación. Solo en producción y si la configuración lo pide.
if (import.meta.env.PROD && kioskConfig.kiosk.offlineCache && "serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`).catch(() => undefined);
  });
}

if (import.meta.env.DEV) {
  validateCatalog(catalog).forEach((problem) => console.warn(`[catálogo] ${problem}`));
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
