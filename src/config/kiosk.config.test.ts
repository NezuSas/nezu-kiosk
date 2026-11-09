import { describe, expect, it } from "vitest";
import { kioskConfig, resolveTexts } from "./kiosk.config";
import { defaultTexts } from "./texts";

describe("texts", () => {
  it("changes the wording with the mode", () => {
    expect(defaultTexts("quote").selection.continue).toBe("Solicitar evaluación");
    expect(defaultTexts("payment").selection.continue).toBe("Continuar con el pago");
    expect(defaultTexts("payment").catalog.pricingNote).toBe("");
  });

  it("lets the config override single strings without losing the rest", () => {
    const texts = resolveTexts({ ...kioskConfig, texts: { home: { start: "Empezar" } } });
    expect(texts.home.start).toBe("Empezar");
    expect(texts.catalog.back).toBe("Volver");
  });

  it("ships NEZU in quote mode with its real contact", () => {
    expect(kioskConfig.mode).toBe("quote");
    expect(kioskConfig.business.whatsapp.replace(/\D/g, "")).toBe("593983643383");
  });
});
