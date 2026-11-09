import { type Category } from './Categories.types';

import { asset } from "../../utils/asset";

export const CATEGORIES: Category[] = [
  {
    id: 'living',
    title: 'Living',
    imageUrl: asset("/images/categories/living/living.avif")
  },
  {
    id: 'elevate',
    title: 'Elevate',
    imageUrl: asset("/images/categories/elevate/elevate.avif")
  },
  {
    id: 'academia',
    title: 'Academia',
    imageUrl: asset("/images/categories/academia/academia.avif")
  }
];