import type { CatalogCategory, CatalogService, CatalogSubcategory } from "./types";

/**
 * NEZU Kiosk · catálogo de ejemplo.
 *
 * Tres categorías, nueve líneas de servicio y veintisiete servicios con precio. Para adaptarlo a tu negocio,
 * sustituye este contenido y las imágenes de `public/images/demo/` (créditos en `public/images/demo/SOURCES.md`).
 * Las rutas de imagen se escriben desde `public/` y la aplicación las resuelve contra la ruta base.
 */

const demo = (path: string) => `/images/demo/${path}`;

const gallery = (folder: string): [string, string, string] =>
  [demo(`${folder}/photo-1.webp`), demo(`${folder}/photo-2.webp`), demo(`${folder}/photo-3.webp`)];

const projects = (folder: string): string[] =>
  [1, 2, 3, 4, 5].map((n) => demo(`${folder}/photo-${n}.webp`));

const service = (folder: string, index: number, id: string, title: string, price: number, description: string): CatalogService =>
  ({ id, title, price, description, image: demo(`${folder}/service-${index}.webp`) });

const line = (id: string, folder: string, title: string, description: string, services: CatalogService[]): CatalogSubcategory =>
  ({ id, title, description, gallery: gallery(folder), projects: projects(folder), services });

