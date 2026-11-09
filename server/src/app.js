import express from "express";
import compression from "compression";
import cors from "cors";

/**
 * Aplicación HTTP: comprobación de salud y, si se configura `staticDir`, la build del kiosko con las rutas de la
 * SPA resueltas a `index.html`. Socket.IO se monta sobre el mismo servidor en `index.js`.
 */
export const createApp = ({ corsOrigin, staticDir, registry }) => {
  const app = express();
  app.disable("x-powered-by");
  app.use(compression());
  app.use(cors({ origin: corsOrigin, methods: ["GET", "POST"] }));

  app.get("/health", (_request, response) => {
    response.json({ ok: true, sessions: registry.size });
  });

  if (staticDir) {
    app.use(express.static(staticDir, { maxAge: "1y", immutable: true, index: "index.html" }));
    app.get("*", (_request, response) => response.sendFile("index.html", { root: staticDir }));
  }

  return app;
};
