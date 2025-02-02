export interface CartItemProps {
    id: string;
    price: number;
    quantity: number;
    image: string;
    onIncrease: () => void;
    onDecrease: () => void;
    onRemove: () => void;
}