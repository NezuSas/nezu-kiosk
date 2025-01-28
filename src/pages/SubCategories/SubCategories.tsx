import { useNavigate, useParams } from 'react-router-dom';
import { Card } from '@/components/common/Card/Card';
import { SUB_CATEGORIES } from './SubCategories.constants';
import { CATEGORIES } from '@/pages/Categories';
import styles from './SubCategories.module.css';

export const SubCategories = () => {
  const navigate = useNavigate();
  const { category } = useParams<{ category: string }>();

  // Encontrar el título de la categoría padre
  const parentCategory = CATEGORIES.find(cat => cat.id === category);
  
  // Filtrar subcategorías por categoría padre
  const filteredSubCategories = SUB_CATEGORIES.filter(
    subCat => subCat.parentId === category
  );

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{parentCategory?.title}</h1>
      {filteredSubCategories.map(subCategory => (
        <Card
          key={subCategory.id}
          title={subCategory.title}
          imageUrl={subCategory.imageUrl}
          onClick={() => navigate(`/categories/${category}/${subCategory.id}`)}
        />
      ))}
    </div>
  );
};