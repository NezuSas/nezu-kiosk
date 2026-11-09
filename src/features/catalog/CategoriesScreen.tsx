import { useNavigate } from "react-router-dom";
import { useKiosk } from "@/app/kiosk";
import { useSelection } from "@/state/selectionStore";
import { asset } from "@/shared/utils/asset";
import { usePreloadImages } from "@/shared/hooks/usePreloadImages";
import { Screen } from "@/ui/layout";
import { Icon } from "@/ui/icons/Icon";
import { KioskFooter } from "./KioskFooter";
import styles from "./CategoriesScreen.module.css";

/** Primera pantalla del catálogo: una banda a sangre por categoría. */
export const CategoriesScreen = () => {
  const navigate = useNavigate();
  const { config, texts, catalog } = useKiosk();
  const { count } = useSelection();
  usePreloadImages(catalog.categories.flatMap((category) => category.lines.map((line) => asset(line.gallery[0]))));

  return (
    <Screen
      wordmark={{ src: asset(config.business.logo), alt: config.business.name }}
      onBack={() => navigate("/")}
      backLabel={texts.catalog.back}
      badge={{ label: texts.catalog.selection, count, onClick: () => navigate("/selection") }}
      flush
      footer={<KioskFooter />}
    >
      <div className={styles.intro}>
        <h2 className={styles.question}>{texts.catalog.categoriesTitle}</h2>
      </div>
      <div className={styles.bands}>
        {catalog.categories.map((category) => (
          <button key={category.id} type="button" className={styles.band} onClick={() => navigate(`/categories/${category.id}`)}>
            <img src={asset(category.cover)} alt="" />
            <span className={styles.name}>
              {category.name}
              <span className={styles.lines}>
                {category.lines.length} {texts.catalog.linesCount}
              </span>
            </span>
            <span className={styles.tagline}>{category.tagline}</span>
            <span className={styles.arrow} aria-hidden="true">
              <Icon name="arrow-right" size="1.6rem" />
            </span>
          </button>
        ))}
      </div>
    </Screen>
  );
};
