// Construye la demo pública en docs/, que GitHub Pages sirve desde la rama main bajo /nezu-kiosk/.
// Copia index.html como 404.html para que las rutas profundas de la SPA carguen la aplicación.
import { build } from "vite";
import { copyFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const base = process.env.DEMO_BASE ?? "/nezu-kiosk/";
const outDir = resolve(import.meta.dirname, "..", "docs");

await build({ base, build: { outDir, emptyOutDir: true }, logLevel: "warn" });
copyFileSync(resolve(outDir, "index.html"), resolve(outDir, "404.html"));
writeFileSync(resolve(outDir, ".nojekyll"), "");
console.log(`demo construida en docs/ con base ${base}`);
