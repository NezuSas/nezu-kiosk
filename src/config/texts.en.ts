import type { KioskMode } from "@/domain/request";
import type { KioskTexts } from "./texts";

/** English texts, by kiosk mode. The catalog itself stays in the business's language. */
export const textsEn = (mode: KioskMode): KioskTexts => {
  const quote = mode === "quote";
  return {
    home: { start: "Explore" },
    catalog: {
      categoriesTitle: "What would you like to improve?",
      back: "Back",
      servicesTitle: quote ? "What you can ask for" : "Services",
      galleryTitle: "Reference scenarios",
      linesCount: "lines",
      servicesCount: quote ? "options" : "services",
      add: quote ? "Add to my request" : "Add",
      added: "Added",
      selection: quote ? "My request" : "My order",
      pricingNote: quote ? "Every project is quoted after an assessment of the space and the existing equipment." : "",
    },
    selection: {
      title: quote ? "My request" : "My order",
      emptyTitle: "Nothing chosen yet",
      emptyBody: quote
        ? "Browse the lines and add whatever interests you. We will get back to you with a proposal."
        : "Browse the catalog and add what you want to take.",
      browse: "See the services",
      total: "Total",
      continue: quote ? "Request an assessment" : "Continue to payment",
      quantity: "Quantity",
      remove: "Remove",
    },
    handoff: {
      title: "Continue on your phone",
      help: quote
        ? "Scan the code: you will see your selection and can message us on WhatsApp or leave your details."
        : "Scan the code to fill in your details and choose how to pay.",
      waiting: "Waiting for your phone",
      close: "Close",
    },
    thanks: {
      title: quote ? "We received your request" : "Thank you for your purchase",
      body: quote ? "We will write to you during business hours to schedule the assessment." : "Your order is registered. You can print the receipt.",
      print: "Print receipt",
      done: "Back to start",
      paymentReference: "Payment confirmed",
    },
    payment: {
      optionsTitle: "Choose how to pay",
      optionsHelp: "Scan your bank's code to pay from its app.",
      cardTitle: "Card payment",
      cardHelp: "Follow the instructions on the card terminal next to you.",
      continue: "I have paid",
      waitingConfirmation: "As soon as the payment is confirmed, the screen moves on by itself.",
    },
    phone: {
      title: quote ? "Your request" : "Your order",
      summary: "You chose at the kiosk",
      name: "Name",
      phone: "Phone",
      email: "Email",
      city: "City",
      notes: "Anything else we should know?",
      businessName: "Company name",
      taxId: "Tax ID",
      paymentMethod: "How would you like to pay",
      paymentQr: "My bank's QR",
      paymentCard: "Card at the terminal",
      whatsapp: "Message on WhatsApp",
      send: quote ? "Send and get a call back" : "Continue at the kiosk",
      sentTitle: "Done",
      sentBody: quote ? "We have your request. We will be in touch soon." : "You can continue on the kiosk screen.",
      sendFailed: quote ? "We could not send your details. Try WhatsApp or try again." : "We could not reach the kiosk. Try again or ask at the counter.",
      invalidSession: "This link has expired. Scan the code at the kiosk again.",
    },
    footer: {
      contact: "Contact",
      address: "Address",
      hours: "Hours",
    },
    kiosk: {
      languageName: "English",
      offline: "No connection. You can keep browsing; anything you send will be delivered when it returns.",
      errorTitle: "Something went wrong",
      errorBody: "The screen ran into a problem. Go back to the start and continue from there.",
      errorAction: "Back to start",
    },
  };
};
