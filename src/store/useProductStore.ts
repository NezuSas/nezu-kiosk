import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Product {
  id: string;
  price: number;
  image?: string; // URL de imagen opcional
}

export interface CartItem extends Product {
  quantity: number;
  category: string;
  subCategory: string;
  serviceType: string;
}

interface ProductStore {
  products: Product[];
  cart: CartItem[];
  total: number;
  addedToCart: Record<string, boolean>;

  addProduct: (product: Product) => void;
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
}

export const useProductStore = create<ProductStore>()(
  persist(
    (set, _get) => ({
      products: [],
      cart: [],
      total: 0,
      addedToCart: {},

      // Agregar un nuevo producto al catálogo
      addProduct: (product) =>
        set((state) => ({
          products: [...state.products, product],
        })),

      // Agregar un producto al carrito
      addToCart: (item) =>
        set((state) => {
          const cartItem = state.cart.find((p) => p.id === item.id);
          if (cartItem) {
            return {
              cart: state.cart.map((p) =>
                p.id === item.id ? { ...p, quantity: p.quantity + 1 } : p
              ),
              total: state.total + item.price,
              addedToCart: { ...state.addedToCart, [item.id]: true },
            };
          } else {
            return {
              cart: [...state.cart, { ...item, quantity: 1 }],
              total: state.total + item.price,
              addedToCart: { ...state.addedToCart, [item.id]: true },
            };
          }
        }),

      // Eliminar un producto del carrito
      removeFromCart: (id) =>
        set((state) => {
          const item = state.cart.find((p) => p.id === id);
          if (!item) return state;

          return {
            cart: state.cart.filter((p) => p.id !== id),
            total: state.total - (item.price * item.quantity),
            addedToCart: { ...state.addedToCart, [id]: false },
          };
        }),

      // Actualizar la cantidad de un producto en el carrito
      updateQuantity: (id, quantity) =>
        set((state) => {
          const item = state.cart.find((i) => i.id === id);
          if (!item) return state;

          if (quantity <= 0) {
            return {
              cart: state.cart.filter((i) => i.id !== id),
              total: state.total - (item.price * item.quantity),
              addedToCart: { ...state.addedToCart, [id]: false },
            };
          }

          const newCart = state.cart.map((i) =>
            i.id === id ? { ...i, quantity } : i
          );

          const newTotal = newCart.reduce(
            (sum, i) => sum + i.price * i.quantity,
            0
          );

          return {
            cart: newCart,
            total: newTotal,
          };
        }),

      // Vaciar el carrito
      clearCart: () => set({ cart: [], total: 0, addedToCart: {} }),
    }),
    {
      name: "cart-storage", // Clave para localStorage
    }
  )
);