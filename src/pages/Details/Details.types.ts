export interface Service {
  id: string;
  image: string;
  description: string;
  price: string;
}

export interface Detail {
  id: string;
  title: string;
  description: string;
  projects: string[];
  services: {
      design: Service[];       // Ahora es un array
      installation: Service[]; // Ahora es un array
      equipment: Service[];    // Ahora es un array
  };
}