import { fireEvent, screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { encodeSummary } from "@/domain/request";
import { renderWithKiosk } from "@/test/renderWithKiosk";
import { PhonePage } from "./PhonePage";

const summary = encodeSummary({
  items: [{ serviceId: "living-escenas", name: "Escenas por ambiente", quantity: 1, lineName: "Iluminación y escenas", categoryName: "Living" }],
});

describe("PhonePage", () => {
  it("explains when the link has no session", () => {
    renderWithKiosk(<PhonePage />, { route: "/phone" });
    expect(screen.getByText(/Este enlace venció/)).toBeInTheDocument();
  });

  it("shows the selection and a WhatsApp link with the message in quote mode", () => {
    renderWithKiosk(<PhonePage />, { route: `/phone?session=abc&s=${summary}` });
    expect(screen.getByText("Escenas por ambiente")).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("Nombre"), { target: { value: "Ana" } });
    const link = screen.getByRole("link", { name: /WhatsApp/ });
    expect(link.getAttribute("href")).toContain("wa.me/593983643383");
    expect(decodeURIComponent(link.getAttribute("href") ?? "")).toContain("Escenas por ambiente");
    expect(decodeURIComponent(link.getAttribute("href") ?? "")).toContain("Soy Ana");
  });

  it("sends the contact to the kiosk session and confirms", async () => {
    const { handoff } = renderWithKiosk(<PhonePage />, { route: `/phone?session=abc&s=${summary}` });
    fireEvent.change(screen.getByLabelText("Nombre"), { target: { value: "Ana" } });
    fireEvent.change(screen.getByLabelText("Teléfono"), { target: { value: "0991234567" } });
    fireEvent.click(screen.getByRole("button", { name: /Enviar y que me contacten/ }));
    await waitFor(() => expect(screen.getByText("Listo")).toBeInTheDocument());
    expect(handoff.submitted[0]).toMatchObject({ sessionId: "abc", contact: { name: "Ana", phone: "0991234567" }, channel: "email" });
  });

  it("asks for billing data and payment method in payment mode", () => {
    renderWithKiosk(<PhonePage />, { route: `/phone?session=abc&s=${summary}`, config: { mode: "payment" } });
    expect(screen.getByLabelText("Razón social")).toBeInTheDocument();
    expect(screen.getByLabelText("RUC")).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /WhatsApp/ })).not.toBeInTheDocument();
  });
});
