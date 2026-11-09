import { act, fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { indexCatalog } from "@/domain/catalog";
import { catalog } from "@/content/catalog";
import { useSelectionStore } from "@/state/selectionStore";
import { renderWithKiosk } from "@/test/renderWithKiosk";
import { SelectionScreen } from "./SelectionScreen";

const choose = (serviceId: string) => {
  const location = indexCatalog(catalog).service(serviceId);
  if (!location) throw new Error(serviceId);
  act(() => useSelectionStore.getState().add(location));
};

describe("SelectionScreen", () => {
  it("invites to browse when nothing is chosen", () => {
    renderWithKiosk(<SelectionScreen />, { route: "/selection" });
    expect(screen.getByText("Aún no has elegido nada")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Ver los servicios/ })).toBeInTheDocument();
  });

  it("lists the chosen services and opens the QR hand-off, which listens on a session", () => {
    const { handoff } = renderWithKiosk(<SelectionScreen />, { route: "/selection" });
    choose("living-escenas");
    choose("core-plc");
    expect(screen.getByText("Escenas por ambiente")).toBeInTheDocument();
    expect(screen.getByText("Core · Control y supervisión")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /Solicitar evaluación/ }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(handoff.channel.listen).toHaveBeenCalledTimes(1);
  });

  it("moves to the thanks screen when the phone answers in quote mode", () => {
    const { handoff } = renderWithKiosk(<SelectionScreen />, { route: "/selection" });
    choose("living-escenas");
    fireEvent.click(screen.getByRole("button", { name: /Solicitar evaluación/ }));
    const sessionId = (handoff.channel.listen as unknown as { mock: { calls: [string][] } }).mock.calls[0][0];
    act(() => handoff.respond({ sessionId, contact: { name: "Ana", phone: "099", email: "" }, channel: "whatsapp" }));
    expect(screen.getByTestId("elsewhere")).toBeInTheDocument();
  });

  it("removes a service from the list", () => {
    renderWithKiosk(<SelectionScreen />, { route: "/selection" });
    choose("living-escenas");
    fireEvent.click(screen.getByRole("button", { name: /Quitar: Escenas por ambiente/ }));
    expect(screen.getByText("Aún no has elegido nada")).toBeInTheDocument();
  });
});
