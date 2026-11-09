import { useEffect } from "react";

/** Pide al navegador las imágenes indicadas para que la siguiente pantalla no parpadee. */
export const usePreloadImages = (urls: string[]): void => {
  const key = urls.join("|");
  useEffect(() => {
    key.split("|").filter(Boolean).forEach((url) => {
      const image = new Image();
      image.decoding = "async";
      image.src = url;
    });
  }, [key]);
};
