import type { PrinterGateway } from "@/domain/request";

/** Puente de impresión térmica: un POST con la imagen del comprobante en base64. */
export const createHttpPrinterGateway = (url: string): PrinterGateway => ({
  async print(imageDataUrl) {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image: imageDataUrl }),
    });
    if (!response.ok) throw new Error(`La impresora respondió ${response.status}.`);
  },
});
