import { Navigate, useNavigate, useParams } from "react-router-dom";
import { useKiosk } from "@/app/kiosk";
import { useSelection, useSelectionStore } from "@/state/selectionStore";
import { asset } from "@/shared/utils/asset";
import { cn } from "@/shared/utils/cn";
import { Screen } from "@/ui/layout";
import { KioskFooter } from "./KioskFooter";
import { ServiceRow } from "./ServiceRow";
import styles from "./LineScreen.module.css";

/** Una línea: galería, presentación y la lista de servicios que el cliente puede añadir. */
export const LineScreen = () => {
  const navigate = useNavigate();
  const { categoryId, lineId } = useParams<{ categoryId: string; lineId: string }>();
  const { config, texts, catalog, formatPrice } = useKiosk();
  const { count, selection } = useSelection();
  const add = useSelectionStore((state) => state.add);
  const remove = useSelectionStore((state) => state.remove);
  const category = catalog.category(categoryId);
  const line = catalog.line(categoryId, lineId);

  if (!category || !line) return <Navigate to={category ? `/categories/${category.id}` : "/categories"} replace />;

  const quantityOf = (serviceId: string) => selection.items.find((item) => item.serviceId === serviceId)?.quantity ?? 0;
  const gallery = line.gallery.slice(0, 3);

  return (
    <Screen
      eyebrow={category.name}
      title={line.name}
      onBack={() => navigate(`/categories/${category.id}`)}
      backLabel={texts.catalog.back}
      badge={{ label: texts.catalog.selection, count, onClick: () => navigate("/selection") }}
      flush
      footer={<KioskFooter />}
    >
      <div className={cn(styles.gallery, gallery.length < 3 && styles.single)} aria-label={texts.catalog.galleryTitle}>
        {gallery.map((image) => (
          <img key={image} src={asset(image)} alt="" />
        ))}
      </div>
      <header className={styles.header}>
        <h2 className={styles.name}>{line.name}</h2>
        <p className={styles.lead}>{line.lead}</p>
      </header>
      <h3 className={styles.sectionTitle}>{texts.catalog.servicesTitle}</h3>
      <div className={styles.services}>
        {line.services.map((service) => (
          <ServiceRow
            key={service.id}
            service={service}
            quantity={quantityOf(service.id)}
            mode={config.mode}
            price={service.price === undefined ? undefined : formatPrice(service.price)}
            addLabel={texts.catalog.add}
            addedLabel={texts.catalog.added}
            onAdd={() => add({ category, line, service })}
            onRemove={() => remove(service.id)}
          />
        ))}
      </div>
      {texts.catalog.pricingNote && <p className={styles.note}>{texts.catalog.pricingNote}</p>}
    </Screen>
  );
};
