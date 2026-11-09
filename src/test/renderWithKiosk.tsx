import { render } from "@testing-library/react";
import type { ReactElement } from "react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { vi } from "vitest";
import { createKiosk, type Kiosk } from "@/app/kiosk";
import { KioskProvider } from "@/app/KioskProvider";
import { kioskConfig, resolveTexts, type KioskConfig } from "@/config/kiosk.config";
import type { HandoffChannel, PhoneSubmission } from "@/domain/request";
import { useSelectionStore } from "@/state/selectionStore";
import { useHandoffStore } from "@/state/handoffStore";

/** Canal falso: recuerda lo que el teléfono envió y permite simular su respuesta desde la prueba. */
export const fakeHandoff = () => {
  const listeners = new Map<string, (submission: PhoneSubmission) => void>();
  const submitted: PhoneSubmission[] = [];
  const channel: HandoffChannel = {
    listen: vi.fn((sessionId, onSubmission) => {
      listeners.set(sessionId, onSubmission);
      return () => listeners.delete(sessionId);
    }),
    submit: vi.fn(async (submission) => {
      submitted.push(submission);
    }),
  };
  return { channel, submitted, respond: (submission: PhoneSubmission) => listeners.get(submission.sessionId)?.(submission) };
};

export interface RenderOptions {
  route?: string;
  /** Ruta con parámetros para montar la pantalla, p. ej. `/categories/:categoryId`. */
  path?: string;
  config?: Partial<KioskConfig>;
  kiosk?: Partial<Kiosk>;
}

/** Monta una pantalla con el kiosko real (catálogo de NEZU) y adaptadores falsos, dentro de un router en memoria. */
export const renderWithKiosk = (element: ReactElement, { route = "/", path, config, kiosk }: RenderOptions = {}) => {
  useSelectionStore.getState().clear();
  useHandoffStore.getState().reset();
  const fullConfig: KioskConfig = { ...kioskConfig, ...config };
  const handoff = fakeHandoff();
  const value = createKiosk({
    config: fullConfig,
    texts: resolveTexts(fullConfig),
    handoff: handoff.channel,
    printer: { print: vi.fn(async () => undefined) },
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
  return { ...result, kiosk: value, handoff };
};
