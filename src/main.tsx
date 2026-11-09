import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./app/App";
import { applyTheme } from "./app/theme";
import { kioskConfig } from "./config/kiosk.config";
import { validateCatalog } from "./domain/catalog";
import { catalog } from "./content/catalog";

applyTheme(kioskConfig.theme);
document.title = `${kioskConfig.business.name} · Kiosk`;

if (import.meta.env.DEV) {
  validateCatalog(catalog).forEach((problem) => console.warn(`[catálogo] ${problem}`));
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
