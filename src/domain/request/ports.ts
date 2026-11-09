import type { PaymentConfirmation, PhoneSubmission } from "./types";

/**
 * Canal entre el kiosko, el teléfono del cliente y el servidor. El kiosko abre una sesión y espera; el teléfono
 * envía una vez; el servidor avisa cuando el pago se confirma. La implementación (Socket.IO con respaldo HTTP)
 * vive en `infrastructure/`.
 */
export interface HandoffChannel {
  /** El kiosko se registra para recibir lo que envíe el teléfono de esta sesión. */
  listen(sessionId: string, onSubmission: (submission: PhoneSubmission) => void): () => void;
  /** El kiosko espera la confirmación del pago de esta sesión (modo pago). */
  listenPayment(sessionId: string, onConfirmed: (confirmation: PaymentConfirmation) => void): () => void;
  /** El teléfono envía los datos del cliente al kiosko de la sesión y al negocio. */
  submit(submission: PhoneSubmission): Promise<void>;
}

/** Impresora de comprobantes; recibe la imagen del recibo ya renderizada. */
export interface PrinterGateway {
  print(imageDataUrl: string): Promise<void>;
}
