import { useNavigate } from "react-router-dom";
import { useKiosk } from "@/app/kiosk";
import { asset } from "@/shared/utils/asset";
import { usePreloadImages } from "@/shared/hooks/usePreloadImages";
import { Button } from "@/ui/primitives";
import styles from "./HomeScreen.module.css";

/** Portada: una imagen, el titular del negocio y un solo botón. Las categorías se anuncian debajo como texto. */
export const HomeScreen = () => {
  const navigate = useNavigate();
  const { config, texts, catalog } = useKiosk();
  const { business } = config;
  usePreloadImages(catalog.categories.map((category) => asset(category.cover)));

  return (
    <div className={styles.home}>
      <img src={asset(business.logo)} alt={business.name} className={styles.logo} />
      <section className={styles.hero}>
        <h1 className={styles.headline}>{business.headline}</h1>
        <p className={styles.lead}>{business.lead}</p>
      </section>
      <div className={styles.actions}>
        <Button size="large" iconAfter="arrow-right" className={styles.start} onClick={() => navigate("/categories")}>
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
