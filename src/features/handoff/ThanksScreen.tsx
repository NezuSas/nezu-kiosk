import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useKiosk } from "@/app/kiosk";
import { useSelection, useSelectionStore } from "@/state/selectionStore";
import { useHandoffStore } from "@/state/handoffStore";
import { renderReceipt } from "@/infrastructure/printing/renderReceipt";
import { Screen } from "@/ui/layout";
import { Button } from "@/ui/primitives";
import { Icon } from "@/ui/icons/Icon";
import { KioskFooter } from "@/features/catalog/KioskFooter";
import { Receipt } from "./Receipt";
import styles from "./ThanksScreen.module.css";

/** Cierre del recorrido: confirma, ofrece imprimir en modo pago y deja el kiosko limpio para el siguiente cliente. */
export const ThanksScreen = () => {
  const navigate = useNavigate();
  const { config, texts, printer, formatPrice } = useKiosk();
  const { selection, total } = useSelection();
  const clear = useSelectionStore((state) => state.clear);
  const submission = useHandoffStore((state) => state.submission);
  const reset = useHandoffStore((state) => state.reset);
  const receiptRef = useRef<HTMLDivElement>(null);
  const [printState, setPrintState] = useState<"idle" | "printing" | "done" | "failed">("idle");

  const finish = () => {
    clear();
    reset();
    navigate("/");
  };

  const print = async () => {
    if (!receiptRef.current) return;
    setPrintState("printing");
    try {
      await printer.print(await renderReceipt(receiptRef.current));
      setPrintState("done");
    } catch {
      setPrintState("failed");
    }
  };

  const contact = submission?.contact;
  const reach = contact?.phone || contact?.email;

  return (
    <Screen title={config.business.name} backLabel={texts.catalog.back} footer={<KioskFooter />}>
      <div className={styles.wrap}>
        <span className={styles.mark} aria-hidden="true">
          <Icon name="check" size="2.6rem" />
        </span>
        <h2 className={styles.title}>{texts.thanks.title}</h2>
        <p className={styles.body}>{texts.thanks.body}</p>
        {reach && <p className={styles.contact}>{reach}</p>}
        <div className={styles.actions}>
          {config.mode === "payment" && (
            <Button variant="secondary" icon="printer" onClick={print} disabled={printState === "printing"}>
              {printState === "done" ? `${texts.thanks.print} ✓` : texts.thanks.print}
            </Button>
          )}
          <Button icon="home" onClick={finish}>
            {texts.thanks.done}
          </Button>
        </div>
      </div>
      {config.mode === "payment" && (
        <div className={styles.hidden} aria-hidden="true">
          <Receipt
            ref={receiptRef}
            business={config.business}
            customer={contact}
            items={selection.items}
            total={total === undefined ? undefined : formatPrice(total)}
            formatPrice={formatPrice}
          />
        </div>
      )}
    </Screen>
  );
};
