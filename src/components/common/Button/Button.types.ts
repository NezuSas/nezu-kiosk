type Variant = 'primary' | 'secondary' | 'danger';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  width?: string;
  variant?: Variant;
}