export const catalog: CatalogCategory[] = [
  {
    id: "living",
    title: "Living",
    image: demo("living/cover.webp"),
    subcategories: [
      line("lumina", "living/lumina", "Lumina", "Iluminación inteligente para cada ambiente de la casa.", [
        service("living/lumina", 1, "lumina-diseno", "Diseño de iluminación", 120,
          "Estudiamos cada espacio y proponemos la distribución, la temperatura y la intensidad de luz que lo favorecen: confort visual, estética y eficiencia energética en un solo plano."),
        service("living/lumina", 2, "lumina-instalacion", "Instalación de luminarias", 180,
          "Nos encargamos del proceso completo: tendido, montaje y pruebas. Un sistema seguro, ordenado y listo para usar desde el primer día."),
        service("living/lumina", 3, "lumina-automatizacion", "Escenas y automatización", 90,
          "Integramos la iluminación con la automatización de la casa: escenas por hora, por presencia o por voz, controlables desde cualquier dispositivo."),
      ]),
      line("climate", "living/climate", "Climate", "Clima y calidad del aire bajo control.", [
        service("living/climate", 1, "climate-diseno", "Estudio térmico", 150,
          "Medimos cargas, orientación y uso de cada ambiente para dimensionar el equipo exacto: ni frío de más ni consumo de sobra."),
        service("living/climate", 2, "climate-instalacion", "Instalación de climatización", 320,
          "Instalamos equipos de aire acondicionado y ventilación con las protecciones eléctricas y el drenaje correctos, y los dejamos funcionando."),
        service("living/climate", 3, "climate-control", "Control inteligente de clima", 110,
          "Programación por horarios, sensores de temperatura y humedad, y control remoto para que el clima se anticipe a quien vive la casa."),
      ]),
      line("guardian", "living/guardian", "Guardian", "Seguridad y acceso para la tranquilidad del hogar.", [
        service("living/guardian", 1, "guardian-camaras", "Cámaras de vigilancia", 260,
          "Cámaras de alta definición con visión nocturna y grabación local. Tú decides quién ve qué, y las imágenes se quedan en casa."),
        service("living/guardian", 2, "guardian-cerraduras", "Cerraduras inteligentes", 190,
          "Acceso por código, tarjeta o teléfono, con registro de entradas y llaves temporales para visitas y servicios."),
        service("living/guardian", 3, "guardian-alarma", "Alarma y sensores", 220,
          "Sensores de apertura, movimiento y humo conectados a una central que avisa al instante, con o sin internet."),
      ]),
    ],
  },
  {
    id: "elevate",
    title: "Elevate",
    image: demo("elevate/cover.webp"),
    subcategories: [
      line("conecta", "elevate/conecta", "Conecta", "Redes y conectividad para empresas y edificios.", [
        service("elevate/conecta", 1, "conecta-cableado", "Cableado estructurado", 450,
          "Diseñamos e instalamos la red física del edificio: racks, canalizaciones y puntos certificados, documentados para crecer sin dolores de cabeza."),
        service("elevate/conecta", 2, "conecta-wifi", "Wi-Fi corporativo", 380,
          "Cobertura medida y planificada, con roaming entre puntos de acceso, red de invitados separada y gestión centralizada."),
        service("elevate/conecta", 3, "conecta-soporte", "Soporte y monitoreo", 120,
          "Vigilamos la red las veinticuatro horas y resolvemos antes de que el problema llegue a tus clientes. Informe mensual incluido."),
      ]),
      line("acceso", "elevate/acceso", "Acceso", "Control de acceso y videovigilancia para oficinas.", [
        service("elevate/acceso", 1, "acceso-control", "Control de acceso", 520,
          "Lectores de tarjeta, huella o teléfono en cada puerta, con horarios por persona y registro completo de quién entró y cuándo."),
        service("elevate/acceso", 2, "acceso-cctv", "Videovigilancia", 640,
          "Cámaras para interiores y exteriores con grabación continua, búsqueda por eventos y acceso remoto seguro para los responsables."),
        service("elevate/acceso", 3, "acceso-visitantes", "Gestión de visitantes", 160,
          "Registro de visitas en recepción, credenciales temporales y aviso automático al anfitrión."),
      ]),
      line("energia", "elevate/energia", "Energía", "Energía solar y eficiencia para la operación.", [
        service("elevate/energia", 1, "energia-estudio", "Estudio de consumo", 200,
          "Medimos el consumo real del edificio durante un mes y proponemos dónde ahorrar: tarifas, horarios, equipos y generación propia."),
        service("elevate/energia", 2, "energia-solar", "Instalación solar", 1900,
          "Paneles, inversores y protecciones dimensionados para tu consumo, con trámite de conexión y monitoreo de producción."),
        service("elevate/energia", 3, "energia-tableros", "Tableros y protecciones", 340,
          "Modernizamos tableros eléctricos con protecciones diferenciales, medición por circuito y orden que facilita el mantenimiento."),
      ]),
    ],
  },
  {
    id: "academia",
    title: "Academia",
    image: demo("academia/cover.webp"),
    subcategories: [
      line("aula", "academia/aula", "Aula digital", "Tecnología que acompaña la clase sin distraer.", [
        service("academia/aula", 1, "aula-pantallas", "Pantallas interactivas", 980,
          "Pantallas táctiles para el aula con software de pizarra, proyección inalámbrica desde cualquier dispositivo y gestión centralizada."),
        service("academia/aula", 2, "aula-capacitacion", "Capacitación docente", 150,
          "Sesiones prácticas con los equipos instalados, para que cada docente los use con soltura desde la primera semana."),
        service("academia/aula", 3, "aula-red", "Red del aula", 260,
          "Conectividad dedicada por aula, con filtrado de contenidos y prioridad para las herramientas educativas."),
      ]),
      line("audio", "academia/audio", "Audio", "Sonido claro en aulas, auditorios y patios.", [
        service("academia/audio", 1, "audio-aula", "Sonido de aula", 240,
          "Micrófono y altavoces discretos para que la voz llegue igual a la primera y a la última fila, sin esfuerzo para quien enseña."),
        service("academia/audio", 2, "audio-auditorio", "Auditorio y eventos", 1200,
          "Refuerzo sonoro para actos y presentaciones: altavoces, consola, micrófonos inalámbricos y operación el día del evento."),
        service("academia/audio", 3, "audio-timbres", "Timbres y avisos", 180,
          "Timbre programable por horarios y megafonía para avisos y emergencias en todo el campus."),
      ]),
      line("seguridad", "academia/seguridad", "Seguridad escolar", "Entradas, pasillos y patios bajo cuidado.", [
        service("academia/seguridad", 1, "seguridad-camaras", "Cámaras del campus", 720,
          "Cobertura de accesos, pasillos y patios con grabación y acceso restringido al personal autorizado."),
        service("academia/seguridad", 2, "seguridad-accesos", "Control de entradas", 560,
          "Torniquetes o puertas con credencial para estudiantes y personal, y registro de asistencia automático."),
        service("academia/seguridad", 3, "seguridad-emergencias", "Alertas de emergencia", 300,
          "Botones de pánico y avisos sonoros y visuales conectados con la dirección y los responsables de seguridad."),
      ]),
    ],
  },
];

/** Busca una categoría por su identificador. */
export const findCategory = (id?: string) => catalog.find((category) => category.id === id);

/** Busca una línea de servicios dentro de una categoría. */
export const findSubcategory = (categoryId?: string, subcategoryId?: string) =>
  findCategory(categoryId)?.subcategories.find((subcategory) => subcategory.id === subcategoryId);
