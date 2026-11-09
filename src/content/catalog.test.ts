import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { indexCatalog, validateCatalog } from "@/domain/catalog";
import { catalog } from "./catalog";

/** El catálogo publicado debe ser coherente y cada imagen que nombra debe existir en `public/`. */
describe("catálogo de NEZU", () => {
  it("is valid", () => {
    expect(validateCatalog(catalog)).toEqual([]);
  });

  it("references only images that exist in public/", () => {
    const missing = indexCatalog(catalog)
      .images()
      .filter((image) => !existsSync(resolve(process.cwd(), "public", image.replace(/^\//, ""))));
    expect(missing).toEqual([]);
  });

  it("does not reuse a service image across lines", () => {
    const seen = new Map<string, string>();
    const repeated: string[] = [];
    for (const category of catalog.categories) {
      for (const line of category.lines) {
        for (const service of line.services) {
          const owner = seen.get(service.image);
          if (owner && owner !== line.id) repeated.push(`${service.image} (${owner} y ${line.id})`);
          seen.set(service.image, line.id);
        }
      }
    }
    expect(repeated).toEqual([]);
  });
});
