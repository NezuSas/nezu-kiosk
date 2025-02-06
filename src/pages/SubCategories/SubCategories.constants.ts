import { type SubCategory } from './SubCategories.types';

export const SUB_CATEGORIES: SubCategory[] = [
  {
    id: 'lumina',
    title: 'Lumina',
    imageUrl: [
      '/images/Subcategories/Living/Lumina/lumina1.avif',
      '/images/Subcategories/Living/Lumina/lumina2.avif',
      '/images/Subcategories/Living/Lumina/lumina3.avif'
    ],
    parentId: 'living'
  },
  {
    id: 'climate',
    title: 'Climate',
    imageUrl: [
      '/images/Subcategories/Living/Climate/climate1.avif',
      '/images/Subcategories/Living/Climate/climate2.avif',
      '/images/Subcategories/Living/Climate/climate3.avif'
    ],
    parentId: 'living'
  },
  {
    id: 'guardian',
    title: 'Guardian',
    imageUrl: [
      '/images/Subcategories/Living/Guardian/guardian1.avif',
      '/images/Subcategories/Living/Guardian/guardian2.avif',
      '/images/Subcategories/Living/Guardian/guardian3.avif'
    ],
    parentId: 'living'
  }
];