import { useNavigate, useParams } from "react-router-dom";
import { SUB_CATEGORIES } from "./SubCategories.constants";
import { CATEGORIES } from "@/pages/Categories";
import styles from "./SubCategories.module.css";
import { MosaicoCard } from "@/components/common/MosaicoCard";

export const SubCategories = () => {
  const navigate = useNavigate();
  const { category } = useParams<{ category: string }>();

  // Encontrar el título de la categoría padre
  const parentCategory = CATEGORIES.find((cat) => cat.id === category);

  // Filtrar subcategorías por categoría padre
  const filteredSubCategories = SUB_CATEGORIES.filter(
    (subCat) => subCat.parentId === category
  );

  return (
    <div className={styles.container}>
      <div className={styles.subCategoryContainer}>
        <h1 className={styles.title}>{parentCategory?.title}</h1>
        {filteredSubCategories.map((subCategory, index) => (
          <MosaicoCard
            key={subCategory.id}
            title={subCategory.title}
            images={[
              subCategory.imageUrl[0],
              subCategory.imageUrl[1],
              subCategory.imageUrl[2],
            ]}
            layout={index % 2 === 0 ? "left" : "right"}
            onClick={() =>
              navigate(`/categories/${category}/${subCategory.id}`)
            }
          />
        ))}
      </div>
    </div>
  );
};
