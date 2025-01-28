import { type ReactNode } from 'react';

export interface ButtonProps {
  width?: string;
  onClick?: () => void;
  children: ReactNode;
}