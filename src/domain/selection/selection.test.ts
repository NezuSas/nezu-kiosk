import { describe, expect, it } from "vitest";
import type { ServiceLocation } from "../catalog/catalog";
import { addService, countItems, emptySelection, hasService, removeService, setQuantity, totalOf } from "./selection";

const location = (id: string, price?: number): ServiceLocation => ({
  category: { id: "c", name: "Cat", tagline: "", cover: "", lines: [] },
  line: { id: "l", name: "Línea", lead: "", gallery: [], services: [] },
  service: { id, name: id.toUpperCase(), summary: "", image: `/${id}.webp`, price },
});

describe("selection", () => {
  it("adds a service with its context and increments on repeat", () => {
    let selection = addService(emptySelection(), location("a", 10));
    expect(selection.items[0]).toMatchObject({ serviceId: "a", name: "A", quantity: 1, categoryName: "Cat", lineName: "Línea" });
    selection = addService(selection, location("a", 10));
    expect(selection.items).toHaveLength(1);
    expect(selection.items[0].quantity).toBe(2);
    expect(countItems(selection)).toBe(2);
    expect(hasService(selection, "a")).toBe(true);
  });

  it("removes when quantity drops to zero", () => {
    const selection = setQuantity(addService(emptySelection(), location("a", 10)), "a", 0);
    expect(selection.items).toEqual([]);
    expect(removeService(selection, "missing").items).toEqual([]);
  });

  it("totals priced items and refuses to total when a price is missing", () => {
    const priced = addService(addService(emptySelection(), location("a", 10)), location("b", 5.5));
    expect(totalOf(setQuantity(priced, "a", 3))).toBe(35.5);
    expect(totalOf(addService(priced, location("c")))).toBeUndefined();
    expect(totalOf(emptySelection())).toBe(0);
  });
});
