import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Cart.module.css";
import { CartItem } from "@/components/common/CartItem";
import { useProductStore } from "@/store";
import { QrButton } from "@/components/common/QrButton";
import io from "socket.io-client";


export const Cart: React.FC = () => {
  const { cart, updateQuantity, removeFromCart, total } = useProductStore();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const navigate = useNavigate();

  
  useEffect(() => {
    if (!sessionId) return;
    
    const socket = io("/");
    console.log("🔗 Registrando sesión en /cart...", sessionId);
    socket.emit("register_session", sessionId);

    socket.on("message", (message) => {
      console.log("📩 Datos recibidos en /cart:", message);
      localStorage.setItem(`formData-${sessionId}`, JSON.stringify(message));

      // Redirigir según el método de pago
      if (message.paymentMethod === "QR") {
        navigate(`/payment-options?session=${sessionId}`);
      } else if (message.paymentMethod === "TARJETA") {
        navigate(`/datafast-instructions?session=${sessionId}`);
      }
    });

    const handlePageHide = () => {
      console.log("🔌 Cerrando conexión WebSocket...");
      socket.disconnect();
    };

    window.addEventListener("pagehide", handlePageHide);

    return () => {
      console.log("❌ Eliminando listener en /cart...");
      socket.off("message");
    };
  }, [sessionId]);

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className={styles.container}>
      <button className={styles.backButton} onClick={handleGoBack}>
        ← Regresar
      </button>
      <div className={styles.cartContainer}>
        {/* Título con icono */}
        <h1 className={styles.title}>🛒 Carrito de Compras</h1>

        {/* Lista de productos */}
        {cart.length === 0 ? (
          <p className={styles.emptyCart}>Tu carrito está vacío.</p>
        ) : (
          <div className={styles.cartList}>
            {cart.map((item) => (
              <CartItem
                key={item.id}
                id={item.id}
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

        {/* Total del Carrito */}
        {cart.length > 0 && (
          <div className={styles.totalContainer}>
            <h2 className={styles.totalTitle}>Total: ${total.toFixed(2)}</h2>
          </div>
        )}

        {/* Botón de Confirmar Pedido */}
        {cart.length > 0 && <QrButton setSessionId={setSessionId} />}
      </div>
    </div>
  );
};

export default Cart;