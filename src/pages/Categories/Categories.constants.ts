import { catalog } from "@/content/catalog";
import { asset } from "@/utils/asset";
import { type Category } from "./Categories.types";

/** The category cards of the catalog's first screen, derived from `src/content/catalog.ts`. */
export const CATEGORIES: Category[] = catalog.map((category) => ({
  id: category.id,
  title: category.title,
  imageUrl: asset(category.image),
}));
