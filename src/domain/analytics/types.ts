/** Nombres de los eventos de uso; el servidor rechaza cualquier otro. Sin datos personales. */
export type KioskEventName =
  | "screen_view"
  | "service_added"
  | "service_removed"
  | "selection_opened"
  | "handoff_opened"
  | "idle_reset"
  | "language_changed"
  | "payment_confirmed"
  | "error";

export interface KioskEvent {
  name: KioskEventName;
  /** Ruta de la pantalla, en `screen_view` y como contexto en los demás. */
  screen?: string;
  /** Identificador de lo tocado: un servicio, un idioma, un mensaje de error acotado. */
  ref?: string;
  language?: string;
  /** Fecha ISO del evento; la pone el sumidero al registrarlo. */
  at?: string;
}

/** Puerto de métricas: registra sin bloquear y entrega en lotes cuando puede. */
export interface EventSink {
  track(event: KioskEvent): void;
  flush(): Promise<void>;
}

export const noopEventSink: EventSink = {
  track: () => undefined,
  flush: async () => undefined,
};
