'use client';

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

export type CurrencyCode = 'INR' | 'USD' | 'GBP' | 'TRY' | 'RUB';
export type Product = {
  id: string;
  itemCode: string;
  name: string;
  category: string;
  imageUrl: string;
  rawBasePriceInr: number;
  pcsPerPacket: number;
  cartonsPerBox: number;
};
export type CartItem = Product & { quantity: number };
export type BusinessSession = {
  businessName: string;
  emailOrPhone: string;
  token: string;
  verifiedAt: string;
};

type StoreState = {
  currency: CurrencyCode;
  setCurrency: (currency: CurrencyCode) => void;
  products: Product[];
  cart: CartItem[];
  addToCart: (product: Product) => void;
  updateCartQuantity: (itemCode: string, quantity: number) => void;
  clearCart: () => void;
  session: BusinessSession | null;
  setSession: (session: BusinessSession | null) => void;
  formatMoney: (amountInr: number) => string;
};

const rates: Record<CurrencyCode, { symbol: string; multiplier: number }> = {
  INR: { symbol: '₹', multiplier: 1 },
  USD: { symbol: '$', multiplier: 0.012 },
  GBP: { symbol: '£', multiplier: 0.0095 },
  TRY: { symbol: '₺', multiplier: 0.39 },
  RUB: { symbol: '₽', multiplier: 1.08 },
};

const seedProducts: Product[] = [
  { id: 'p-101', itemCode: 'VMP-101', name: '3CP Meal Tray with Lid', category: 'Cornstarch Meal Trays', imageUrl: '/assets/products/meal-tray.png', rawBasePriceInr: 4400, pcsPerPacket: 400, cartonsPerBox: 1 },
  { id: 'p-102', itemCode: 'VMP-102', name: '4CP Meal Tray with Lid', category: 'Cornstarch Meal Trays', imageUrl: '/assets/products/meal-tray.png', rawBasePriceInr: 4890, pcsPerPacket: 300, cartonsPerBox: 1 },
  { id: 'p-103', itemCode: 'VMP-103', name: 'Round Container with Lid', category: 'Cornstarch Containers', imageUrl: '/assets/products/round-container.png', rawBasePriceInr: 3760, pcsPerPacket: 800, cartonsPerBox: 1 },
  { id: 'p-104', itemCode: 'VMP-104', name: 'Biodegradable Glass Dome', category: 'Biodegradable Glasses', imageUrl: '/assets/products/cup.png', rawBasePriceInr: 2520, pcsPerPacket: 500, cartonsPerBox: 1 },
];

const StoreContext = createContext<StoreState | null>(null);

export function GlobalStateProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrency] = useState<CurrencyCode>('INR');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [session, setSessionState] = useState<BusinessSession | null>(null);

  useEffect(() => {
    const stored = window.sessionStorage.getItem('vmp_b2b_session');
    if (stored) setSessionState(JSON.parse(stored) as BusinessSession);
  }, []);

  const setSession = (next: BusinessSession | null) => {
    setSessionState(next);
    if (next) window.sessionStorage.setItem('vmp_b2b_session', JSON.stringify(next));
    else window.sessionStorage.removeItem('vmp_b2b_session');
  };

  const value = useMemo<StoreState>(() => ({
    currency,
    setCurrency,
    products: seedProducts,
    cart,
    addToCart: (product) => setCart((items) => {
      const existing = items.find((item) => item.itemCode === product.itemCode);
      if (existing) return items.map((item) => item.itemCode === product.itemCode ? { ...item, quantity: item.quantity + 1 } : item);
      return [...items, { ...product, quantity: 1 }];
    }),
    updateCartQuantity: (itemCode, quantity) => setCart((items) => items.map((item) => item.itemCode === itemCode ? { ...item, quantity: Math.max(1, quantity) } : item)),
    clearCart: () => setCart([]),
    session,
    setSession,
    formatMoney: (amountInr) => {
      const rate = rates[currency];
      return `${rate.symbol}${(amountInr * rate.multiplier).toLocaleString(undefined, { maximumFractionDigits: currency === 'INR' ? 0 : 2 })}`;
    },
  }), [cart, currency, session]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used inside GlobalStateProvider');
  return context;
}
