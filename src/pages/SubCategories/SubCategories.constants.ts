import { type SubCategory } from './SubCategories.types';

import { asset } from "../../utils/asset";

export const SUB_CATEGORIES: SubCategory[] = [
  {
    id: 'lumina',
    title: 'Lumina',
    imageUrl: [
      asset("/images/Subcategories/Living/Lumina/lumina1.avif"),
      asset("/images/Subcategories/Living/Lumina/lumina2.avif"),
      asset("/images/Subcategories/Living/Lumina/lumina3.avif")
    ],
    parentId: 'living'
  },
  {
    id: 'climate',
    title: 'Climate',
    imageUrl: [
      asset("/images/Subcategories/Living/Climate/climate1.avif"),
      asset("/images/Subcategories/Living/Climate/climate2.avif"),
      asset("/images/Subcategories/Living/Climate/climate3.avif")
    ],
    parentId: 'living'
  },
  {
    id: 'guardian',
    title: 'Guardian',
    imageUrl: [
      asset("/images/Subcategories/Living/Guardian/guardian1.avif"),
      asset("/images/Subcategories/Living/Guardian/guardian2.avif"),
      asset("/images/Subcategories/Living/Guardian/guardian3.avif")
    ],
    parentId: 'living'
  }
];