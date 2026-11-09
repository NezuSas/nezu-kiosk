import express from "express";
import compression from "compression";
import cors from "cors";
import { createRateLimiter } from "./rateLimit.js";
import { normalizeEvents, summarizeStats } from "./events.js";
import { authorize, normalizePaymentConfirmation } from "./payments.js";

/** Cabeceras de seguridad básicas sin dependencias: el kiosko y el teléfono son páginas propias. */
const securityHeaders = (_request, response, next) => {
  response.set("X-Content-Type-Options", "nosniff");
  response.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.set("X-Frame-Options", "SAMEORIGIN");
  response.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  next();
};

/**
 * Aplicación HTTP: salud, entrada de solicitudes y eventos, confirmación de pagos, estadísticas y, si se configura
 * `staticDir`, la build del kiosko con las rutas de la SPA resueltas a `index.html`. Socket.IO se monta sobre el
 * mismo servidor en `index.js`.
 */
export const createApp = ({
  corsOrigin,
  staticDir,
  registry,
  intake = null,
  stores = null,
  adminToken = "",
  notifyPayment = null,
  log = console,
  rateLimiter = createRateLimiter(),
  eventsLimiter = createRateLimiter({ limit: 120, windowMs: 60_000 }),
}) => {
  const app = express();
  app.disable("x-powered-by");
  app.set("trust proxy", true);
  app.use(securityHeaders);
  app.use(compression());
  app.use(cors({ origin: corsOrigin, methods: ["GET", "POST"], allowedHeaders: ["Content-Type", "Authorization"] }));

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

  if (stores) {
    app.post("/api/events", eventsLimiter.middleware(), express.json({ limit: "64kb" }), async (request, response) => {
      const events = normalizeEvents(request.body);
      for (const event of events) await stores.events.save(event, new Date(event.receivedAt));
      response.status(202).json({ ok: true, accepted: events.length });
    });

    app.post("/api/payments/confirm", authorize(adminToken), express.json({ limit: "16kb" }), async (request, response) => {
      const confirmation = normalizePaymentConfirmation(request.body);
      if (!confirmation) return response.status(400).json({ ok: false, error: "invalid" });
      await stores.payments.save(confirmation);
      const delivered = notifyPayment ? notifyPayment(confirmation) : false;
      response.status(202).json({ ok: true, id: confirmation.id, kioskNotified: delivered });
    });

    app.get("/api/stats", authorize(adminToken), async (_request, response) => {
      try {
        response.json({ ok: true, ...(await summarizeStats(stores)) });
      } catch (error) {
        log.warn(`stats: ${error.message}`);
        response.status(500).json({ ok: false, error: "stats_failed" });
      }
    });
  }

  if (staticDir) {
    app.use(express.static(staticDir, { maxAge: "1y", immutable: true, index: "index.html" }));
    app.get("*", (_request, response) => response.sendFile("index.html", { root: staticDir }));
  }

  return app;
};
