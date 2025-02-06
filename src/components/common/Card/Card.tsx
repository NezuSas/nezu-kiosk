import { type CardProps } from "./Card.types";
import styles from "./Card.module.css";

export const Card = ({ title, imageUrl, onClick }: CardProps) => (
  <button
    id={title}
    className={styles.container}
    onClick={onClick}
    type="button"
    aria-label={title}
  >
    <img src={imageUrl} alt="" className={styles.image} aria-hidden="true" />
    <h2 className={styles.title}>{title}</h2>
  </button>
);
