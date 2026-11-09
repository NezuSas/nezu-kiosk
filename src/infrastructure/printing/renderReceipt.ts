import html2canvas from "html2canvas";

/** Convierte el nodo del comprobante en una imagen PNG lista para la impresora. */
export const renderReceipt = async (element: HTMLElement): Promise<string> => {
  const canvas = await html2canvas(element, { scale: 2, backgroundColor: "#ffffff", useCORS: true });
  return canvas.toDataURL("image/png");
};
