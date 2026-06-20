import { createContext, useContext, useState, useCallback } from "react";
import type { Product } from "@/data/products";
import { getTierPrice } from "@/data/products";

export interface CartItem {
  product: Product;
  boxes: number;  // qty in boxes (the wholesale unit)
}

interface CartContextValue {
  items: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (id: string) => void;
  updateBoxes: (id: string, boxes: number) => void;
  clearCart: () => void;
  count: number;
  isInCart: (id: string) => boolean;
  grandTotal: number;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = useCallback((product: Product) => {
    setItems((prev) => {
      if (prev.some((i) => i.product.id === product.id)) return prev;
      return [...prev, { product, boxes: 1 }];
    });
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.product.id !== id));
  }, []);

  const updateBoxes = useCallback((id: string, boxes: number) => {
    setItems((prev) =>
      prev.map((i) => i.product.id === id ? { ...i, boxes: Math.max(1, boxes) } : i)
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const count = items.length;

  const isInCart = useCallback((id: string) => items.some((i) => i.product.id === id), [items]);

  const grandTotal = items.reduce((sum, item) => {
    const { pricePerBox } = getTierPrice(item.product, item.boxes);
    return sum + pricePerBox * item.boxes;
  }, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateBoxes, clearCart, count, isInCart, grandTotal }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
