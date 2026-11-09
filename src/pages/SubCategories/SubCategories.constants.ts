import { catalog } from "@/content/catalog";
import { asset } from "@/utils/asset";
import { type SubCategory } from "./SubCategories.types";

/** Every service line with its parent category, derived from `src/content/catalog.ts`. */
export const SUB_CATEGORIES: SubCategory[] = catalog.flatMap((category) =>
  category.subcategories.map((subcategory) => ({
    id: subcategory.id,
    title: subcategory.title,
    imageUrl: subcategory.gallery.map((image) => asset(image)),
    parentId: category.id,
  }))
);
