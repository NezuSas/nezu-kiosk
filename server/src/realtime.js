/**
 * Protocolo entre kiosko y teléfono, el mismo que usa `src/infrastructure/realtime/socketHandoffChannel.ts`:
 *
 * - El kiosko emite `register_session` con el id de la sesión que muestra en el QR.
 * - El teléfono emite `message` con `{ sessionId, contact, summary, … }`.
 * - El servidor reenvía ese `message` al socket del kiosko que registró esa sesión y, si hay `intake`, guarda y
 *   entrega la solicitud al negocio aunque ningún kiosko esté escuchando.
 * - Cuando el pago se confirma por `POST /api/payments/confirm`, el servidor emite `payment_confirmed` al kiosko.
 *
 * Esta función recibe un servidor de Socket.IO (o cualquier objeto con la misma forma) y no sabe nada de HTTP.
 * Devuelve `notifyPayment(confirmation)`, que la capa HTTP usa para avisar al kiosko.
 */
export const attachRealtime = (io, { registry, intake = null, log = console }) => {
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
      if (kioskSocketId) {
        io.to(kioskSocketId).emit("message", payload);
        log.info(`sesión ${sessionId}: datos del teléfono entregados al kiosko`);
      } else {
        log.warn(`message sin kiosko a la espera (sesión ${sessionId ?? "?"})`);
      }
      if (intake) {
        intake.receive(payload).catch((error) => log.warn(`solicitud de la sesión ${sessionId ?? "?"}: ${error.message}`));
      }
    });

    socket.on("disconnect", () => {
      const removed = registry.forgetSocket(socket.id);
      if (removed) log.info(`${socket.id} se desconectó; ${removed} sesión(es) olvidadas`);
    });
  });

  return {
    /** Avisa al kiosko de la sesión que su pago está confirmado. Devuelve si había un kiosko escuchando. */
    notifyPayment(confirmation) {
      const kioskSocketId = registry.kioskFor(confirmation.sessionId);
      if (!kioskSocketId) {
        log.warn(`pago confirmado sin kiosko a la espera (sesión ${confirmation.sessionId})`);
        return false;
      }
      io.to(kioskSocketId).emit("payment_confirmed", confirmation);
      log.info(`sesión ${confirmation.sessionId}: pago confirmado (${confirmation.method})`);
      return true;
    },
  };
};
