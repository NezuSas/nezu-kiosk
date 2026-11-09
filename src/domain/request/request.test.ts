import { describe, expect, it } from "vitest";
import type { Selection } from "../selection/types";
import { decodeSummary, encodeSummary, phoneUrl, summarizeSelection, whatsAppLink, whatsAppMessage } from "./request";

const selection: Selection = {
  items: [
    { serviceId: "a", name: "Escenas por ambiente", image: "/a.webp", quantity: 1, categoryId: "living", categoryName: "Living", lineId: "luz", lineName: "Iluminación" },
    { serviceId: "b", name: "Cámaras IP", image: "/b.webp", quantity: 2, categoryId: "living", categoryName: "Living", lineId: "seg", lineName: "Seguridad", price: 120 },
  ],
};

describe("summary encoding", () => {
  it("round-trips through the URL-safe encoding, accents included", () => {
    const summary = summarizeSelection(selection);
    const encoded = encodeSummary(summary);
    expect(encoded).toMatch(/^[A-Za-z0-9_-]+$/);
    expect(decodeSummary(encoded)).toEqual(summary);
  });

  it("drops the image from the summary to keep the link short", () => {
    expect(JSON.stringify(summarizeSelection(selection))).not.toContain("webp");
  });

  it("rejects garbage", () => {
    expect(decodeSummary(null)).toBeNull();
    expect(decodeSummary("%%%")).toBeNull();
    expect(decodeSummary(btoa('{"x":1}'))).toBeNull();
  });

  it("builds the phone URL with session and summary", () => {
    const url = new URL(phoneUrl("https://kiosk.example.com/phone", "abc", summarizeSelection(selection)));
    expect(url.pathname).toBe("/phone");
    expect(url.searchParams.get("session")).toBe("abc");
    expect(decodeSummary(url.searchParams.get("s"))?.items).toHaveLength(2);
  });
});

describe("whatsapp", () => {
  it("writes one line per chosen service with its line and quantity", () => {
    const message = whatsAppMessage({
      businessName: "NEZU",
      contact: { name: "Ana", phone: "", email: "", city: "Cuenca", notes: "Casa de dos pisos" },
      summary: summarizeSelection(selection),
    });
    expect(message).toContain("Hola NEZU");
    expect(message).toContain("• Escenas por ambiente (Iluminación)");
    expect(message).toContain("• Cámaras IP (Seguridad) ×2");
    expect(message).toContain("Soy Ana, Cuenca.");
    expect(message).toContain("Nota: Casa de dos pisos");
  });

  it("keeps only digits in the wa.me number and encodes the text", () => {
    const link = whatsAppLink("+593 98 364 3383", "Hola á");
    expect(link.startsWith("https://wa.me/593983643383?text=")).toBe(true);
    expect(link).toContain(encodeURIComponent("Hola á"));
  });
});
