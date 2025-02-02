export interface ReceiptItem {
    name: string;
    quantity: number;
    unitPrice: number;
  }
  
  export interface ReceiptData {
    orderNumber: string;
    customerName: string;
    items: ReceiptItem[];
    total: number;
  }