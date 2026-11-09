export interface CartItemProps {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  onIncrease: () => void;
  onDecrease: () => void;
  onRemove: () => void;
}
