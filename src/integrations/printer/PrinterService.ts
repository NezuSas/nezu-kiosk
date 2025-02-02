import html2canvas from "html2canvas";
import { sendToPrinter } from "./PrinterAPI";

export const printReceipt = async () => {
  try {
    const element = document.getElementById("receipt");
    if (!element) {
      throw new Error("❌ No se encontró el elemento del recibo.");
    }

    console.log("🎨 Capturando el recibo como imagen...");

    const canvas = await html2canvas(element, { useCORS: true });
    const imgData = canvas.toDataURL("image/png");

    console.log("🖼️ Imagen generada:", imgData);

    console.log("📡 Enviando imagen a la impresora...");
    await sendToPrinter(imgData);

    console.log("✅ Recibo enviado correctamente.");
  } catch (error) {
    console.error("❌ Error al generar el recibo:", error);
  }
};