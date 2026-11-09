import { create } from "zustand";
import type { PaymentConfirmation, PhoneSubmission } from "@/domain/request";

interface HandoffState {
  /** Sesión abierta por el kiosko al mostrar el QR; `null` cuando no hay ninguna. */
  sessionId: string | null;
  /** Lo último que envió el teléfono, para la pantalla de pago o de agradecimiento. */
  submission: PhoneSubmission | null;
  /** Confirmación del pago recibida del servidor, para la pantalla final. */
  payment: PaymentConfirmation | null;
  open: (sessionId: string) => void;
  receive: (submission: PhoneSubmission) => void;
  confirmPayment: (confirmation: PaymentConfirmation) => void;
  reset: () => void;
}

/** Estado del traspaso al teléfono. Vive en memoria: una sesión no debe sobrevivir a un reinicio del kiosko. */
export const useHandoffStore = create<HandoffState>()((set) => ({
  sessionId: null,
  submission: null,
  payment: null,
  open: (sessionId) => set({ sessionId, submission: null, payment: null }),
  receive: (submission) => set({ submission }),
  confirmPayment: (confirmation) => set({ payment: confirmation }),
  reset: () => set({ sessionId: null, submission: null, payment: null }),
}));
