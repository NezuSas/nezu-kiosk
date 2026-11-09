import type { KioskMode } from "@/domain/request";
import type { SelectionItem } from "@/domain/selection";
import type { KioskTexts } from "@/config/texts.es";
import { asset } from "@/shared/utils/asset";
import { IconButton, Stepper } from "@/ui/primitives";
import styles from "./SelectionRow.module.css";

export interface SelectionRowProps {
  item: SelectionItem;
  mode: KioskMode;
  /** Importe de la fila ya formateado (precio × cantidad); ausente sin precio. */
  price?: string;
  texts: KioskTexts["selection"];
  onQuantity: (quantity: number) => void;
  onRemove: () => void;
}

/** Una fila de la selección: contexto, nombre y, según el modo, contador de cantidad o solo quitar. */
export const SelectionRow = ({ item, mode, price, texts, onQuantity, onRemove }: SelectionRowProps) => (
  <article className={styles.row}>
    <img src={asset(item.image)} alt="" className={styles.thumb} />
    <div className={styles.body}>
      <span className={styles.context}>
        {item.categoryName} · {item.lineName}
      </span>
      <h3 className={styles.name}>{item.name}</h3>
      {price && <span className={styles.price}>{price}</span>}
    </div>
    <div className={styles.controls}>
      {mode === "payment" && (
        <Stepper
          value={item.quantity}
          onChange={onQuantity}
          decreaseLabel={`${texts.quantity}: −1`}
          increaseLabel={`${texts.quantity}: +1`}
        />
      )}
      <IconButton icon="trash" label={`${texts.remove}: ${item.name}`} variant="ghost" onClick={onRemove} />
    </div>
  </article>
);
