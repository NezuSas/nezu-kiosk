import type { KioskMode } from "@/domain/request";
import type { KioskTexts } from "./texts";

/** Textos en español según el modo del kiosko. */
export const textsEs = (mode: KioskMode): KioskTexts => {
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
      paymentReference: "Pago confirmado",
    },
    payment: {
      optionsTitle: "Elige cómo pagar",
      optionsHelp: "Escanea el código de tu banco para pagar desde tu aplicación.",
      cardTitle: "Pago con tarjeta",
      cardHelp: "Sigue las instrucciones del datáfono que tienes al lado.",
      continue: "Ya pagué",
      waitingConfirmation: "En cuanto el pago se confirme, la pantalla avanza sola.",
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
      sendFailed: quote
        ? "No pudimos enviar tus datos. Prueba con WhatsApp o inténtalo de nuevo."
        : "No pudimos avisar al kiosko. Inténtalo de nuevo o pide ayuda en el mostrador.",
      invalidSession: "Este enlace venció. Vuelve a escanear el código en el kiosko.",
    },
    footer: {
      contact: "Contacto",
      address: "Dirección",
      hours: "Horario",
    },
    kiosk: {
      languageName: "Español",
      offline: "Sin conexión. Puedes seguir mirando; lo que envíes se entregará cuando vuelva.",
      errorTitle: "Algo no salió bien",
      errorBody: "La pantalla tuvo un problema. Vuelve al inicio y sigue desde ahí.",
      errorAction: "Volver al inicio",
    },
  };
};
