import React from "react";
import styles from "./CartItem.module.css";
import { CartItemProps } from "./CartItem.types";
import { asset } from "@/utils/asset";
import { formatPrice } from "@/kiosk.config";

export const CartItem: React.FC<CartItemProps> = ({
  name,
  price,
  quantity,
  image,
  onIncrease,
  onDecrease,
  onRemove,
}) => {
  return (
    <div className={styles.cartItem}>
      <img src={image} alt={name} className={styles.itemImage} />
      <div className={styles.itemDetails}>
        <h3 className={styles.itemName}>{name}</h3>
        <p className={styles.itemPrice}>{formatPrice(price * quantity)}</p>
        <div className={styles.quantityControls}>
          <button className={styles.decreaseButton} onClick={onDecrease} aria-label="Quitar uno">
            -
          </button>
          <span className={styles.quantity}>{quantity}</span>
          <button className={styles.increaseButton} onClick={onIncrease} aria-label="Añadir uno">
            +
          </button>
        </div>
      </div>
      <button className={styles.removeButton} onClick={onRemove} aria-label="Quitar del carrito">
        <img
          src={asset("/images/brand/trash.avif")}
          alt=""
          className={styles.trashIcon}
        />
      </button>
    </div>
  );
};
