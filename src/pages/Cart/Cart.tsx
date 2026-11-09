import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Cart.module.css";
import { CartItem } from "@/components/common/CartItem";
import { useProductStore } from "@/store";
import { QrButton } from "@/components/common/QrButton";
import { formatPrice, kioskConfig } from "@/kiosk.config";
import io from "socket.io-client";

const { texts } = kioskConfig;

export const Cart: React.FC = () => {
  const { cart, updateQuantity, removeFromCart, total } = useProductStore();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const navigate = useNavigate();

  // Once the customer scans the QR, the phone sends the form data through the realtime server and the kiosk moves on.
  useEffect(() => {
    if (!sessionId) return;
    const socket = io("/");
    socket.emit("register_session", sessionId);
    socket.on("message", (message) => {
      localStorage.setItem(`formData-${sessionId}`, JSON.stringify(message));
      if (message.paymentMethod === "QR") {
        navigate(`/payment-options?session=${sessionId}`);
      } else if (message.paymentMethod === "TARJETA") {
        navigate(`/datafast-instructions?session=${sessionId}`);
      }
    });
    const handlePageHide = () => socket.disconnect();
    window.addEventListener("pagehide", handlePageHide);
    return () => {
      socket.off("message");
      window.removeEventListener("pagehide", handlePageHide);
    };
  }, [sessionId, navigate]);

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className={styles.container}>
      <button className={styles.backButton} onClick={handleGoBack}>
        ← {texts.back}
      </button>
      <div className={styles.cartContainer}>
        <h1 className={styles.title}>🛒 {texts.cart}</h1>

        {cart.length === 0 ? (
          <div className={styles.emptyState}>
            <p className={styles.emptyCart}>{texts.emptyCart}</p>
            <button className={styles.browseButton} onClick={() => navigate("/categories")}>
              {texts.browseCatalog}
            </button>
          </div>
        ) : (
          <div className={styles.cartList}>
            {cart.map((item) => (
              <CartItem
                key={item.id}
                id={item.id}
                name={item.name ?? item.id}
                price={item.price}
                quantity={item.quantity}
                image={item.image ?? ""}
                onIncrease={() => updateQuantity(item.id, item.quantity + 1)}
                onDecrease={() => updateQuantity(item.id, item.quantity - 1)}
                onRemove={() => removeFromCart(item.id)}
              />
            ))}
          </div>
        )}

        {cart.length > 0 && (
          <div className={styles.totalContainer}>
            <h2 className={styles.totalTitle}>{texts.total}: {formatPrice(total)}</h2>
          </div>
        )}

        {cart.length > 0 && <QrButton setSessionId={setSessionId} />}
      </div>
    </div>
  );
};

export default Cart;
