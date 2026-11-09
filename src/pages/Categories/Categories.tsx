import { useNavigate } from "react-router-dom";
import { Card } from "@/components/common/Card/Card";
import { CATEGORIES } from "./Categories.constants";
import styles from "./Categories.module.css";
import { useImagePreloader } from "@/hooks/useImagePreloader";
import { kioskConfig } from "@/kiosk.config";

const Categories = () => {
  const navigate = useNavigate();

  useImagePreloader(CATEGORIES.map((cat) => cat.imageUrl));

  const handleGoBack = () => {
    navigate(`/`);
  };

  return (
    <div className={styles.container}>
      <button className={styles.backButton} onClick={handleGoBack}>
        ← {kioskConfig.texts.back}
      </button>
      <div className={styles.categoryContainer}>
        <h1 className={styles.title}>{kioskConfig.texts.categories}</h1>
        {CATEGORIES.map((category) => (
          <Card
            key={category.id}
            title={category.title}
            imageUrl={category.imageUrl}
            onClick={() => navigate(`/categories/${category.id}`)}
          />
        ))}
      </div>
    </div>
  );
};

export default Categories;