/**
 * NEZU Kiosk · configuración del negocio.
 *
 * Este es el archivo que se adapta a cada empresa: modo del kiosko, marca, contacto, idiomas, textos, colores,
 * moneda y comportamiento en reposo. El catálogo vive en `src/content/catalog.ts` y las URL de integración en `.env`.
 */
import type { Currency } from "@/domain/catalog";
import type { KioskMode } from "@/domain/request";
import { defaultTexts, type KioskTexts, type Language } from "./texts";

export interface KioskTheme {
  /** Color principal: botones y acentos. */
  primary: string;
  /** Variante más oscura del principal, para estados presionados. */
  primaryStrong: string;
  /** Texto sobre el principal. */
  onPrimary: string;
  /** Color de lo elegido o activo; úsalo poco. */
  signal: string;
  /** Fondo de las pantallas. */
  ink: string;
  /** Texto principal. */
  paper: string;
  /** Imagen de fondo de la portada, ruta dentro de `public/`; vacío para usar solo el color. */
  homeImage: string;
}

export interface KioskConfig {
  /** `quote`: el cliente pide una evaluación; `payment`: el cliente paga desde el teléfono. */
  mode: KioskMode;
  /** Idiomas de la interfaz; el primero es el de arranque. Con más de uno aparece el selector en pantalla. */
  languages: Language[];
  business: {
    name: string;
    legalName: string;
    /** Titular de la portada. */
    headline: string;
    /** Frase bajo el titular. */
    lead: string;
    /** Logotipo para fondo oscuro, ruta dentro de `public/`. */
    logo: string;
    /** Logotipo oscuro para fondos claros (teléfono, centro del QR, comprobante). */
    logoDark: string;
    /** Número de WhatsApp con código de país, solo dígitos y «+». Vacío para no ofrecer WhatsApp. */
    whatsapp: string;
    phoneDisplay: string;
    email: string;
    address: string;
    hours: string;
    website: string;
  };
  currency: Currency;
  /** Sobrescribe cualquier texto de `defaultTexts`, en el idioma de arranque. */
  texts?: Partial<{ [Section in keyof KioskTexts]: Partial<KioskTexts[Section]> }>;
  theme: KioskTheme;
  idle: {
    /** Segundos sin tocar la pantalla antes de volver a la portada. `0` desactiva el reposo. */
    returnHomeAfterSeconds: number;
    /** Vídeo en bucle para el reposo, ruta dentro de `public/`. Vacío para volver a la portada sin vídeo. */
    attractVideo: string;
  };
  kiosk: {
    /** Identificador del tótem en las métricas, útil cuando hay varios. */
    id: string;
    /** Pide pantalla completa al primer toque (el navegador solo lo permite tras un gesto). */
    fullscreen: boolean;
    /** Registra un service worker que guarda imágenes, fuentes y la aplicación para seguir funcionando sin red. */
    offlineCache: boolean;
    /** Envía eventos de uso anónimos al servidor (`POST /api/events`). */
    analytics: boolean;
  };
  payment: {
    /** Códigos QR bancarios que se muestran en modo pago. */
    bankQrCodes: { label: string; url: string }[];
    /** Muestra el botón «Ya pagué» además de esperar la confirmación del servidor. */
    manualConfirmation: boolean;
  };
  credit: {
    /** Línea discreta al pie: «Kiosko creado con NEZU Kiosk». Agradecemos que se quede, pero la decisión es tuya. */
    show: boolean;
    label: string;
    url: string;
  };
}

export const kioskConfig: KioskConfig = {
  mode: "quote",
  languages: ["es", "en"],
  business: {
    name: "NEZU",
    legalName: "NEZU S.A.S.",
    headline: "Tecnología que se adapta a tu espacio",
    lead: "Diseñamos e integramos automatización, seguridad y conectividad para hogares, edificios e infraestructura.",
    logo: "/images/brand/logo.avif",
    logoDark: "/images/brand/logo_negro.avif",
    whatsapp: "+593983643383",
    phoneDisplay: "+593 98 364 3383",
    email: "nezu.ec@nezuecuador.com",
    address: "Base Sur y Cueva de los Tayos, sector El Rosal, Cuenca",
    hours: "Lunes a viernes, 08:00 a 18:00",
    website: "https://nezuecuador.com",
  },
  currency: { code: "USD", locale: "es-EC" },
  theme: {
    primary: "#D9542B",
    primaryStrong: "#C2461F",
    onPrimary: "#FFFFFF",
    signal: "#C9DF38",
    ink: "#111A16",
    paper: "#F3F4EE",
    homeImage: "/images/demo/background.webp",
  },
  idle: {
    returnHomeAfterSeconds: 120,
    attractVideo: "",
  },
  kiosk: {
    id: "kiosk-1",
    fullscreen: true,
    offlineCache: true,
    analytics: true,
  },
  payment: {
    bankQrCodes: [
      { label: "Banco Pichincha · Deuna", url: "https://www.pichincha.com/deuna" },
      { label: "Banco Internacional · +Pagos", url: "https://www.bancointernacional.com.ec/producto/qr-link-de-pagos-establecimientos/" },
      { label: "Banco Guayaquil · Bimo", url: "https://www.bancoguayaquil.com/cuentas/bimo/" },
    ],
    manualConfirmation: true,
  },
  credit: {
    show: true,
    label: "Kiosko creado con NEZU Kiosk",
    url: "https://nezuecuador.com",
  },
};

/** Textos finales para un idioma: los del modo elegido con las sobrescrituras de la configuración (solo en el idioma de arranque). */
export const resolveTexts = (config: KioskConfig, language: Language = config.languages[0] ?? "es"): KioskTexts => {
  const base = defaultTexts(config.mode, language);
  const overrides = language === (config.languages[0] ?? "es") ? (config.texts ?? {}) : {};
  return (Object.keys(base) as (keyof KioskTexts)[]).reduce(
    (texts, section) => ({ ...texts, [section]: { ...base[section], ...(overrides[section] ?? {}) } }),
    {} as KioskTexts
  );
};
