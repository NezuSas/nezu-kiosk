import express from "express";
import compression from "compression";
import cors from "cors";
import { createRateLimiter } from "./rateLimit.js";

/**
 * Aplicación HTTP: salud, entrada de solicitudes por HTTP (respaldo del socket) y, si se configura `staticDir`, la
 * build del kiosko con las rutas de la SPA resueltas a `index.html`. Socket.IO se monta sobre el mismo servidor en
 * `index.js`.
 */
export const createApp = ({ corsOrigin, staticDir, registry, intake, rateLimiter = createRateLimiter() }) => {
  const app = express();
  app.disable("x-powered-by");
  app.set("trust proxy", true);
  app.use(compression());
  app.use(cors({ origin: corsOrigin, methods: ["GET", "POST"] }));

  app.get("/health", (_request, response) => {
    response.json({ ok: true, sessions: registry.size });
  });

  if (intake) {
    app.post("/api/leads", rateLimiter.middleware(), express.json({ limit: "64kb" }), async (request, response) => {
      const result = await intake.receive(request.body);
      if (!result.accepted) return response.status(400).json({ ok: false, error: result.reason });
      response.status(202).json({ ok: true, id: result.lead.id });
    });
  }

  if (staticDir) {
    app.use(express.static(staticDir, { maxAge: "1y", immutable: true, index: "index.html" }));
    app.get("*", (_request, response) => response.sendFile("index.html", { root: staticDir }));
  }

  return app;
};
