import { type SubCategory } from './SubCategories.types';

export const SUB_CATEGORIES: SubCategory[] = [
  {
    id: 'lumina',
    title: 'Lumina',
    imageUrl: [
      '/src/assets/images/subcategories/Living/Lumina/lumina1.jpg',
      '/src/assets/images/subcategories/Living/Lumina/lumina2.jpg',
      '/src/assets/images/subcategories/Living/Lumina/lumina3.webp'
    ],
    parentId: 'living'
  },
  {
    id: 'climate',
    title: 'Climate',
    imageUrl: [
      '/src/assets/images/subcategories/Living/Climate/climate1.jpg',
      '/src/assets/images/subcategories/Living/Climate/climate2.jpg',
      '/src/assets/images/subcategories/Living/Climate/climate3.jpg'
    ],
    parentId: 'living'
  },
  {
    id: 'guardian',
    title: 'Guardian',
    imageUrl: [
      '/src/assets/images/subcategories/Living/Guardian/guardian1.webp',
      '/src/assets/images/subcategories/Living/Guardian/guardian2.jpg',
      '/src/assets/images/subcategories/Living/Guardian/guardian3.jpg'
    ],
    parentId: 'living'
  }
];