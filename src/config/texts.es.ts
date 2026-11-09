import type { KioskMode } from "@/domain/request";

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
  };
  payment: {
    optionsTitle: string;
    optionsHelp: string;
    cardTitle: string;
    cardHelp: string;
    continue: string;
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
    invalidSession: string;
  };
  footer: {
    contact: string;
    address: string;
    hours: string;
  };
}

/** Textos por defecto en español según el modo del kiosko. */
export const defaultTexts = (mode: KioskMode): KioskTexts => {
  const quote = mode === "quote";
  return {
    home: { start: "Explorar" },
    catalog: {
      categoriesTitle: "¿Qué quieres mejorar?",
      back: "Volver",
      servicesTitle: quote ? "Qué puedes pedir" : "Servicios",
      galleryTitle: "Escenarios de referencia",
      linesCount: "líneas",
      servicesCount: quote ? "opciones" : "servicios",
      add: quote ? "Añadir a mi solicitud" : "Añadir",
      added: "Añadido",
      selection: quote ? "Mi solicitud" : "Mi pedido",
      pricingNote: quote ? "Cada proyecto se cotiza tras una evaluación del espacio y de los equipos existentes." : "",
    },
    selection: {
      title: quote ? "Mi solicitud" : "Mi pedido",
      emptyTitle: "Aún no has elegido nada",
      emptyBody: quote
        ? "Recorre las líneas y añade lo que te interese. Al final te escribimos con una propuesta."
        : "Recorre el catálogo y añade lo que quieras llevar.",
      browse: "Ver los servicios",
      total: "Total",
      continue: quote ? "Solicitar evaluación" : "Continuar con el pago",
      quantity: "Cantidad",
      remove: "Quitar",
    },
    handoff: {
      title: "Sigue en tu teléfono",
      help: quote
        ? "Escanea el código: verás tu selección y podrás escribirnos por WhatsApp o dejarnos tus datos."
        : "Escanea el código para completar tus datos y elegir cómo pagar.",
      waiting: "Esperando a tu teléfono",
      close: "Cerrar",
    },
    thanks: {
      title: quote ? "Recibimos tu solicitud" : "Gracias por tu compra",
      body: quote
        ? "Te escribimos en horario de atención para coordinar la evaluación."
        : "Tu pedido quedó registrado. Puedes imprimir el comprobante.",
      print: "Imprimir comprobante",
      done: "Volver al inicio",
    },
    payment: {
      optionsTitle: "Elige cómo pagar",
      optionsHelp: "Escanea el código de tu banco para pagar desde tu aplicación.",
      cardTitle: "Pago con tarjeta",
      cardHelp: "Sigue las instrucciones del datáfono que tienes al lado.",
      continue: "Ya pagué",
    },
    phone: {
      title: quote ? "Tu solicitud" : "Tu pedido",
      summary: "Elegiste en el kiosko",
      name: "Nombre",
      phone: "Teléfono",
      email: "Correo",
      city: "Ciudad",
      notes: "¿Algo más que debamos saber?",
      businessName: "Razón social",
      taxId: "RUC",
      paymentMethod: "Cómo quieres pagar",
      paymentQr: "QR de mi banco",
      paymentCard: "Tarjeta en el datáfono",
      whatsapp: "Escribir por WhatsApp",
      send: quote ? "Enviar y que me contacten" : "Continuar en el kiosko",
      sentTitle: "Listo",
      sentBody: quote ? "Ya tenemos tu solicitud. Te escribimos pronto." : "Ya puedes seguir en la pantalla del kiosko.",
      invalidSession: "Este enlace venció. Vuelve a escanear el código en el kiosko.",
    },
    footer: {
      contact: "Contacto",
      address: "Dirección",
      hours: "Horario",
    },
  };
};
