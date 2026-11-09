import type { Service } from "@/domain/catalog";
import type { KioskMode } from "@/domain/request";
import { asset } from "@/shared/utils/asset";
import { Button } from "@/ui/primitives";
import styles from "./ServiceRow.module.css";

export interface ServiceRowProps {
  service: Service;
  /** Unidades ya elegidas de este servicio. */
  quantity: number;
  mode: KioskMode;
  /** Precio ya formateado; ausente cuando no hay precio. */
  price?: string;
  addLabel: string;
  addedLabel: string;
  onAdd: () => void;
  onRemove: () => void;
}

/**
 * Un servicio en la lista de su línea. En modo cotización el botón alterna (elegido / no elegido); en modo pago
 * cada toque suma una unidad y la cantidad se muestra bajo el botón.
 */
export const ServiceRow = ({ service, quantity, mode, price, addLabel, addedLabel, onAdd, onRemove }: ServiceRowProps) => {
  const chosen = quantity > 0;
  const toggle = mode === "quote";
  return (
    <article className={styles.row}>
      <img src={asset(service.image)} alt="" className={styles.thumb} loading="lazy" />
      <div className={styles.body}>
        <h4 className={styles.name}>{service.name}</h4>
        <p className={styles.summary}>{service.summary}</p>
        {price && <p className={styles.price}>{price}</p>}
      </div>
      <div className={styles.action}>
        <Button
          variant={chosen ? "selected" : "primary"}
          icon={chosen ? "check" : "plus"}
          aria-pressed={toggle ? chosen : undefined}
          onClick={chosen && toggle ? onRemove : onAdd}
        >
          {chosen ? addedLabel : addLabel}
        </Button>
        {!toggle && chosen && <span className={styles.quantity}>×{quantity}</span>}
      </div>
    </article>
  );
};
