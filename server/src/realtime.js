/**
 * Protocolo entre kiosko y teléfono, el mismo que usa `src/infrastructure/realtime/socketHandoffChannel.ts`:
 *
 * - El kiosko emite `register_session` con el id de la sesión que muestra en el QR.
 * - El teléfono emite `message` con `{ sessionId, contact, … }`.
 * - El servidor reenvía ese `message` solo al socket del kiosko que registró esa sesión.
 *
 * Esta función recibe un servidor de Socket.IO (o cualquier objeto con la misma forma) y no sabe nada de HTTP.
 */
export const attachRealtime = (io, { registry, log = console }) => {
  io.on("connection", (socket) => {
    socket.on("register_session", (sessionId) => {
      if (registry.register(sessionId, socket.id)) {
        log.info(`sesión ${sessionId} registrada por ${socket.id}`);
      } else {
        log.warn(`register_session ignorado: id inválido desde ${socket.id}`);
      }
    });

    socket.on("message", (payload) => {
      const sessionId = payload && typeof payload === "object" ? payload.sessionId : undefined;
      const kioskSocketId = typeof sessionId === "string" ? registry.kioskFor(sessionId) : undefined;
      if (!kioskSocketId) {
        log.warn(`message sin kiosko a la espera (sesión ${sessionId ?? "?"})`);
        return;
      }
      io.to(kioskSocketId).emit("message", payload);
      log.info(`sesión ${sessionId}: datos del teléfono entregados al kiosko`);
    });

    socket.on("disconnect", () => {
      const removed = registry.forgetSocket(socket.id);
      if (removed) log.info(`${socket.id} se desconectó; ${removed} sesión(es) olvidadas`);
    });
  });
};
