import React from "react";
import Receipt from "../../components/printer/Receipt";
import PrintButton from "../../components/printer/PrintButton";
import styles from "./Printer.module.css";
import { DEFAULT_RECEIPT } from "./Printer.constants";

const Printer: React.FC = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>🖨️ Imprimir Recibo</h1>
      <Receipt
        orderNumber={DEFAULT_RECEIPT.orderNumber}
        customerName={DEFAULT_RECEIPT.customerName}
        items={DEFAULT_RECEIPT.items}
        total={DEFAULT_RECEIPT.total}
      />
      <PrintButton />
    </div>
  );
};

export default Printer;
