import { useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/shared/utils/cn";
import { IconButton } from "./Button";
import styles from "./Modal.module.css";

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  /** Identificador del título, para `aria-labelledby`. */
  labelledBy: string;
  closeLabel: string;
  /** Tarjeta clara (paper) en lugar de oscura. */
  light?: boolean;
  children: ReactNode;
}

/** Diálogo modal renderizado sobre `document.body`, para que ningún contenedor con filtros lo atrape. */
export const Modal = ({ open, onClose, labelledBy, closeLabel, light = false, children }: ModalProps) => {
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div className={styles.overlay} onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        className={cn(styles.card, light && "light")}
        onClick={(event) => event.stopPropagation()}
      >
        <IconButton icon="close" label={closeLabel} variant="ghost" className={styles.close} onClick={onClose} />
        {children}
      </div>
    </div>,
    document.body
  );
};
