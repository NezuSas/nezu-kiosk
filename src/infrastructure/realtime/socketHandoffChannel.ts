import { io, type Socket } from "socket.io-client";
import type { HandoffChannel, PhoneSubmission } from "@/domain/request";

/**
 * Canal kiosko ↔ teléfono sobre Socket.IO, compatible con `server/`: el kiosko emite `register_session` y el
 * teléfono emite `message`; el servidor reenvía el mensaje al socket que registró esa sesión.
 */
export const createSocketHandoffChannel = (url: string): HandoffChannel => {
  const connect = (): Socket => io(url || "/", { transports: ["websocket", "polling"] });

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
    submit(submission) {
      return new Promise((resolve, reject) => {
        const socket = connect();
        const fail = (reason: unknown) => {
          socket.disconnect();
          reject(reason instanceof Error ? reason : new Error(String(reason)));
        };
        socket.once("connect_error", fail);
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

const toSubmission = (raw: unknown): PhoneSubmission | null => {
  if (typeof raw !== "object" || raw === null) return null;
  const candidate = raw as Partial<PhoneSubmission>;
  if (typeof candidate.sessionId !== "string" || typeof candidate.contact !== "object" || candidate.contact === null) return null;
  return candidate as PhoneSubmission;
};
