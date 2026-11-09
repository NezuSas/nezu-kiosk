/**
 * NEZU Kiosk · configuración del negocio.
 *
 * Este es el único archivo que hay que tocar para adaptar el kiosko a otra empresa: marca, textos, colores,
 * moneda y comportamiento en reposo. El catálogo (categorías, servicios y precios) vive en `src/content/catalog.ts`.
 * Las dos URL de integración (formulario por QR y API de pedidos) se leen de las variables de entorno `VITE_*`.
 */

export interface KioskTheme {
  /** Color principal: botones, acentos, indicadores. */
  accent: string;
  /** Variante más oscura del acento, para degradados y estados presionados. */
  accentDark: string;
  /** Color del texto sobre el acento. */
  onAccent: string;
  /** Segundo acento, para detalles pequeños (líneas, etiquetas). */
  highlight: string;
  /** Fondo base de las pantallas. */
  background: string;
  /** Imagen de fondo, ruta dentro de `public/`. Vacío para usar solo el color. */
  backgroundImage: string;
  /** Radio de las tarjetas y botones grandes, en píxeles. */
  radius: number;
}

export interface KioskConfig {
  business: {
    /** Nombre comercial; aparece en el título de la pestaña, la portada y el pie. */
    name: string;
    /** Frase corta bajo el nombre en la portada. */
    tagline: string;
    /** Eslogan del pie de página. */
    slogan: string;
    /** Logo para fondos oscuros (portada), ruta dentro de `public/`. */
    logo: string;
    /** Logo a color para el pie y el formulario del teléfono. */
    logoColor: string;
    /** Logo oscuro para el centro del código QR (fondo blanco). */
    logoDark: string;
    contact: string;
    location: string;
  };
  currency: {
    /** Código ISO 4217, por ejemplo `USD`. */
    code: string;
    /** Configuración regional para formatear precios, por ejemplo `es-EC`. */
    locale: string;
  };
  texts: {
    start: string;
    categories: string;
    back: string;
    projects: string;
    services: string;
    acquire: string;
    added: string;
    goToCart: string;
    cart: string;
    emptyCart: string;
    browseCatalog: string;
    total: string;
    continueToPayment: string;
    scanQrTitle: string;
    scanQrHelp: string;
    contactTitle: string;
    locationTitle: string;
  };
  theme: KioskTheme;
  idle: {
    /** Segundos sin tocar la pantalla antes de volver a la portada. `0` desactiva el reposo. */
    returnHomeAfterSeconds: number;
    /** Vídeo en bucle para el modo reposo, ruta dentro de `public/`. Vacío para volver a la portada sin vídeo. */
    attractVideo: string;
  };
  credit: {
    /** Línea discreta al pie: «Kiosko creado con NEZU Kiosk». Puedes desactivarla, pero agradecemos que se quede. */
    show: boolean;
    label: string;
    url: string;
  };
}

export const kioskConfig: KioskConfig = {
  business: {
    name: "NEZU",
    tagline: "Tecnología para vivir mejor",
    slogan: "Tu empresa, tu futuro",
    logo: "/images/brand/logo.avif",
    logoColor: "/images/brand/logo_color.avif",
    logoDark: "/images/brand/logo_negro.avif",
    contact: "nezu.ec@nezuecuador.com",
    location: "Cueva de los Tallos y Base Sur, Cuenca, Ecuador",
  },
  currency: { code: "USD", locale: "es-EC" },
  texts: {
    start: "Iniciar",
    categories: "Categorías",
    back: "Regresar",
    projects: "Proyectos realizados",
    services: "Servicios",
    acquire: "Adquirir",
    added: "¡Agregado!",
    goToCart: "Ir al carrito",
    cart: "Carrito de compras",
    emptyCart: "Tu carrito está vacío.",
    browseCatalog: "Ver el catálogo",
    total: "Total",
    continueToPayment: "Continuar con el pago",
    scanQrTitle: "Escanea el código QR",
    scanQrHelp: "Escanea este código con tu teléfono para completar tus datos y el pago.",
    contactTitle: "Contáctanos",
    locationTitle: "Ubicación",
  },
  theme: {
    accent: "#D9542B",
    accentDark: "#B5431F",
    onAccent: "#FFFFFF",
    highlight: "#C9DF38",
    background: "#0B0F0D",
    backgroundImage: "/images/demo/background.webp",
    radius: 28,
  },
  idle: {
    returnHomeAfterSeconds: 120,
    attractVideo: "",
  },
  credit: {
    show: true,
    label: "Kiosko creado con NEZU Kiosk",
    url: "https://nezuecuador.com",
  },
};

/** Formatea un precio con la moneda y la región configuradas. */
export const formatPrice = (value: number): string =>
  new Intl.NumberFormat(kioskConfig.currency.locale, {
    style: "currency",
    currency: kioskConfig.currency.code,
  }).format(value);
