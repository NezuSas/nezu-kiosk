import React, { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import styles from "./ThankYouPage.module.css";
import { useProductStore } from "@/store";
import PrintButton from "@/components/printer/PrintButton";
import Receipt from "@/components/printer/Receipt";

export const ThankYouPage: React.FC = () => {
  const { cart, total } = useProductStore();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get("session");

  useEffect(() => {
    if (!sessionId) {
      navigate("/");
    } else {
      //   const timer = setTimeout(() => {
      //     navigate("/");
      //   }, 10000);
      //   return () => clearTimeout(timer);
    }
  }, [sessionId, navigate]);

  if (!sessionId) {
    return null;
  }

  return (
    <div className={styles.container}>
      <img
        src="/images/logo_color.avif"
        alt="Nezu Logo"
        className={styles.logo}
      />
      <h1 className={styles.message}>¡Gracias por tu compra!</h1>
      <p className={styles.subMessage}>
        Tu transacción ha sido procesada con éxito. Esperamos verte pronto.
      </p>
      <div className={styles.thankYouIcon}>🎉</div>
      <div className={styles.hiddenReceipt}>
        <Receipt
          orderNumber="0"
          customerName="Nelson Patiño"
          items={cart.map((item) => ({
            name: item.id,
            quantity: item.quantity,
            unitPrice: item.price,
          }))}
          total={total}
        />
      </div>
      <PrintButton />
    </div>
  );
};

export default ThankYouPage;