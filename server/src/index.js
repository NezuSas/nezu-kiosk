import http from "node:http";
import { Server as SocketServer } from "socket.io";
import { loadConfig } from "./config.js";
import { SessionRegistry } from "./sessions.js";
import { JsonlLeadStore, NoopLeadStore } from "./storage.js";
import { createDeliveries } from "./delivery.js";
import { createIntake } from "./intake.js";
import { createApp } from "./app.js";
import { attachRealtime } from "./realtime.js";

const config = loadConfig();
const registry = new SessionRegistry({ ttlMs: config.sessionTtlMs });
const store = config.leadsDir ? new JsonlLeadStore(config.leadsDir) : new NoopLeadStore();
const deliveries = await createDeliveries(config);
const intake = createIntake({ store, deliveries });

const app = createApp({ corsOrigin: config.corsOrigin, staticDir: config.staticDir, registry, intake });
const server = http.createServer(app);
const io = new SocketServer(server, {
  cors: { origin: config.corsOrigin, methods: ["GET", "POST"] },
  // Tiempos holgados: el teléfono suele llegar por túnel y red móvil.
  connectTimeout: 45_000,
  pingTimeout: 60_000,
  pingInterval: 25_000,
});

attachRealtime(io, { registry, intake });

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
    }`
  );
  if (config.staticDir) console.info(`sirviendo el kiosko desde ${config.staticDir}`);
});

const shutdown = () => {
  console.info("cerrando…");
  io.close();
  server.close(() => process.exit(0));
};
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
