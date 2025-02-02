import React from "react";
import { printReceipt } from "../../integrations/printer/PrinterService";
import styles from "./Printer.module.css";

const PrintButton: React.FC = () => {
  return (
    <button onClick={printReceipt} className={styles.printButton}>
      🖨️ Imprimir Recibo
    </button>
  );
};

export default PrintButton;