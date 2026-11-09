import { io, type Socket } from "socket.io-client";
import type { HandoffChannel, PaymentConfirmation, PhoneSubmission } from "@/domain/request";

/**
 * Canal kiosko ↔ teléfono sobre Socket.IO, compatible con `server/`: el kiosko emite `register_session` y el
 * teléfono emite `message`; el servidor reenvía el mensaje al socket que registró esa sesión y, además, guarda y
 * entrega la solicitud al negocio. Si el socket no conecta, el teléfono envía la misma solicitud por HTTP a
 * `POST /api/leads`, para que no se pierda aunque el kiosko esté apagado.
 */
export const createSocketHandoffChannel = (url: string): HandoffChannel => {
  const connect = (): Socket => io(url || "/", { transports: ["websocket", "polling"], timeout: 6000 });
  const leadsEndpoint = `${url.replace(/\/$/, "")}/api/leads`;

  const submitOverHttp = async (submission: PhoneSubmission): Promise<void> => {
    const response = await fetch(leadsEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(submission),
    });
    if (!response.ok) throw new Error(`El servidor respondió ${response.status}.`);
  };

  return {
    listen(sessionId, onSubmission) {
      const socket = connect();
      socket.emit("register_session", sessionId);
      socket.on("message", (raw: unknown) => {
        const submission = toSubmission(raw);
        if (submission && submission.sessionId === sessionId) onSubmission(submission);
      });
      return () => {
        socket.off("message");
        socket.disconnect();
      };
    },
    listenPayment(sessionId, onConfirmed) {
      const socket = connect();
      socket.emit("register_session", sessionId);
      socket.on("payment_confirmed", (raw: unknown) => {
        const confirmation = toConfirmation(raw);
        if (confirmation && confirmation.sessionId === sessionId) onConfirmed(confirmation);
      });
      return () => {
        socket.off("payment_confirmed");
        socket.disconnect();
      };
    },
    submit(submission) {
      return new Promise((resolve, reject) => {
        const socket = connect();
        socket.once("connect_error", () => {
          socket.disconnect();
          submitOverHttp(submission).then(resolve, reject);
        });
        socket.once("connect", () => {
          socket.emit("message", submission);
          // Give the frame time to leave before closing; Socket.IO flushes synchronously but the transport may not.
          setTimeout(() => {
            socket.disconnect();
            resolve();
          }, 150);
        });
      });
    },
  };
};

const toConfirmation = (raw: unknown): PaymentConfirmation | null => {
  if (typeof raw !== "object" || raw === null) return null;
  const candidate = raw as Partial<PaymentConfirmation>;
  if (typeof candidate.sessionId !== "string") return null;
  return { sessionId: candidate.sessionId, method: candidate.method ?? "other", reference: candidate.reference, amount: candidate.amount };
};

const toSubmission = (raw: unknown): PhoneSubmission | null => {
  if (typeof raw !== "object" || raw === null) return null;
  const candidate = raw as Partial<PhoneSubmission>;
  if (typeof candidate.sessionId !== "string" || typeof candidate.contact !== "object" || candidate.contact === null) return null;
  return candidate as PhoneSubmission;
};
