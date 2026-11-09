import { act, fireEvent, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { renderWithKiosk } from "@/test/renderWithKiosk";
import { CategoriesScreen } from "@/features/catalog/CategoriesScreen";
import { PaymentOptionsScreen } from "@/features/handoff/PaymentScreens";
import { useHandoffStore } from "@/state/handoffStore";
import { ErrorBoundary } from "./ErrorBoundary";

describe("LanguageSwitch", () => {
  it("switches every text on screen and records the change", () => {
    const { tracked } = renderWithKiosk(<CategoriesScreen />, { route: "/categories" });
    expect(screen.getByText("¿Qué quieres mejorar?")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "English" }));
    expect(screen.getByText("What would you like to improve?")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /My request/ })).toBeInTheDocument();
    expect(tracked).toContainEqual(expect.objectContaining({ name: "language_changed", ref: "en" }));
  });

  it("is hidden when only one language is configured", () => {
    renderWithKiosk(<CategoriesScreen />, { route: "/categories", config: { languages: ["es"] } });
    expect(screen.queryByRole("group", { name: /Idioma/ })).not.toBeInTheDocument();
  });
});

describe("ErrorBoundary", () => {
  it("shows a way out when a screen throws and reports the error", () => {
    const Broken = () => {
      throw new Error("kaput");
    };
    const track = vi.fn();
    const spy = vi.spyOn(console, "error").mockImplementation(() => undefined);
    const texts = { languageName: "Español", offline: "", errorTitle: "Algo no salió bien", errorBody: "Vuelve.", errorAction: "Volver al inicio" };
    renderWithKiosk(
      <ErrorBoundary texts={texts} events={{ track, flush: async () => undefined }} homeHref="/">
        <Broken />
      </ErrorBoundary>
    );
    expect(screen.getByRole("alert")).toHaveTextContent("Algo no salió bien");
    expect(screen.getByRole("button", { name: /Volver al inicio/ })).toBeInTheDocument();
    expect(track).toHaveBeenCalledWith(expect.objectContaining({ name: "error", ref: expect.stringContaining("kaput") }));
    spy.mockRestore();
  });
});

describe("payment confirmation", () => {
  it("waits for the server and moves on when the payment is confirmed", () => {
    const { handoff, tracked } = renderWithKiosk(<PaymentOptionsScreen />, {
      route: "/payment",
      config: { mode: "payment" },
      // The kiosk reaches this screen after the phone answered: give it a session and a submission.
      setup: () => {
        useHandoffStore.getState().open("s-pay");
        useHandoffStore.getState().receive({ sessionId: "s-pay", contact: { name: "Ana", phone: "", email: "" }, paymentMethod: "qr" });
      },
    });
    expect(screen.getByText(/la pantalla avanza sola/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Ya pagué/ })).toBeInTheDocument();
    expect(handoff.channel.listenPayment).toHaveBeenCalledWith("s-pay", expect.any(Function));
    act(() => handoff.confirmPayment({ sessionId: "s-pay", method: "qr", reference: "DEUNA-1" }));
    expect(screen.getByTestId("elsewhere")).toBeInTheDocument();
    expect(useHandoffStore.getState().payment?.reference).toBe("DEUNA-1");
    expect(tracked).toContainEqual(expect.objectContaining({ name: "payment_confirmed", ref: "qr" }));
  });

  it("hides the manual button when the business disables it", () => {
    renderWithKiosk(<PaymentOptionsScreen />, {
      route: "/payment",
      config: { mode: "payment", payment: { bankQrCodes: [], manualConfirmation: false } },
      setup: () => {
        useHandoffStore.getState().open("s-2");
        useHandoffStore.getState().receive({ sessionId: "s-2", contact: { name: "Ana", phone: "", email: "" }, paymentMethod: "qr" });
      },
    });
    expect(screen.queryByRole("button", { name: /Ya pagué/ })).not.toBeInTheDocument();
  });
});
