import { IconButton } from "./Button";
import styles from "./Stepper.module.css";

export interface StepperProps {
  value: number;
  onChange: (value: number) => void;
  decreaseLabel: string;
  increaseLabel: string;
  min?: number;
}

/** Control de cantidad con dos botones grandes; nunca baja de `min`. */
export const Stepper = ({ value, onChange, decreaseLabel, increaseLabel, min = 0 }: StepperProps) => (
  <div className={styles.stepper}>
    <IconButton icon="minus" label={decreaseLabel} variant="ghost" onClick={() => onChange(Math.max(min, value - 1))} />
    <span className={styles.value} aria-live="polite">
      {value}
    </span>
    <IconButton icon="plus" label={increaseLabel} variant="ghost" onClick={() => onChange(value + 1)} />
  </div>
);
