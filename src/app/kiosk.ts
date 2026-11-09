import { createContext, useContext } from "react";
import { indexCatalog, priceFormatter, type CatalogIndex } from "@/domain/catalog";
import type { HandoffChannel, PrinterGateway } from "@/domain/request";
import { noopEventSink, type EventSink } from "@/domain/analytics";
import { kioskConfig, resolveTexts, type KioskConfig } from "@/config/kiosk.config";
import type { KioskTexts } from "@/config/texts";
import { env } from "@/config/env";
import { catalog } from "@/content/catalog";
import { createSocketHandoffChannel } from "@/infrastructure/realtime/socketHandoffChannel";
import { createHttpPrinterGateway } from "@/infrastructure/printing/httpPrinterGateway";
import { createHttpEventSink } from "@/infrastructure/analytics/httpEventSink";

/** Todo lo que las pantallas necesitan y que no es estado del cliente: configuración, catálogo y adaptadores. */
export interface Kiosk {
  config: KioskConfig;
  /** Textos en el idioma activo; `KioskProvider` los recalcula al cambiar de idioma. */
  texts: KioskTexts;
  catalog: CatalogIndex;
  formatPrice: (amount: number) => string;
  handoff: HandoffChannel;
  printer: PrinterGateway;
  events: EventSink;
  phoneUrl: string;
}

export const KioskContext = createContext<Kiosk | null>(null);

/** Composición por defecto; las pruebas pasan `overrides` con adaptadores falsos o un catálogo pequeño. */
export const createKiosk = (overrides: Partial<Kiosk> = {}): Kiosk => {
  const config = overrides.config ?? kioskConfig;
  return {
    config,
    texts: resolveTexts(config),
    catalog: indexCatalog(catalog),
    formatPrice: priceFormatter(config.currency),
    handoff: createSocketHandoffChannel(env.realtimeUrl),
    printer: createHttpPrinterGateway(env.printerUrl),
    events: config.kiosk.analytics ? createHttpEventSink({ url: env.realtimeUrl, kioskId: config.kiosk.id }) : noopEventSink,
    phoneUrl: env.phoneUrl,
    ...overrides,
  };
};

export const useKiosk = (): Kiosk => {
  const kiosk = useContext(KioskContext);
  if (!kiosk) throw new Error("useKiosk debe usarse dentro de <KioskProvider>.");
  return kiosk;
};
