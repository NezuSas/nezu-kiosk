import { ReceiptData } from "./Printer.types";

export const DEFAULT_RECEIPT: ReceiptData = {
  orderNumber: "00001",
  customerName: "Cliente Genérico",
  items: [
    { name: "Producto 1", quantity: 1, unitPrice: 100.0 },
    { name: "Producto 2", quantity: 2, unitPrice: 50.0 },
  ],
  total: 200.0,
};