/** Un servicio que el cliente eligió, con el contexto necesario para mostrarlo y enviarlo sin consultar el catálogo. */
export interface SelectionItem {
  serviceId: string;
  name: string;
  image: string;
  price?: number;
  quantity: number;
  categoryId: string;
  categoryName: string;
  lineId: string;
  lineName: string;
}

/** Lo que el cliente va eligiendo en el kiosko: un carrito cuando hay precios, una solicitud cuando no. */
export interface Selection {
  items: SelectionItem[];
}
