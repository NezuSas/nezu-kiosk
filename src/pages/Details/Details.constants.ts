import { type Detail } from "./Details.types";

export const DETAILS: Detail[] = [
  {
    id: "lumina",
    title: "LUMINA",
    description: "Lumina offers advanced smart lighting solutions.",
    projects: [
      "/src/assets/images/Subcategories/Living/Lumina/Projects/one.jpg",
      "/src/assets/images/Subcategories/Living/Lumina/Projects/two.jpg",
      "/src/assets/images/Subcategories/Living/Lumina/Projects/three.jpg",
      "/src/assets/images/Subcategories/Living/Lumina/Projects/four.jpg",
      "/src/assets/images/Subcategories/Living/Lumina/Projects/five.jpg",
      "/src/assets/images/Subcategories/Living/Lumina/Projects/six.jpg",
    ],
    services: {
      design: [
        {
          id: "Diseño de iluminación de espacios",
          image: "/src/assets/images/Subcategories/Living/Lumina/Services/Design/one.jpg",
          description: "Creamos ambientes únicos y funcionales con una distribución estratégica de luminarias. Optimizamos la temperatura y el color de la luz para resaltar cada espacio, combinando confort visual, estética y eficiencia energética.",
          price: "10.00"
        },
        {
          id: "Instalación de sistemas de iluminación",
          image: "/src/assets/images/Subcategories/Living/Lumina/Services/Design/two.jpg",
          description: "Nos encargamos del proceso completo de instalación, desde el tendido de cables hasta el montaje de accesorios. Garantizamos un sistema seguro, ordenado y listo para operar, cumpliendo con los más altos estándares de calidad.",
          price: "40.00"
        },
        {
          id: "Implementación de sistemas de iluminación",
          image: "/src/assets/images/Subcategories/Living/Lumina/Services/Design/three.jpg",
          description: "Instalamos y configuramos luminarias y terminales con precisión. Realizamos pruebas exhaustivas para asegurar un funcionamiento impecable, ofreciéndote una solución llave en mano con calidad garantizada.",
          price: "40.00"
        },
        {
          id: "Integración de sistema a HASS",
          image: "/src/assets/images/Subcategories/Living/Lumina/Services/Design/four.jpg",
          description: "Automatizamos tu iluminación con Home Assistant. Configuramos sistemas inteligentes que permiten controlar y programar la luz desde cualquier dispositivo, creando ambientes adaptados a tus necesidades.",
          price: "20.00"
        }
      ],
      installation: [
        {
          id: "lumina-installation-1",
          image: "/src/assets/images/Subcategories/Living/Lumina/Services/Installation/one.jpg",
          description: "Professional installation of smart lighting systems.",
          price: "10.00"
        },
        {
          id: "lumina-installation-2",
          image: "/src/assets/images/Subcategories/Living/Lumina/Services/Installation/two.jpg",
          description: "Setup of automated lighting control for smart homes.",
          price: "10.00"
        }
      ],
      equipment: [
        {
          id: "lumina-equipment-1",
          image: "/src/assets/images/Subcategories/Living/Lumina/Services/Equipment/one.jpg",
          description: "High-quality LED lights for all environments.",
          price: "10.00"
        },
        {
          id: "lumina-equipment-2",
          image: "/src/assets/images/Subcategories/Living/Lumina/Services/Equipment/two.jpg",
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
      "/src/assets/images/Subcategories/Living/Climate/Projects/one.jpg",
      "/src/assets/images/Subcategories/Living/Climate/Projects/two.jpg",
      "/src/assets/images/Subcategories/Living/Climate/Projects/three.jpg"
    ],
    services: {
      design: [
        {
          id: "climate-design-1",
          image: "/src/assets/images/Subcategories/Living/Climate/Services/Design/one.jpg",
          description: "Customized climate control plans for efficiency.",
          price: "10.00"
        },
        {
          id: "climate-design-2",
          image: "/src/assets/images/Subcategories/Living/Climate/Services/Design/two.jpg",
          description: "Smart cooling and heating system layouts.",
          price: "10.00"
        }
      ],
      installation: [
        {
          id: "climate-installation-1",
          image: "/src/assets/images/Subcategories/Living/Climate/Services/Installation/one.jpg",
          description: "Integration of smart thermostats and ventilation systems.",
          price: "10.00"
        },
        {
          id: "climate-installation-2",
          image: "/src/assets/images/Subcategories/Living/Climate/Services/Installation/two.jpg",
          description: "Installation of high-efficiency air conditioning.",
          price: "10.00"
        }
      ],
      equipment: [
        {
          id: "climate-equipment-1",
          image: "/src/assets/images/Subcategories/Living/Climate/Services/Equipment/one.jpg",
          description: "Energy-efficient HVAC systems and air purifiers.",
          price: "10.00"
        },
        {
          id: "climate-equipment-2",
          image: "/src/assets/images/Subcategories/Living/Climate/Services/Equipment/two.jpg",
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
      "/src/assets/images/Subcategories/Living/Guardian/Projects/one.jpg",
      "/src/assets/images/Subcategories/Living/Guardian/Projects/two.jpg",
      "/src/assets/images/Subcategories/Living/Guardian/Projects/three.jpg"
    ],
    services: {
      design: [
        {
          id: "guardian-design-1",
          image: "/src/assets/images/Subcategories/Living/Guardian/Services/Design/one.jpg",
          description: "Security system planning for homes and businesses.",
          price: "10.00"
        },
        {
          id: "guardian-design-2",
          image: "/src/assets/images/Subcategories/Living/Guardian/Services/Design/two.jpg",
          description: "Surveillance layout optimization.",
          price: "10.00"
        }
      ],
      installation: [
        {
          id: "guardian-installation-1",
          image: "/src/assets/images/Subcategories/Living/Guardian/Services/Installation/one.jpg",
          description: "Deployment of biometric access and alarm systems.",
          price: "10.00"
        },
        {
          id: "guardian-installation-2",
          image: "/src/assets/images/Subcategories/Living/Guardian/Services/Installation/two.jpg",
          description: "Setup of remote security control hubs.",
          price: "10.00"
        }
      ],
      equipment: [
        {
          id: "guardian-equipment-1",
          image: "/src/assets/images/Subcategories/Living/Guardian/Services/Equipment/one.jpg",
          description: "High-resolution surveillance cameras and smart locks.",
          price: "10.00"
        },
        {
          id: "guardian-equipment-2",
          image: "/src/assets/images/Subcategories/Living/Guardian/Services/Equipment/two.jpg",
          description: "Advanced motion detection and alarm systems.",
          price: "10.00"
        }
      ]
    }
  }
];