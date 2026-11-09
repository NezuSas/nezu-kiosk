import { Navigate, useNavigate, useParams } from "react-router-dom";
import { useKiosk } from "@/app/kiosk";
import { useSelection } from "@/state/selectionStore";
import { asset } from "@/shared/utils/asset";
import { usePreloadImages } from "@/shared/hooks/usePreloadImages";
import { Screen } from "@/ui/layout";
import { Icon } from "@/ui/icons/Icon";
import { KioskFooter } from "./KioskFooter";
import { LanguageSwitch } from "@/features/kiosk/LanguageSwitch";
import styles from "./LinesScreen.module.css";

/** Las líneas de una categoría, una tarjeta por línea con su portada y cuántos servicios ofrece. */
export const LinesScreen = () => {
  const navigate = useNavigate();
  const { categoryId } = useParams<{ categoryId: string }>();
  const { texts, catalog } = useKiosk();
  const { count } = useSelection();
  const category = catalog.category(categoryId);
  usePreloadImages(category ? category.lines.flatMap((line) => line.services.map((service) => asset(service.image))) : []);

  if (!category) return <Navigate to="/categories" replace />;

  return (
    <Screen
      title={category.name}
      onBack={() => navigate("/categories")}
      backLabel={texts.catalog.back}
      badge={{ label: texts.catalog.selection, count, onClick: () => navigate("/selection") }}
      tools={<LanguageSwitch />}
      footer={<KioskFooter />}
    >
      <p className={styles.tagline}>{category.tagline}</p>
      <div className={styles.list}>
        {category.lines.map((line) => (
          <button
            key={line.id}
            type="button"
            className={styles.card}
            onClick={() => navigate(`/categories/${category.id}/${line.id}`)}
          >
            <img src={asset(line.gallery[0])} alt="" />
            <span className={styles.body}>
              <span className={styles.name}>{line.name}</span>
              <span className={styles.lead}>{line.lead}</span>
              <span className={styles.meta}>
                {line.services.length} {texts.catalog.servicesCount}
              </span>
            </span>
            <Icon name="chevron-right" size="2rem" className={styles.chevron} />
          </button>
        ))}
      </div>
    </Screen>
  );
};
