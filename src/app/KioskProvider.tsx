import { useMemo, type ReactNode } from "react";
import { createKiosk, KioskContext, type Kiosk } from "./kiosk";

export const KioskProvider = ({ kiosk, children }: { kiosk?: Kiosk; children: ReactNode }) => {
  const value = useMemo(() => kiosk ?? createKiosk(), [kiosk]);
  return <KioskContext.Provider value={value}>{children}</KioskContext.Provider>;
};
