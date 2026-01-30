import { useNavigate } from "react-router-dom";
import { Card } from "@/components/common/Card/Card";
import { CATEGORIES } from "./Categories.constants";
import styles from "./Categories.module.css";
import { useImagePreloader } from "@/hooks/useImagePreloader";

const Categories = () => {
  const navigate = useNavigate();

  useImagePreloader(CATEGORIES.map((cat) => cat.imageUrl));

  const handleGoBack = () => {
    navigate(`/`);
  };

  return (
    <div className={styles.container}>
      <button className={styles.backButton} onClick={handleGoBack}>
        ← Regresar
      </button>
      <div className={styles.categoryContainer}>
        <h1 className={styles.title}>CATEGORIA 2</h1>
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