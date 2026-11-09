import type { ServiceLocation } from "../catalog/catalog";
import type { Selection, SelectionItem } from "./types";

export const emptySelection = (): Selection => ({ items: [] });

/** Añade un servicio; si ya estaba, suma una unidad. */
export const addService = (selection: Selection, location: ServiceLocation): Selection => {
  const existing = selection.items.find((item) => item.serviceId === location.service.id);
  if (existing) return setQuantity(selection, location.service.id, existing.quantity + 1);
  const item: SelectionItem = {
    serviceId: location.service.id,
    name: location.service.name,
    image: location.service.image,
    price: location.service.price,
    quantity: 1,
    categoryId: location.category.id,
    categoryName: location.category.name,
    lineId: location.line.id,
    lineName: location.line.name,
  };
  return { items: [...selection.items, item] };
};

export const removeService = (selection: Selection, serviceId: string): Selection => ({
  items: selection.items.filter((item) => item.serviceId !== serviceId),
});

/** Fija la cantidad; cero o menos quita el servicio. */
export const setQuantity = (selection: Selection, serviceId: string, quantity: number): Selection => {
  if (quantity <= 0) return removeService(selection, serviceId);
  return { items: selection.items.map((item) => (item.serviceId === serviceId ? { ...item, quantity } : item)) };
};

export const hasService = (selection: Selection, serviceId: string): boolean =>
  selection.items.some((item) => item.serviceId === serviceId);

/** Unidades elegidas en total; es el número de la insignia. */
export const countItems = (selection: Selection): number =>
  selection.items.reduce((sum, item) => sum + item.quantity, 0);

/** Suma de los precios conocidos. `undefined` cuando algún servicio elegido no tiene precio. */
export const totalOf = (selection: Selection): number | undefined => {
  if (selection.items.some((item) => item.price === undefined)) return undefined;
  return selection.items.reduce((sum, item) => sum + (item.price ?? 0) * item.quantity, 0);
};
