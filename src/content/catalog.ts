import type { Catalog, Service, ServiceLine } from "@/domain/catalog";

/**
 * Catálogo de NEZU · tomado de nezuecuador.com (ecosistemas Living, Elevate y Core).
 *
 * Los servicios no llevan precio porque NEZU cotiza cada proyecto tras una evaluación; por eso el kiosko corre en
 * modo `quote`. Para un negocio con precios fijos, añade `price` a cada servicio y pon `mode: "payment"` en
 * `kiosk.config.ts`. Las imágenes son ilustraciones generadas para la demo (`public/images/demo/SOURCES.md`).
 */

const demo = (path: string) => `/images/demo/${path}`;

const gallery = (folder: string, count = 3): string[] =>
  Array.from({ length: count }, (_, index) => demo(`${folder}/photo-${index + 1}.webp`));

const service = (folder: string, index: number, id: string, name: string, summary: string, price?: number): Service => ({
  id,
  name,
  summary,
  image: demo(`${folder}/service-${index}.webp`),
  ...(price === undefined ? {} : { price }),
});

const line = (id: string, folder: string, name: string, lead: string, services: Service[]): ServiceLine => ({
  id,
  name,
  lead,
  gallery: gallery(folder),
  services,
});

export const catalog: Catalog = {
  categories: [
    {
      id: "living",
      name: "Living",
      tagline: "Automatización residencial diseñada alrededor de tu espacio.",
      cover: demo("living/cover.webp"),
      lines: [
        line("iluminacion", "living/lumina", "Iluminación y escenas", "Luz que acompaña tus rutinas y cada ambiente de la casa.", [
          service("living/lumina", 1, "living-escenas", "Escenas por ambiente",
            "Definimos juntos cómo se ve cada espacio en cada momento: una sola orden y la casa cambia de ánimo."),
          service("living/lumina", 2, "living-rutinas", "Rutinas y horarios",
            "La iluminación sigue tu día: amanecer suave, luz de trabajo, noche tenue y apagado general al salir."),
          service("living/lumina", 3, "living-voz", "Control por voz",
            "Las escenas responden a la voz con un asistente local, sin enviar tus conversaciones fuera de casa."),
        ]),
        line("clima", "living/climate", "Clima y confort", "Temperatura y aire integrados con los equipos que ya tienes.", [
          service("living/climate", 1, "living-clima-automatizacion", "Automatización del clima",
            "Horarios, presencia y temperatura exterior deciden cuándo enfriar o ventilar, sin que nadie lo recuerde."),
          service("living/climate", 2, "living-clima-integracion", "Integración del aire acondicionado",
            "Conectamos las funciones compatibles de tus equipos para controlarlas desde la misma pantalla que las luces."),
          service("living/climate", 3, "living-clima-sensores", "Sensores de temperatura y humedad",
            "Medimos cada ambiente para que el confort sea real y el consumo se note en la factura."),
        ]),
        line("seguridad", "living/guardian", "Seguridad residencial", "Supervisión de accesos y dispositivos dentro de un alcance acordado.", [
          service("living/guardian", 1, "living-camaras", "Cámaras IP",
            "Cámaras ONVIF o RTSP con grabación local: las imágenes se quedan en tu casa y las ves desde el teléfono."),
          service("living/guardian", 2, "living-accesos", "Supervisión de accesos",
            "Sabes quién entra y cuándo, con cerraduras y sensores de puerta integrados en el mismo panel."),
          service("living/guardian", 3, "living-alertas", "Sensores y alertas",
            "Apertura, movimiento y humo avisan al instante; las acciones básicas siguen funcionando sin internet."),
        ]),
        line("atria", "living/control", "Control unificado con Atria", "Tu casa, desde la tablet y desde el teléfono.", [
          service("living/control", 1, "living-atria", "Atria en tablet y teléfono",
            "Luces, cortinas, cámaras, clima y sensores en una página web propia, con los datos guardados en tu equipo local."),
          service("living/control", 2, "living-remoto", "Acceso remoto protegido",
            "Entras desde fuera por un túnel protegido, sin abrir puertos en tu red ni depender de una nube ajena."),
          service("living/control", 3, "living-energia", "Monitoreo de consumo",
            "Un panel de energía muestra qué consume cada circuito y cuándo, para decidir con datos."),
        ]),
      ],
    },
    {
      id: "elevate",
      name: "Elevate",
      tagline: "Integración tecnológica para edificios y espacios compartidos.",
      cover: demo("elevate/cover.webp"),
      lines: [
        line("accesos", "elevate/acceso", "Accesos", "Flujos de acceso según roles, espacios y equipos compatibles.", [
          service("elevate/acceso", 2, "elevate-roles", "Control de accesos por roles",
            "Cada persona entra donde le corresponde y en su horario; el registro queda documentado para la administración."),
          service("elevate/acceso", 4, "elevate-biometria", "Biometría",
            "Lectores de huella o rostro donde el proyecto lo justifica, integrados con el resto del control de accesos."),
          service("elevate/acceso", 3, "elevate-visitantes", "Coordinación de visitantes",
            "Registro en recepción, credenciales temporales y aviso automático a quien recibe la visita."),
        ]),
        line("comunes", "elevate/comunes", "Áreas comunes y salas", "Automatizaciones para iluminación y funciones compartidas.", [
          service("elevate/comunes", 3, "elevate-iluminacion", "Iluminación de áreas compartidas",
            "Pasillos, vestíbulos y terrazas se encienden por presencia y horario, y se apagan solos."),
          service("elevate/comunes", 2, "elevate-salas", "Salas de reuniones listas",
            "Pizarra, clima, reproductor y persianas desde una sola pantalla: la sala está lista antes de que llegue el equipo."),
          service("elevate/comunes", 1, "elevate-comunicacion", "Comunicación interna",
            "Intercomunicadores y avisos integrados con los accesos del edificio."),
        ]),
        line("supervision", "elevate/supervision", "Supervisión", "Visibilidad operativa de los sistemas que puedan integrarse de forma segura.", [
          service("elevate/supervision", 1, "elevate-visibilidad", "Visibilidad centralizada",
            "Puertas, luces, cámaras y alarmas en un solo tablero para la administración, con reglas de operación acordadas."),
          service("elevate/supervision", 2, "elevate-sensores", "Cámaras y sensores en áreas comunes",
            "Cobertura de los espacios compartidos con acceso restringido a los responsables."),
          service("elevate/supervision", 3, "elevate-mantenimiento", "Apoyo al mantenimiento",
            "Estados y alertas de los equipos ayudan a planificar el mantenimiento con los datos disponibles."),
          service("elevate/supervision", 4, "elevate-integracion", "Integración entre plataformas",
            "Conexión documentada entre sistemas existentes, incluidos ascensores cuando el fabricante lo permite."),
        ]),
      ],
    },
    {
      id: "core",
      name: "Core",
      tagline: "Ingeniería e integración para operaciones técnicas.",
      cover: demo("core/cover.webp"),
      lines: [
        line("control", "core/control", "Control y supervisión", "Integración con sistemas de control o SCADA cuando corresponde al proyecto.", [
          service("core/control", 2, "core-scada", "Integración con SCADA",
            "Conectamos tu plataforma de control con los equipos incluidos, con interfaces y responsabilidades documentadas."),
          service("core/control", 1, "core-plc", "PLC por Modbus TCP",
            "Lectura y escritura de señales de controladores industriales para supervisarlos desde una sola pantalla."),
          service("core/control", 3, "core-senales", "Señales y estados centralizados",
            "Las señales y estados definidos para el proyecto llegan a un tablero único de operación."),
        ]),
        line("redes", "elevate/conecta", "Redes industriales", "Diseño y diagnóstico de comunicaciones para los equipos incluidos.", [
          service("elevate/conecta", 2, "core-diseno-red", "Diseño de comunicaciones",
            "Topología, segmentación y cobertura pensadas para la operación, no para la novedad."),
          service("elevate/conecta", 3, "core-diagnostico", "Diagnóstico de red",
            "Medimos la red existente antes de ampliar o conectar sistemas, y entregamos el informe."),
          service("elevate/conecta", 1, "core-cableado", "Cableado y racks",
            "Canalizaciones, racks y puntos certificados, documentados para crecer sin sorpresas."),
        ]),
        line("evaluacion", "core/evaluacion", "Evaluación técnica y datos", "Interfaces, riesgos y pruebas definidos antes de intervenir.", [
          service("core/evaluacion", 2, "core-evaluacion", "Evaluación técnica previa",
            "Revisamos restricciones, dependencias y condiciones de implementación antes de proponer cambios."),
          service("core/evaluacion", 1, "core-pruebas", "Plan de pruebas y documentación",
            "Cada integración se prueba antes de la entrega y se entrega con su documentación y transferencia técnica."),
          service("core/evaluacion", 3, "core-datos", "Datos operativos",
            "Información útil de cada plataforma, dentro de sus límites, para decidir la modernización por etapas."),
        ]),
      ],
    },
  ],
};
