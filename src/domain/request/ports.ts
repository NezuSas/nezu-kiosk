import type { PhoneSubmission } from "./types";

/**
 * Canal entre el kiosko y el teléfono del cliente. El kiosko abre una sesión y espera; el teléfono envía
 * una vez. La implementación (Socket.IO, polling, etc.) vive en `infrastructure/`.
 */
export interface HandoffChannel {
  /** El kiosko se registra para recibir lo que envíe el teléfono de esta sesión. */
  listen(sessionId: string, onSubmission: (submission: PhoneSubmission) => void): () => void;
  /** El teléfono envía los datos del cliente al kiosko de la sesión. */
  submit(submission: PhoneSubmission): Promise<void>;
}

/** Impresora de comprobantes; recibe la imagen del recibo ya renderizada. */
export interface PrinterGateway {
  print(imageDataUrl: string): Promise<void>;
}
