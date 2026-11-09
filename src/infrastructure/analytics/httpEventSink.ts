import type { EventSink, KioskEvent } from "@/domain/analytics";

export interface HttpEventSinkOptions {
  /** Origen del servidor; vacío = el mismo origen. */
  url: string;
  kioskId: string;
  /** Cada cuántos milisegundos se envía lo acumulado. */
  intervalMs?: number;
  /** Tamaño de lote que fuerza un envío inmediato. */
  batchSize?: number;
  /** Máximo de eventos retenidos si el servidor no responde; los más antiguos se descartan. */
  maxQueue?: number;
  fetchImpl?: typeof fetch;
  now?: () => Date;
}

/**
 * Envía los eventos de uso a `POST /api/events` en lotes. Nunca lanza ni bloquea la interfaz: si el servidor no
 * está, los eventos esperan en memoria (acotados) y se reintentan en el siguiente ciclo. Al ocultarse la página
 * intenta un último envío con `sendBeacon`.
 */
export const createHttpEventSink = ({
  url,
  kioskId,
  intervalMs = 8000,
  batchSize = 20,
  maxQueue = 200,
  fetchImpl = typeof fetch === "function" ? fetch.bind(globalThis) : undefined,
  now = () => new Date(),
}: HttpEventSinkOptions): EventSink => {
  const endpoint = `${url.replace(/\/$/, "")}/api/events`;
  let queue: KioskEvent[] = [];
  let timer: ReturnType<typeof setTimeout> | null = null;
  let sending = false;

  const schedule = () => {
    if (timer || typeof setTimeout !== "function") return;
    timer = setTimeout(() => {
      timer = null;
      void flush();
    }, intervalMs);
  };

  const flush = async () => {
    if (sending || queue.length === 0 || !fetchImpl) return;
    const batch = queue.slice(0, 50);
    sending = true;
    try {
      const response = await fetchImpl(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kioskId, events: batch }),
        keepalive: true,
      });
      if (response.ok) queue = queue.slice(batch.length);
    } catch {
      // Sin red: los eventos se quedan en la cola y se reintentan en el siguiente ciclo.
    } finally {
      sending = false;
      if (queue.length > 0) schedule();
    }
  };

  if (typeof window !== "undefined" && typeof navigator !== "undefined" && "sendBeacon" in navigator) {
    window.addEventListener("pagehide", () => {
      if (queue.length === 0) return;
      const body = JSON.stringify({ kioskId, events: queue.slice(0, 50) });
      if (navigator.sendBeacon(endpoint, new Blob([body], { type: "application/json" }))) queue = queue.slice(50);
    });
  }

  return {
    track(event) {
      queue.push({ ...event, at: event.at ?? now().toISOString() });
      if (queue.length > maxQueue) queue = queue.slice(queue.length - maxQueue);
      if (queue.length >= batchSize) void flush();
      else schedule();
    },
    flush,
  };
};
