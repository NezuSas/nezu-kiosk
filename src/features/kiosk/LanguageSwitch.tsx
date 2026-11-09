import { useKiosk } from "@/app/kiosk";
import { defaultTexts, type Language } from "@/config/texts";
import { useLanguageStore } from "@/state/languageStore";
import { cn } from "@/shared/utils/cn";
import styles from "./LanguageSwitch.module.css";

/** Un botón por idioma configurado; se oculta cuando solo hay uno. Cada botón se nombra en su propio idioma. */
export const LanguageSwitch = () => {
  const { config, events } = useKiosk();
  const language = useLanguageStore((state) => state.language);
  const setLanguage = useLanguageStore((state) => state.setLanguage);
  if (config.languages.length < 2) return null;

  const choose = (next: Language) => {
    if (next === language) return;
    setLanguage(next);
    events.track({ name: "language_changed", ref: next, language: next });
  };

  return (
    <div className={styles.switch} role="group" aria-label="Idioma / Language">
      {config.languages.map((option) => (
        <button
          key={option}
          type="button"
          className={cn(styles.option, option === language && styles.active)}
          aria-pressed={option === language}
          lang={option}
          onClick={() => choose(option)}
        >
          {defaultTexts(config.mode, option).kiosk.languageName}
        </button>
      ))}
    </div>
  );
};
