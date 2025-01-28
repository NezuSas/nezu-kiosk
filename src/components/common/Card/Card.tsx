import { type CardProps } from './Card.types';
import styles from './Card.module.css';

export const Card = ({ title, imageUrl, onClick }: CardProps) => (
  <div className={styles.container} onClick={onClick}>
    <img src={imageUrl} alt={title} className={styles.image} />
    <h3 className={styles.title}>{title}</h3>
  </div>
);