import http from "node:http";
import { Server as SocketServer } from "socket.io";
import { loadConfig } from "./config.js";
import { SessionRegistry } from "./sessions.js";
import { JsonlStore, NoopStore } from "./storage.js";
import { createDeliveries } from "./delivery.js";
import { createIntake } from "./intake.js";
import { createPendingPayments } from "./pending.js";
import { createApp } from "./app.js";
import { attachRealtime } from "./realtime.js";

const config = loadConfig();
const registry = new SessionRegistry({ ttlMs: config.sessionTtlMs });
const stores = {
  leads: config.leadsDir ? new JsonlStore(config.leadsDir, "leads") : new NoopStore(),
  events: new JsonlStore(config.eventsDir, "events"),
  payments: new JsonlStore(config.paymentsDir, "payments"),
};
const deliveries = await createDeliveries(config);
const intake = createIntake({ store: stores.leads, deliveries });
const pending = createPendingPayments();

const server = http.createServer();
const io = new SocketServer(server, {
  cors: { origin: config.corsOrigin, methods: ["GET", "POST"] },
  // Tiempos holgados: el teléfono suele llegar por túnel y red móvil.
  connectTimeout: 45_000,
  pingTimeout: 60_000,
  pingInterval: 25_000,
});
const realtime = attachRealtime(io, { registry, intake, pending });

const app = createApp({
  corsOrigin: config.corsOrigin,
  staticDir: config.staticDir,
  registry,
  intake,
  stores,
  pending,
  adminToken: config.adminToken,
  notifyPayment: realtime.notifyPayment,
});
server.on("request", app);

const cleanup = setInterval(() => {
  const removed = registry.evictExpired();
  if (removed) console.info(`${removed} sesión(es) vencidas olvidadas`);
}, 30 * 60_000);
cleanup.unref();

server.listen(config.port, () => {
  console.info(`NEZU Kiosk · servidor en tiempo real en el puerto ${config.port}`);
  console.info(
    `solicitudes: ${config.leadsDir ? `guardadas en ${config.leadsDir}` : "sin guardar"}; entregas: ${
      deliveries.map((delivery) => delivery.name).join(", ") || "ninguna"
    }; eventos y pagos en ${config.dataDir}`
  );
  if (config.adminToken) console.info(`administración en http://localhost:${config.port}/admin`);
  else console.warn("ADMIN_TOKEN no configurado: /admin, /api/stats y /api/payments/confirm no funcionan");
  if (config.corsOrigin === "*") console.warn("CORS_ORIGIN=* : acota los orígenes en producción");
  if (config.staticDir) console.info(`sirviendo el kiosko desde ${config.staticDir}`);
});

const shutdown = () => {
  console.info("cerrando…");
  io.close();
  server.close(() => process.exit(0));
};
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
