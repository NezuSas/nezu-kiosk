/**
 * Catálogo · modelo de dominio.
 *
 * Tres niveles: categoría → línea → servicio. Un servicio puede tener precio (kiosko de venta) o no tenerlo
 * (kiosko de cotización: el cliente arma una solicitud y el negocio la valora después). Las rutas de imagen se
 * escriben desde `public/` y la capa de interfaz las resuelve contra la ruta base del despliegue.
 */

export interface Service {
  /** Identificador estable en minúsculas y con guiones; es la clave de la selección del cliente. */
  id: string;
  name: string;
  /** Una o dos frases: qué recibe el cliente. */
  summary: string;
  image: string;
  /** Precio en la moneda configurada. Ausente cuando el servicio se cotiza tras una evaluación. */
  price?: number;
}

export interface ServiceLine {
  id: string;
  name: string;
  /** Frase de apertura de la línea, bajo su nombre. */
  lead: string;
  /** Imágenes de referencia de la línea; la primera es su portada. */
  gallery: string[];
  services: Service[];
}

export interface Category {
  id: string;
  name: string;
  /** Qué resuelve la categoría, en una frase. */
  tagline: string;
  cover: string;
  lines: ServiceLine[];
}

export interface Catalog {
  categories: Category[];
}
