import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/shared/utils/cn";
import { Icon, type IconName } from "@/ui/icons/Icon";
import styles from "./Button.module.css";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "selected";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: "regular" | "large";
  /** Ocupa todo el ancho disponible. */
  block?: boolean;
  /** Icono a la izquierda del texto; a la derecha con `iconAfter`. */
  icon?: IconName;
  iconAfter?: IconName;
  children?: ReactNode;
}

export const Button = ({
  variant = "primary",
  size = "regular",
  block = false,
  icon,
  iconAfter,
  className,
  children,
  type = "button",
  ...props
}: ButtonProps) => (
  <button
    type={type}
    className={cn(styles.button, styles[variant], size === "large" && styles.large, block && styles.block, className)}
    {...props}
  >
    {icon && <Icon name={icon} />}
    {children}
    {iconAfter && <Icon name={iconAfter} />}
  </button>
);

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: IconName;
  /** Texto para lectores de pantalla; el botón no tiene etiqueta visible. */
  label: string;
  variant?: Exclude<ButtonVariant, "selected">;
}

export const IconButton = ({ icon, label, variant = "secondary", className, type = "button", ...props }: IconButtonProps) => (
  <button type={type} aria-label={label} className={cn(styles.button, styles[variant], styles.iconOnly, className)} {...props}>
    <Icon name={icon} size="1.5em" />
  </button>
);
