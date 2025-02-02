import { CartItemProps } from "@/components/common/CartItem/CartItem.types";

export interface CartProps {
  items: CartItemProps[];
  onIncrease: (id: string) => void;
  onDecrease: (id: string) => void;
  onRemove: (id: string) => void;
  onConfirmOrder: () => void;
}