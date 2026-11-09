import { useMemo, type ReactNode } from "react";
import { resolveTexts } from "@/config/kiosk.config";
import { useLanguageStore } from "@/state/languageStore";
import { createKiosk, KioskContext, type Kiosk } from "./kiosk";

/** Entrega el kiosko a las pantallas con los textos del idioma activo. */
export const KioskProvider = ({ kiosk, children }: { kiosk?: Kiosk; children: ReactNode }) => {
  const language = useLanguageStore((state) => state.language);
  const value = useMemo(() => {
    const base = kiosk ?? createKiosk();
    return { ...base, texts: resolveTexts(base.config, language) };
  }, [kiosk, language]);
  return <KioskContext.Provider value={value}>{children}</KioskContext.Provider>;
};
