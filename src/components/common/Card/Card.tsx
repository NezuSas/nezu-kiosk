import { type CardProps } from "./Card.types";
import styles from "./Card.module.css";

export const Card = ({ title, imageUrl, onClick, ...props }: CardProps) => (
  <button
    id={title}
    className={styles.container}
    onClick={onClick}
    type="button"
    aria-label={title}
    {...props}
  >
    <img src={imageUrl} alt={title} className={styles.image} />
    <h2 className={styles.title}>{title}</h2>
  </button>
);