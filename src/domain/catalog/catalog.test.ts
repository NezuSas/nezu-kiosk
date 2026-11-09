import { describe, expect, it } from "vitest";
import { hasPrices, indexCatalog, validateCatalog } from "./catalog";
import type { Catalog } from "./types";

const sample: Catalog = {
  categories: [
    {
      id: "hogar",
      name: "Hogar",
      tagline: "Casa",
      cover: "/c.webp",
      lines: [
        {
          id: "luz",
          name: "Luz",
          lead: "Luz",
          gallery: ["/g1.webp", "/g2.webp"],
          services: [
            { id: "escenas", name: "Escenas", summary: "s", image: "/s1.webp" },
            { id: "rutinas", name: "Rutinas", summary: "s", image: "/s2.webp", price: 90 },
          ],
        },
      ],
    },
  ],
};

describe("indexCatalog", () => {
  const index = indexCatalog(sample);

  it("finds categories, lines and services by id", () => {
    expect(index.category("hogar")?.name).toBe("Hogar");
    expect(index.line("hogar", "luz")?.name).toBe("Luz");
    expect(index.service("rutinas")?.line.id).toBe("luz");
    expect(index.service("rutinas")?.category.id).toBe("hogar");
  });

  it("returns undefined for unknown ids, including undefined params from the router", () => {
    expect(index.category(undefined)).toBeUndefined();
    expect(index.line("hogar", undefined)).toBeUndefined();
    expect(index.service("nada")).toBeUndefined();
  });

  it("lists every image once", () => {
    expect(index.images()).toEqual(["/c.webp", "/g1.webp", "/g2.webp", "/s1.webp", "/s2.webp"]);
  });
});

describe("validateCatalog", () => {
  it("accepts a well-formed catalog", () => {
    expect(validateCatalog(sample)).toEqual([]);
  });

  it("reports repeated ids across levels and empty lines", () => {
    const broken: Catalog = {
      categories: [
        {
          ...sample.categories[0],
          lines: [
            { ...sample.categories[0].lines[0], services: [] },
            { id: "hogar", name: "Otra", lead: "", gallery: [], services: [{ id: "x", name: "X", summary: "", image: "", price: -1 }] },
          ],
        },
      ],
    };
    const problems = validateCatalog(broken);
    expect(problems.some((p) => p.includes("no tiene servicios"))).toBe(true);
    expect(problems.some((p) => p.includes("repetido «hogar»"))).toBe(true);
    expect(problems.some((p) => p.includes("no tiene imágenes"))).toBe(true);
    expect(problems.some((p) => p.includes("precio inválido"))).toBe(true);
  });
});

describe("hasPrices", () => {
  it("is true when at least one service has a price", () => {
    expect(hasPrices(sample)).toBe(true);
    expect(hasPrices({ categories: [] })).toBe(false);
  });
});
