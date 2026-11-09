import { render } from "@testing-library/react";
import type { ReactElement } from "react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { vi } from "vitest";
import { createKiosk, type Kiosk } from "@/app/kiosk";
import { KioskProvider } from "@/app/KioskProvider";
import { kioskConfig, type KioskConfig } from "@/config/kiosk.config";
import type { KioskEvent } from "@/domain/analytics";
import type { HandoffChannel, PaymentConfirmation, PhoneSubmission } from "@/domain/request";
import { useSelectionStore } from "@/state/selectionStore";
import { useHandoffStore } from "@/state/handoffStore";
import { useLanguageStore } from "@/state/languageStore";

/** Canal falso: recuerda lo que el teléfono envió y permite simular su respuesta y la confirmación del pago. */
export const fakeHandoff = () => {
  const listeners = new Map<string, (submission: PhoneSubmission) => void>();
  const paymentListeners = new Map<string, (confirmation: PaymentConfirmation) => void>();
  const submitted: PhoneSubmission[] = [];
  const channel: HandoffChannel = {
    listen: vi.fn((sessionId, onSubmission) => {
      listeners.set(sessionId, onSubmission);
      return () => listeners.delete(sessionId);
    }),
    listenPayment: vi.fn((sessionId, onConfirmed) => {
      paymentListeners.set(sessionId, onConfirmed);
      return () => paymentListeners.delete(sessionId);
    }),
    submit: vi.fn(async (submission) => {
      submitted.push(submission);
    }),
  };
  return {
    channel,
    submitted,
    respond: (submission: PhoneSubmission) => listeners.get(submission.sessionId)?.(submission),
    confirmPayment: (confirmation: PaymentConfirmation) => paymentListeners.get(confirmation.sessionId)?.(confirmation),
  };
};

export interface RenderOptions {
  route?: string;
  /** Ruta con parámetros para montar la pantalla, p. ej. `/categories/:categoryId`. */
  path?: string;
  config?: Partial<KioskConfig>;
  kiosk?: Partial<Kiosk>;
  /** Prepara los stores después del reinicio y antes de montar (p. ej. una sesión de pago abierta). */
  setup?: () => void;
}

/** Monta una pantalla con el kiosko real (catálogo de NEZU) y adaptadores falsos, dentro de un router en memoria. */
export const renderWithKiosk = (element: ReactElement, { route = "/", path, config, kiosk, setup }: RenderOptions = {}) => {
  useSelectionStore.getState().clear();
  useHandoffStore.getState().reset();
  useLanguageStore.getState().reset();
  setup?.();
  const fullConfig: KioskConfig = { ...kioskConfig, ...config };
  const handoff = fakeHandoff();
  const tracked: KioskEvent[] = [];
  const value = createKiosk({
    config: fullConfig,
    handoff: handoff.channel,
    printer: { print: vi.fn(async () => undefined) },
    events: { track: (event) => tracked.push(event), flush: async () => undefined },
    phoneUrl: "https://kiosk.test/phone",
    ...kiosk,
  });
  const result = render(
    <KioskProvider kiosk={value}>
      <MemoryRouter initialEntries={[route]}>
        <Routes>
          <Route path={path ?? route.split("?")[0]} element={element} />
          <Route path="*" element={<div data-testid="elsewhere" />} />
        </Routes>
      </MemoryRouter>
    </KioskProvider>
  );
  return { ...result, kiosk: value, handoff, tracked };
};
