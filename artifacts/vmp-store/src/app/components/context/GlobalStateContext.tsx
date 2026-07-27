'use client';

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { useListCategories, useListProducts } from '../../hooks/catalog';

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
export type SavedAddress = {
  id: string;
  fullName: string;
  phone: string;
  street: string;
  landmark?: string;
  cityOrDistrict: string;
  state: string;
  pinCode: string;
  deliveryPreference?: string;
};

export type BusinessSession = {
  businessName: string;
  emailOrPhone: string;
  phone?: string;
  token: string;
  verifiedAt: string;
  defaultAddress?: SavedAddress;
};

type StoreState = {
  currency: CurrencyCode;
  setCurrency: (currency: CurrencyCode) => void;
  products: Product[];
  categories: string[];
  isProductsLoading: boolean;
  productsError: string | null;
  cart: CartItem[];
  addToCart: (product: Product) => void;
  updateCartQuantity: (itemCode: string, quantity: number) => void;
  clearCart: () => void;
  session: BusinessSession | null;
  setSession: (session: BusinessSession | null) => void;
  formatMoney: (amountInr: number) => string;
  saveDefaultAddress: (address: SavedAddress) => void;
};

const rates: Record<CurrencyCode, { symbol: string; multiplier: number }> = {
  INR: { symbol: '₹', multiplier: 1 },
  USD: { symbol: '$', multiplier: 0.012 },
  GBP: { symbol: '£', multiplier: 0.0095 },
  TRY: { symbol: '₺', multiplier: 0.39 },
  RUB: { symbol: '₽', multiplier: 1.08 },
};

const StoreContext = createContext<StoreState | null>(null);

export function GlobalStateProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrency] = useState<CurrencyCode>('INR');
  const { products, isLoading: isProductsLoading, error: productsError } = useListProducts();
  const categories = useListCategories(products);
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
    products,
    categories,
    isProductsLoading,
    productsError,
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
    saveDefaultAddress: (address) => {
      const nextSession = session ? { ...session, defaultAddress: address, phone: address.phone } : { businessName: address.fullName, emailOrPhone: address.phone, phone: address.phone, token: `vmp_${crypto.randomUUID()}`, verifiedAt: new Date().toISOString(), defaultAddress: address };
      setSession(nextSession);
    },
  }), [cart, categories, currency, isProductsLoading, products, productsError, session]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used inside GlobalStateProvider');
  return context;
}
