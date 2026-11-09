import { describe, expect, it } from "vitest";
import { defaultTexts, isLanguage, type KioskTexts } from "./texts";
import { kioskConfig, resolveTexts } from "./kiosk.config";

const leaves = (value: unknown, path = ""): string[] =>
  typeof value === "object" && value !== null
    ? Object.entries(value).flatMap(([key, child]) => leaves(child, path ? `${path}.${key}` : key))
    : [path];

describe("languages", () => {
  it("has the same keys in Spanish and English, for both modes", () => {
    for (const mode of ["quote", "payment"] as const) {
      expect(leaves(defaultTexts(mode, "en"))).toEqual(leaves(defaultTexts(mode, "es")));
    }
  });

  it("never leaves an English string empty where Spanish has text", () => {
    const es = defaultTexts("quote", "es");
    const en = defaultTexts("quote", "en");
    for (const section of Object.keys(es) as (keyof KioskTexts)[]) {
      for (const [key, value] of Object.entries(es[section])) {
        if (value) expect((en[section] as Record<string, string>)[key], `${section}.${key}`).toBeTruthy();
      }
    }
  });

  it("applies config overrides only to the start-up language", () => {
    const config = { ...kioskConfig, languages: ["es", "en"] as const, texts: { home: { start: "Empezar" } } };
    expect(resolveTexts({ ...config, languages: [...config.languages] }, "es").home.start).toBe("Empezar");
    expect(resolveTexts({ ...config, languages: [...config.languages] }, "en").home.start).toBe("Explore");
  });

  it("recognises supported language codes", () => {
    expect(isLanguage("en")).toBe(true);
    expect(isLanguage("fr")).toBe(false);
  });
});
