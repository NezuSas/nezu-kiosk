import { create } from "zustand";
import { kioskConfig } from "@/config/kiosk.config";
import type { Language } from "@/config/texts";

interface LanguageState {
  language: Language;
  setLanguage: (language: Language) => void;
  /** Vuelve al idioma de arranque; se llama al reposo para que el siguiente cliente no herede el anterior. */
  reset: () => void;
}

const initial = kioskConfig.languages[0] ?? "es";

export const useLanguageStore = create<LanguageState>()((set) => ({
  language: initial,
  setLanguage: (language) => set({ language }),
  reset: () => set({ language: initial }),
}));
