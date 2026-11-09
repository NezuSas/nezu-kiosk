import { createContext, useContext } from "react";
import { indexCatalog, priceFormatter, type CatalogIndex } from "@/domain/catalog";
import type { HandoffChannel, PrinterGateway } from "@/domain/request";
import { kioskConfig, resolveTexts, type KioskConfig } from "@/config/kiosk.config";
import type { KioskTexts } from "@/config/texts.es";
import { env } from "@/config/env";
import { catalog } from "@/content/catalog";
import { createSocketHandoffChannel } from "@/infrastructure/realtime/socketHandoffChannel";
import { createHttpPrinterGateway } from "@/infrastructure/printing/httpPrinterGateway";

/** Todo lo que las pantallas necesitan y que no es estado del cliente: configuración, catálogo y adaptadores. */
export interface Kiosk {
  config: KioskConfig;
  texts: KioskTexts;
  catalog: CatalogIndex;
  formatPrice: (amount: number) => string;
  handoff: HandoffChannel;
  printer: PrinterGateway;
  phoneUrl: string;
}

export const KioskContext = createContext<Kiosk | null>(null);

/** Composición por defecto; las pruebas pasan `overrides` con adaptadores falsos o un catálogo pequeño. */
export const createKiosk = (overrides: Partial<Kiosk> = {}): Kiosk => ({
  config: kioskConfig,
  texts: resolveTexts(kioskConfig),
  catalog: indexCatalog(catalog),
  formatPrice: priceFormatter(kioskConfig.currency),
  handoff: createSocketHandoffChannel(env.realtimeUrl),
  printer: createHttpPrinterGateway(env.printerUrl),
  phoneUrl: env.phoneUrl,
  ...overrides,
});

export const useKiosk = (): Kiosk => {
  const kiosk = useContext(KioskContext);
  if (!kiosk) throw new Error("useKiosk debe usarse dentro de <KioskProvider>.");
  return kiosk;
};
