import { type ButtonProps } from "./Button.types";
import styles from "./Button.module.css";

export const Button = ({ width, className, ...props }: ButtonProps) => {
  const buttonClassName = `${styles.button} ${
    width === "100%" ? styles.fullWidth : ""
  } ${className || ""}`;

  return <button className={buttonClassName} {...props} />;
};
