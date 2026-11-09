import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ServiceLocation } from "@/domain/catalog";
import {
  addService,
  countItems,
  emptySelection,
  hasService,
  removeService,
  setQuantity,
  totalOf,
  type Selection,
} from "@/domain/selection";

interface SelectionState {
  selection: Selection;
  add: (location: ServiceLocation) => void;
  remove: (serviceId: string) => void;
  setQuantity: (serviceId: string, quantity: number) => void;
  clear: () => void;
}

/** Selección del cliente; sobrevive a un reinicio del navegador hasta que el kiosko la vacía. */
export const useSelectionStore = create<SelectionState>()(
  persist(
    (set) => ({
      selection: emptySelection(),
      add: (location) => set((state) => ({ selection: addService(state.selection, location) })),
      remove: (serviceId) => set((state) => ({ selection: removeService(state.selection, serviceId) })),
      setQuantity: (serviceId, quantity) => set((state) => ({ selection: setQuantity(state.selection, serviceId, quantity) })),
      clear: () => set({ selection: emptySelection() }),
    }),
    { name: "kiosk-selection" }
  )
);

/** Derivados de uso frecuente, calculados sobre la selección actual. */
export const useSelection = () => {
  const selection = useSelectionStore((state) => state.selection);
  return {
    selection,
    count: countItems(selection),
    total: totalOf(selection),
    has: (serviceId: string) => hasService(selection, serviceId),
  };
};
