import React from "react";
import styles from "./CartItem.module.css";
import { CartItemProps } from "./CartItem.types";

export const CartItem: React.FC<CartItemProps> = ({
  id,
  price,
  quantity,
  image,
  onIncrease,
  onDecrease,
  onRemove,
}) => {
  return (
    <div className={styles.cartItem}>
      <img src={image} alt={id} className={styles.itemImage} />
      <div className={styles.itemDetails}>
        <h3 className={styles.itemName}>{id}</h3>
        <p className={styles.itemPrice}>${(price * quantity).toFixed(2)}</p>
        <div className={styles.quantityControls}>
          <button className={styles.decreaseButton} onClick={onDecrease}>
            -
          </button>
          <span className={styles.quantity}>{quantity}</span>
          <button className={styles.increaseButton} onClick={onIncrease}>
            +
          </button>
        </div>
      </div>
      <button className={styles.removeButton} onClick={onRemove}>
        <img
          src="/images/trash.avif"
          alt="Trash"
          className={styles.trashIcon}
        />
      </button>
    </div>
  );
};
