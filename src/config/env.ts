/**
 * Variables de entorno con valores por defecto razonables, para que el kiosko arranque sin `.env`
 * (la demo pública funciona así). Se documentan en `.env.example`.
 */
export interface KioskEnv {
  /** Página que abre el teléfono al escanear el QR. Por defecto, este mismo sitio en `/phone`. */
  phoneUrl: string;
  /** Servidor Socket.IO que une kiosko y teléfono. Vacío = el mismo origen (proxy de Vite en desarrollo). */
  realtimeUrl: string;
  /** Servicio local de impresión térmica. */
  printerUrl: string;
}

const value = (key: string): string | undefined => {
  const raw = (import.meta.env as Record<string, string | undefined>)[key];
  return raw && raw.trim() ? raw.trim() : undefined;
};

const defaultPhoneUrl = (): string => {
  if (typeof window === "undefined") return "http://localhost:5173/phone";
  return `${window.location.origin}${import.meta.env.BASE_URL.replace(/\/$/, "")}/phone`;
};

export const env: KioskEnv = {
  phoneUrl: value("VITE_PHONE_URL") ?? value("VITE_QR_BASE_URL") ?? defaultPhoneUrl(),
  realtimeUrl: value("VITE_REALTIME_URL") ?? "",
  printerUrl: value("VITE_PRINTER_URL") ?? "http://127.0.0.1:5000/print",
};
