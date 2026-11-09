import { catalog } from "@/content/catalog";
import { asset } from "@/utils/asset";
import { type Detail } from "./Details.types";

/** The detail of each service line (projects and services), derived from `src/content/catalog.ts`. */
export const DETAILS: Detail[] = catalog.flatMap((category) =>
  category.subcategories.map((subcategory) => ({
    id: subcategory.id,
    title: subcategory.title,
    description: subcategory.description,
    projects: subcategory.projects.map((image) => asset(image)),
    services: subcategory.services.map((service) => ({
      id: service.id,
      title: service.title,
      image: asset(service.image),
      description: service.description,
      price: service.price,
    })),
  }))
);
