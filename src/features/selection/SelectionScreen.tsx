import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useKiosk } from "@/app/kiosk";
import { useSelection, useSelectionStore } from "@/state/selectionStore";
import { Screen } from "@/ui/layout";
import { Button } from "@/ui/primitives";
import { KioskFooter } from "@/features/catalog/KioskFooter";
import { HandoffDialog } from "@/features/handoff/HandoffDialog";
import { SelectionRow } from "./SelectionRow";
import styles from "./SelectionScreen.module.css";

/** La selección del cliente, con el total cuando hay precios y el botón que la traspasa al teléfono. */
export const SelectionScreen = () => {
  const navigate = useNavigate();
  const { config, texts, formatPrice } = useKiosk();
  const { selection, total } = useSelection();
  const setQuantity = useSelectionStore((state) => state.setQuantity);
  const remove = useSelectionStore((state) => state.remove);
  const [handoffOpen, setHandoffOpen] = useState(false);
  const empty = selection.items.length === 0;

  return (
    <Screen title={texts.selection.title} onBack={() => navigate(-1)} backLabel={texts.catalog.back} footer={<KioskFooter />}>
      {empty ? (
        <div className={styles.empty}>
          <h2 className={styles.emptyTitle}>{texts.selection.emptyTitle}</h2>
          <p className={styles.emptyBody}>{texts.selection.emptyBody}</p>
          <Button iconAfter="arrow-right" onClick={() => navigate("/categories")}>
            {texts.selection.browse}
          </Button>
        </div>
      ) : (
        <>
          <div className={styles.list}>
            {selection.items.map((item) => (
              <SelectionRow
                key={item.serviceId}
                item={item}
                mode={config.mode}
                price={item.price === undefined ? undefined : formatPrice(item.price * item.quantity)}
                texts={texts.selection}
                onQuantity={(quantity) => setQuantity(item.serviceId, quantity)}
                onRemove={() => remove(item.serviceId)}
              />
            ))}
          </div>
          <div className={styles.summary}>
            {total === undefined ? (
              <p className={styles.note}>{texts.catalog.pricingNote}</p>
            ) : (
              <div>
                <div className={styles.totalLabel}>{texts.selection.total}</div>
                <div className={styles.total}>{formatPrice(total)}</div>
              </div>
            )}
            <Button size="large" icon="qr" onClick={() => setHandoffOpen(true)}>
              {texts.selection.continue}
            </Button>
          </div>
          <HandoffDialog open={handoffOpen} onClose={() => setHandoffOpen(false)} />
        </>
      )}
    </Screen>
  );
};
