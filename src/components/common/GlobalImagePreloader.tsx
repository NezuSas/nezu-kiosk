import { useEffect, useState } from "react";
import { CATEGORIES } from "@/pages/Categories/Categories.constants";
import { SUB_CATEGORIES } from "@/pages/SubCategories/SubCategories.constants";

const GlobalImagePreloader = () => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (loaded) return;

    // Recopilar todas las imágenes críticas
    const imagesToPreload = [
      "/images/background.avif",
      "/images/logo_color.avif",
      ...CATEGORIES.map((cat) => cat.imageUrl),
      ...SUB_CATEGORIES.flatMap((sub) => sub.imageUrl),
    ];

    // Filtrar duplicados y valores nulos
    const uniqueImages = [...new Set(imagesToPreload.filter(Boolean))];

    console.log(`🚀 Preloading ${uniqueImages.length} critical images...`);

    const promises = uniqueImages.map((src) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = src;
        img.onload = resolve;
        img.onerror = reject;
      });
    });

    Promise.all(promises)
      .then(() => {
        console.log("✅ All critical images preloaded successfully.");
        setLoaded(true);
      })
      .catch((err) => {
        console.warn("⚠️ Some images failed to preload:", err);
      });
  }, [loaded]);

  return null; // Este componente no renderiza nada
};

export default GlobalImagePreloader;
