import { type Detail } from "./Details.types";

export const DETAILS: Detail[] = [
  {
    id: "lumina",
    title: "LUMINA",
    description: "Lumina offers advanced smart lighting solutions.",
    projects: [
      "/images/Subcategories/Living/Lumina/Projects/one.avif",
      "/images/Subcategories/Living/Lumina/Projects/two.avif",
      "/images/Subcategories/Living/Lumina/Projects/three.avif",
      "/images/Subcategories/Living/Lumina/Projects/four.avif",
      "/images/Subcategories/Living/Lumina/Projects/five.avif",
      "/images/Subcategories/Living/Lumina/Projects/six.avif",
    ],
    services: {
      design: [
        {
          id: "Diseño de iluminación de espacios",
          image: "/images/Subcategories/Living/Lumina/Services/Design/one.avif",
          description: "Creamos ambientes únicos y funcionales con una distribución estratégica de luminarias. Optimizamos la temperatura y el color de la luz para resaltar cada espacio, combinando confort visual, estética y eficiencia energética.",
          price: "10.00"
        },
        {
          id: "Instalación de sistemas de iluminación",
          image: "/images/Subcategories/Living/Lumina/Services/Design/two.avif",
          description: "Nos encargamos del proceso completo de instalación, desde el tendido de cables hasta el montaje de accesorios. Garantizamos un sistema seguro, ordenado y listo para operar, cumpliendo con los más altos estándares de calidad.",
          price: "40.00"
        },
        {
          id: "Implementación de sistemas de iluminación",
          image: "/images/Subcategories/Living/Lumina/Services/Design/three.avif",
          description: "Instalamos y configuramos luminarias y terminales con precisión. Realizamos pruebas exhaustivas para asegurar un funcionamiento impecable, ofreciéndote una solución llave en mano con calidad garantizada.",
          price: "40.00"
        },
        {
          id: "Integración de sistema a HASS",
          image: "/images/Subcategories/Living/Lumina/Services/Design/four.avif",
          description: "Automatizamos tu iluminación con Home Assistant. Configuramos sistemas inteligentes que permiten controlar y programar la luz desde cualquier dispositivo, creando ambientes adaptados a tus necesidades.",
          price: "20.00"
        }
      ],
      installation: [
        {
          id: "lumina-installation-1",
          image: "/images/Subcategories/Living/Lumina/Services/Installation/one.avif",
          description: "Professional installation of smart lighting systems.",
          price: "10.00"
        },
        {
          id: "lumina-installation-2",
          image: "/images/Subcategories/Living/Lumina/Services/Installation/two.avif",
          description: "Setup of automated lighting control for smart homes.",
          price: "10.00"
        }
      ],
      equipment: [
        {
          id: "lumina-equipment-1",
          image: "/images/Subcategories/Living/Lumina/Services/Equipment/one.avif",
          description: "High-quality LED lights for all environments.",
          price: "10.00"
        },
        {
          id: "lumina-equipment-2",
          image: "/images/Subcategories/Living/Lumina/Services/Equipment/two.avif",
          description: "Smart lighting controllers and dimmers.",
          price: "10.00"
        }
      ]
    }
  },
  {
    id: "climate",
    title: "CLIMATE",
    description: "Climate helps you control temperature and air quality.",
    projects: [
      "/images/Subcategories/Living/Climate/Projects/one.avif",
      "/images/Subcategories/Living/Climate/Projects/two.avif",
      "/images/Subcategories/Living/Climate/Projects/three.avif"
    ],
    services: {
      design: [
        {
          id: "climate-design-1",
          image: "/images/Subcategories/Living/Climate/Services/Design/one.avif",
          description: "Customized climate control plans for efficiency.",
          price: "10.00"
        },
        {
          id: "climate-design-2",
          image: "/images/Subcategories/Living/Climate/Services/Design/two.avif",
          description: "Smart cooling and heating system layouts.",
          price: "10.00"
        }
      ],
      installation: [
        {
          id: "climate-installation-1",
          image: "/images/Subcategories/Living/Climate/Services/Installation/one.avif",
          description: "Integration of smart thermostats and ventilation systems.",
          price: "10.00"
        },
        {
          id: "climate-installation-2",
          image: "/images/Subcategories/Living/Climate/Services/Installation/two.avif",
          description: "Installation of high-efficiency air conditioning.",
          price: "10.00"
        }
      ],
      equipment: [
        {
          id: "climate-equipment-1",
          image: "/images/Subcategories/Living/Climate/Services/Equipment/one.avif",
          description: "Energy-efficient HVAC systems and air purifiers.",
          price: "10.00"
        },
        {
          id: "climate-equipment-2",
          image: "/images/Subcategories/Living/Climate/Services/Equipment/two.avif",
          description: "Smart sensors for temperature monitoring.",
          price: "10.00"
        }
      ]
    }
  },
  {
    id: "guardian",
    title: "GUARDIAN",
    description: "Guardian provides advanced security with real-time monitoring.",
    projects: [
      "/images/Subcategories/Living/Guardian/Projects/one.avif",
      "/images/Subcategories/Living/Guardian/Projects/two.avif",
      "/images/Subcategories/Living/Guardian/Projects/three.avif"
    ],
    services: {
      design: [
        {
          id: "guardian-design-1",
          image: "/images/Subcategories/Living/Guardian/Services/Design/one.avif",
          description: "Security system planning for homes and businesses.",
          price: "10.00"
        },
        {
          id: "guardian-design-2",
          image: "/images/Subcategories/Living/Guardian/Services/Design/two.avif",
          description: "Surveillance layout optimization.",
          price: "10.00"
        }
      ],
      installation: [
        {
          id: "guardian-installation-1",
          image: "/images/Subcategories/Living/Guardian/Services/Installation/one.avif",
          description: "Deployment of biometric access and alarm systems.",
          price: "10.00"
        },
        {
          id: "guardian-installation-2",
          image: "/images/Subcategories/Living/Guardian/Services/Installation/two.avif",
          description: "Setup of remote security control hubs.",
          price: "10.00"
        }
      ],
      equipment: [
        {
          id: "guardian-equipment-1",
          image: "/images/Subcategories/Living/Guardian/Services/Equipment/one.avif",
          description: "High-resolution surveillance cameras and smart locks.",
          price: "10.00"
        },
        {
          id: "guardian-equipment-2",
          image: "/images/Subcategories/Living/Guardian/Services/Equipment/two.avif",
          description: "Advanced motion detection and alarm systems.",
          price: "10.00"
        }
      ]
    }
  }
];