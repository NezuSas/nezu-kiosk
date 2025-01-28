import { type ButtonProps } from './Button.types';
import styles from './Button.module.css';

export const Button = ({ width, onClick, children }: ButtonProps) => {
  const buttonClassName = `${styles.button} ${width === '100%' ? styles.fullWidth : styles.autoWidth}`;

  return (
    <button className={buttonClassName} onClick={onClick}>
      {children}
    </button>
  );
};