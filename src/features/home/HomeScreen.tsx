import { useNavigate } from "react-router-dom";
import { useKiosk } from "@/app/kiosk";
import { asset } from "@/shared/utils/asset";
import { usePreloadImages } from "@/shared/hooks/usePreloadImages";
import { Button } from "@/ui/primitives";
import { LanguageSwitch } from "@/features/kiosk/LanguageSwitch";
import styles from "./HomeScreen.module.css";

/** Portada: una imagen, el titular del negocio y un solo botón. Las categorías se anuncian debajo como texto. */
export const HomeScreen = () => {
  const navigate = useNavigate();
  const { config, texts, catalog } = useKiosk();
  const { business } = config;
  usePreloadImages(catalog.categories.map((category) => asset(category.cover)));

  const start = () => {
    // La pantalla completa solo se concede tras un gesto del usuario; este es el primero del recorrido.
    if (config.kiosk.fullscreen && !document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().catch(() => undefined);
    }
    navigate("/categories");
  };

  return (
    <div className={styles.home}>
      <div className={styles.top}>
        <img src={asset(business.logo)} alt={business.name} className={styles.logo} />
        <LanguageSwitch />
      </div>
      <section className={styles.hero}>
        <h1 className={styles.headline}>{business.headline}</h1>
        <p className={styles.lead}>{business.lead}</p>
      </section>
      <div className={styles.actions}>
        <Button size="large" iconAfter="arrow-right" className={styles.start} onClick={start}>
          {texts.home.start}
        </Button>
        <p className={styles.ecosystems}>
          {catalog.categories.map((category) => (
            <span key={category.id}>
              <strong>{category.name}</strong> · {category.tagline}
            </span>
          ))}
        </p>
      </div>
    </div>
  );
};
