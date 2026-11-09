export interface Service {
  /** Stable identifier; it is the cart key. */
  id: string;
  title: string;
  image: string;
  description: string;
  /** Price in the configured currency. */
  price: number;
}

export interface Detail {
  id: string;
  title: string;
  description: string;
  projects: string[];
  services: Service[];
}
