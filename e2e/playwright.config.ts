import { defineConfig, devices } from "@playwright/test";
import { resolve } from "node:path";

/**
 * Pruebas de extremo a extremo sobre el despliegue real: el servidor de `server/` sirve la build del kiosko
 * (STATIC_DIR) y atiende el socket, las solicitudes y la administración, todo en un solo origen, igual que en
 * Docker. Un solo worker y archivos numerados: la prueba de administración lee lo que generaron las anteriores.
 */
const PORT = 4100;
const ROOT = resolve(import.meta.dirname, "..");

export default defineConfig({
  testDir: import.meta.dirname,
  fullyParallel: false,
  workers: 1,
  retries: process.env.CI ? 1 : 0,
  timeout: 60_000,
  reporter: [["list"]],
  outputDir: resolve(ROOT, ".e2e", "results"),
  use: {
    baseURL: `http://127.0.0.1:${PORT}`,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "totem",
      use: { ...devices["Desktop Chrome"], viewport: { width: 1080, height: 1920 }, hasTouch: true, deviceScaleFactor: 1 },
    },
  ],
  webServer: {
    command: "npm run build && node server/src/index.js",
    cwd: ROOT,
    url: `http://127.0.0.1:${PORT}/health`,
    reuseExistingServer: false,
    timeout: 120_000,
    env: {
      PORT: String(PORT),
      STATIC_DIR: resolve(ROOT, "dist"),
      DATA_DIR: resolve(ROOT, ".e2e", "data"),
      ADMIN_TOKEN: "e2e-token",
      CORS_ORIGIN: "*",
      SESSION_TTL_MINUTES: "60",
    },
  },
});
