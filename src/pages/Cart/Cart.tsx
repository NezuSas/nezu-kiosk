import React from "react";
import styles from "./Cart.module.css";
import { CartItem } from "@/components/common/CartItem";
import { useProductStore } from "@/store";
import PrintButton from "@/components/printer/PrintButton";
import Receipt from "@/components/printer/Receipt";

export const Cart: React.FC = () => {
  const { cart, updateQuantity, removeFromCart, total } = useProductStore();

  return (
    <div className={styles.container}>
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

        {/* Botón de Confirmar Pedido */}
        {cart.length > 0 && (
          <>
            <div className={styles.hiddenReceipt}>
              <Receipt
                orderNumber="0" // Número de orden aleatorio
                customerName="Nelson Patiño" // Se puede cambiar si hay datos del cliente
                items={cart.map((item) => ({
                  name: item.id, // Puedes cambiar esto si tienes un name
                  quantity: item.quantity,
                  unitPrice: item.price,
                }))}
                total={total}
              />
            </div>
            <PrintButton />
          </>
        )}
      </div>
    </div>
  );
};
