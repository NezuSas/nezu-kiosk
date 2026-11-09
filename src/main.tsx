import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { kioskConfig } from "./kiosk.config";
import { asset } from "./utils/asset";

// The theme of kiosk.config.ts becomes CSS variables; the stylesheets only ever reference these.
const { theme, business } = kioskConfig;
const root = document.documentElement;
root.style.setProperty("--k-accent", theme.accent);
root.style.setProperty("--k-accent-dark", theme.accentDark);
root.style.setProperty("--k-on-accent", theme.onAccent);
root.style.setProperty("--k-highlight", theme.highlight);
root.style.setProperty("--k-bg", theme.background);
root.style.setProperty("--k-radius", `${theme.radius}px`);
root.style.setProperty("--k-bg-image", theme.backgroundImage ? `url("${asset(theme.backgroundImage)}")` : "none");
document.title = `${business.name} · Kiosk`;

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
