import type { Catalog, Category, Service, ServiceLine } from "./types";

/** Dónde vive un servicio dentro del catálogo; la selección lo guarda para mostrar el contexto sin volver a buscar. */
export interface ServiceLocation {
  category: Category;
  line: ServiceLine;
  service: Service;
}

/** Consultas de solo lectura sobre un catálogo, con índices construidos una vez. */
export interface CatalogIndex {
  readonly categories: Category[];
  category(id: string | undefined): Category | undefined;
  line(categoryId: string | undefined, lineId: string | undefined): ServiceLine | undefined;
  service(serviceId: string): ServiceLocation | undefined;
  /** Todas las rutas de imagen del catálogo, sin repetir; sirve para precargar. */
  images(): string[];
}

export const indexCatalog = (catalog: Catalog): CatalogIndex => {
  const byService = new Map<string, ServiceLocation>();
  for (const category of catalog.categories) {
    for (const line of category.lines) {
      for (const service of line.services) {
        byService.set(service.id, { category, line, service });
      }
    }
  }
  const images = Array.from(
    new Set(
      catalog.categories.flatMap((category) => [
        category.cover,
        ...category.lines.flatMap((line) => [...line.gallery, ...line.services.map((service) => service.image)]),
      ])
    )
  );
  return {
    categories: catalog.categories,
    category: (id) => catalog.categories.find((category) => category.id === id),
    line: (categoryId, lineId) =>
      catalog.categories.find((category) => category.id === categoryId)?.lines.find((line) => line.id === lineId),
    service: (serviceId) => byService.get(serviceId),
    images: () => images,
  };
};

/** Problemas que harían fallar el kiosko en pantalla; se comprueban en las pruebas y al arrancar en desarrollo. */
export const validateCatalog = (catalog: Catalog): string[] => {
  const problems: string[] = [];
  const seen = new Map<string, string>();
  const claim = (id: string, where: string) => {
    const previous = seen.get(id);
    if (previous) problems.push(`Identificador repetido «${id}» en ${where} y ${previous}.`);
    seen.set(id, where);
  };
  if (catalog.categories.length === 0) problems.push("El catálogo no tiene categorías.");
  for (const category of catalog.categories) {
    claim(category.id, `la categoría «${category.name}»`);
    if (category.lines.length === 0) problems.push(`La categoría «${category.name}» no tiene líneas.`);
    for (const line of category.lines) {
      claim(line.id, `la línea «${line.name}»`);
      if (line.gallery.length === 0) problems.push(`La línea «${line.name}» no tiene imágenes.`);
      if (line.services.length === 0) problems.push(`La línea «${line.name}» no tiene servicios.`);
      for (const service of line.services) {
        claim(service.id, `el servicio «${service.name}»`);
        if (service.price !== undefined && !(service.price >= 0)) {
          problems.push(`El servicio «${service.name}» tiene un precio inválido.`);
        }
      }
    }
  }
  return problems;
};

/** Verdadero cuando algún servicio del catálogo tiene precio. */
export const hasPrices = (catalog: Catalog): boolean =>
  catalog.categories.some((category) =>
    category.lines.some((line) => line.services.some((service) => service.price !== undefined))
  );
