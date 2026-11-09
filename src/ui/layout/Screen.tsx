import type { ReactNode } from "react";
import { cn } from "@/shared/utils/cn";
import { IconButton } from "@/ui/primitives";
import { Icon } from "@/ui/icons/Icon";
import styles from "./Screen.module.css";

export interface ScreenProps {
  /** Texto pequeño sobre el título: la categoría de la línea, por ejemplo. */
  eyebrow?: string;
  title?: string;
  /** Logotipo en lugar de título, para pantallas de primer nivel. */
  wordmark?: { src: string; alt: string };
  onBack?: () => void;
  backLabel: string;
  /** Insignia de la selección en la esquina derecha. */
  badge?: { label: string; count: number; onClick: () => void };
  /** Controles adicionales a la derecha, antes de la insignia (p. ej. el selector de idioma). */
  tools?: ReactNode;
  /** El contenido sale de los márgenes laterales (bandas a sangre). */
  flush?: boolean;
  footer?: ReactNode;
  children: ReactNode;
}

/**
 * Armazón de toda pantalla del kiosko: barra superior fija con vuelta atrás, título, herramientas e insignia de la
 * selección; contenido con desplazamiento propio; pie opcional.
 */
export const Screen = ({ eyebrow, title, wordmark, onBack, backLabel, badge, tools, flush, footer, children }: ScreenProps) => (
  <div className={styles.screen}>
    <header className={styles.topbar}>
      <div className={styles.lead}>
        {onBack && <IconButton icon="arrow-left" label={backLabel} className={styles.back} onClick={onBack} />}
        {wordmark && (
          <div className={styles.wordmark}>
            <img src={wordmark.src} alt={wordmark.alt} />
          </div>
        )}
        {(title || eyebrow) && (
          <div className={styles.crumbs}>
            {eyebrow && <span className={styles.eyebrow}>{eyebrow}</span>}
            {title && <h1 className={styles.title}>{title}</h1>}
          </div>
        )}
      </div>
      <div className={styles.tools}>
        {tools}
        {badge && (
          <button type="button" className={cn(styles.badge, badge.count > 0 && styles.badgeOn)} onClick={badge.onClick}>
            <Icon name="list" />
            <span>{badge.label}</span>
            <span className={cn(styles.count, badge.count === 0 && styles.countOff)}>{badge.count}</span>
          </button>
        )}
      </div>
    </header>
    <main className={cn(styles.content, flush && styles.flush)}>{children}</main>
    {footer}
  </div>
);
