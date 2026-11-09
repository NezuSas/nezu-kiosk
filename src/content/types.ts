/** Un servicio o producto que el cliente puede añadir al carrito. */
export interface CatalogService {
  /** Identificador estable, en minúsculas y con guiones; es la clave del carrito. */
  id: string;
  title: string;
  description: string;
  /** Precio en la moneda configurada en `kiosk.config.ts`. */
  price: number;
  /** Imagen del servicio, ruta dentro de `public/`. */
  image: string;
}

/** Una línea de servicios dentro de una categoría, con su galería y sus servicios. */
export interface CatalogSubcategory {
  id: string;
  title: string;
  description: string;
  /** Tres imágenes para el mosaico de la lista de subcategorías. */
  gallery: [string, string, string];
  /** Imágenes del carrusel «Proyectos realizados». */
  projects: string[];
  services: CatalogService[];
}

/** Una categoría de la portada del catálogo. */
export interface CatalogCategory {
  id: string;
  title: string;
  /** Imagen de portada, ruta dentro de `public/`. */
  image: string;
  subcategories: CatalogSubcategory[];
}
