import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useSelectionStore } from "@/state/selectionStore";
import { renderWithKiosk } from "@/test/renderWithKiosk";
import { LineScreen } from "./LineScreen";

const mount = (mode: "quote" | "payment") =>
  renderWithKiosk(<LineScreen />, {
    route: "/categories/living/iluminacion",
    path: "/categories/:categoryId/:lineId",
    config: { mode },
  });

describe("LineScreen", () => {
  it("shows the line, its services and the pricing note in quote mode", () => {
    mount("quote");
    expect(screen.getByRole("heading", { level: 2, name: "Iluminación y escenas" })).toBeInTheDocument();
    expect(screen.getByText("Escenas por ambiente")).toBeInTheDocument();
    expect(screen.getByText(/se cotiza tras una evaluación/)).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: /Añadir a mi solicitud/ })).toHaveLength(3);
  });

  it("toggles a service in quote mode and updates the badge", () => {
    mount("quote");
    const [add] = screen.getAllByRole("button", { name: /Añadir a mi solicitud/ });
    fireEvent.click(add);
    expect(useSelectionStore.getState().selection.items.map((item) => item.serviceId)).toEqual(["living-escenas"]);
    expect(screen.getByRole("button", { name: /Mi solicitud/ })).toHaveTextContent("1");
    fireEvent.click(screen.getByRole("button", { name: /Añadido/ }));
    expect(useSelectionStore.getState().selection.items).toEqual([]);
  });

  it("adds units instead of toggling in payment mode", () => {
    mount("payment");
    const [add] = screen.getAllByRole("button", { name: /^Añadir$/ });
    fireEvent.click(add);
    fireEvent.click(screen.getByRole("button", { name: /Añadido/ }));
    expect(useSelectionStore.getState().selection.items[0].quantity).toBe(2);
    expect(screen.getByText("×2")).toBeInTheDocument();
  });

  it("redirects when the line does not exist", () => {
    renderWithKiosk(<LineScreen />, { route: "/categories/living/nada", path: "/categories/:categoryId/:lineId" });
    expect(screen.getByTestId("elsewhere")).toBeInTheDocument();
  });
});
