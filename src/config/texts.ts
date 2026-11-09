import type { KioskMode } from "@/domain/request";
import { textsEs } from "./texts.es";
import { textsEn } from "./texts.en";

/** Idiomas disponibles en pantalla. El catálogo se escribe en el idioma del negocio; esto traduce la interfaz. */
export type Language = "es" | "en";

/** Todos los textos que el cliente lee en pantalla. Se sobrescriben desde `kiosk.config.ts`. */
export interface KioskTexts {
  home: {
    /** Botón grande de la portada. */
    start: string;
  };
  catalog: {
    categoriesTitle: string;
    back: string;
    /** Encabezado de la lista de servicios de una línea. */
    servicesTitle: string;
    /** Encabezado de la galería de una línea. */
    galleryTitle: string;
    /** Sustantivos para los contadores: «4 líneas», «3 servicios». */
    linesCount: string;
    servicesCount: string;
    add: string;
    added: string;
    /** Etiqueta de la insignia que abre la selección. */
    selection: string;
    /** Nota bajo los servicios cuando no hay precios. */
    pricingNote: string;
  };
  selection: {
    title: string;
    emptyTitle: string;
    emptyBody: string;
    browse: string;
    total: string;
    continue: string;
    quantity: string;
    remove: string;
  };
  handoff: {
    title: string;
    help: string;
    waiting: string;
    close: string;
  };
  thanks: {
    title: string;
    body: string;
    print: string;
    done: string;
    /** Línea con la referencia cuando el pago fue confirmado por el servidor. */
    paymentReference: string;
  };
  payment: {
    optionsTitle: string;
    optionsHelp: string;
    cardTitle: string;
    cardHelp: string;
    /** Botón de confirmación manual («Ya pagué»); solo si la configuración lo permite. */
    continue: string;
    waitingConfirmation: string;
  };
  phone: {
    title: string;
    summary: string;
    name: string;
    phone: string;
    email: string;
    city: string;
    notes: string;
    businessName: string;
    taxId: string;
    paymentMethod: string;
    paymentQr: string;
    paymentCard: string;
    whatsapp: string;
    send: string;
    sentTitle: string;
    sentBody: string;
    sendFailed: string;
    invalidSession: string;
  };
  footer: {
    contact: string;
    address: string;
    hours: string;
  };
  kiosk: {
    /** Nombre del idioma, para el botón que lo activa. */
    languageName: string;
    offline: string;
    errorTitle: string;
    errorBody: string;
    errorAction: string;
  };
}

const dictionaries: Record<Language, (mode: KioskMode) => KioskTexts> = { es: textsEs, en: textsEn };

/** Textos por defecto según el modo del kiosko y el idioma. */
export const defaultTexts = (mode: KioskMode, language: Language = "es"): KioskTexts => dictionaries[language](mode);

export const isLanguage = (value: unknown): value is Language => value === "es" || value === "en";
