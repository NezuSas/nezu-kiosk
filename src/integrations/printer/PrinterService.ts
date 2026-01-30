import html2canvas from "html2canvas";
import { sendToPrinter } from "./PrinterAPI";

export const printReceipt = async () => {
  try {
    const element = document.getElementById("receipt");
    if (!element) {
      console.error("❌ Elemento 'receipt' no encontrado en el DOM");
      alert("Error: No se encontró el formato del recibo.");
      return;
    }

    console.log("🎨 Iniciando captura de recibo...", element);

    // Asegurarse de que las imágenes (QR) estén cargadas
    const canvas = await html2canvas(element, {
      useCORS: true,
      allowTaint: true,
      scale: 2, // Mejor calidad
      backgroundColor: "#ffffff",
      onclone: (clonedDoc) => {
        // html2canvas 1.4.1 no soporta oklch ni colores modernos.
        // Buscamos y reemplazamos cualquier color problemático en el clon.
        const allElements = clonedDoc.querySelectorAll('*');
        allElements.forEach((el) => {
          const style = (el as HTMLElement).style;
          if (style) {
            // Si el navegador soporta getComputedStyle con oklch, lo convertimos
            // Aquí simplemente forzamos colores básicos si detectamos problemas
            // o simplemente limpiamos estilos complejos.
            const computedStyle = window.getComputedStyle(el);
            const colorProps = ['color', 'backgroundColor', 'borderColor', 'outlineColor', 'fill', 'stroke'];
            
            colorProps.forEach(prop => {
              const value = (computedStyle as any)[prop];
              if (value && (value.includes('oklch') || value.includes('oklaba'))) {
                (style as any)[prop] = '#000000'; // Fallback a negro
              }
            });
          }
        });
      }
    });

    const imgData = canvas.toDataURL("image/png");
    console.log("🖼️ Captura completada. Tamaño base64:", imgData.length);

    if (imgData.length < 1000) {
      console.warn("⚠️ La imagen generada parece estar vacía o es muy pequeña.");
    }

    console.log("📡 Enviando a PrinterAPI...");
    await sendToPrinter(imgData);

  } catch (error) {
    console.error("❌ Error crítico en printReceipt:", error);
    alert("Hubo un error al intentar imprimir el recibo. Revisa la consola.");
  }
};