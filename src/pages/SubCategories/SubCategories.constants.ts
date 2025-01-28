import { type SubCategory } from './SubCategories.types';

export const SUB_CATEGORIES: SubCategory[] = [
  {
    id: 'lumina',
    title: 'Lumina',
    imageUrl: '/src/assets/images/subcategories/lumina.jpg',
    parentId: 'living'
  },
  {
    id: 'climate',
    title: 'Climate',
    imageUrl: '/src/assets/images/subcategories/climate.jpg',
    parentId: 'living'
  },
  {
    id: 'guardian',
    title: 'Guardian',
    imageUrl: '/src/assets/images/subcategories/guardian.jpg',
    parentId: 'living'
  }
  // Puedes agregar más subcategorías para 'elevate' y 'academia' cuando las tengas
];