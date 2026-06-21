import { createContext, useContext, useState, useCallback } from "react";
import { products as staticProducts } from "@/data/products";
import type { Product } from "@/data/products";

export type ProductOverride = Partial<Omit<Product, "id" | "sku" | "category">>;

interface CatalogContextValue {
  products: Product[];
  updateProduct: (id: string, changes: ProductOverride) => void;
  resetProduct: (id: string) => void;
  resetAll: () => void;
  isModified: (id: string) => boolean;
  modifiedCount: number;
}

const STORAGE_KEY = "vm_catalog_v1";
const CatalogContext = createContext<CatalogContextValue | null>(null);

function loadOverrides(): Record<string, ProductOverride> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}

function saveOverrides(overrides: Record<string, ProductOverride>) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides)); } catch { /* noop */ }
}

export function CatalogProvider({ children }: { children: React.ReactNode }) {
  const [overrides, setOverrides] = useState<Record<string, ProductOverride>>(loadOverrides);

  const products = staticProducts.map(p => ({ ...p, ...(overrides[p.id] ?? {}) }));

  const updateProduct = useCallback((id: string, changes: ProductOverride) => {
    setOverrides(prev => {
      const next = { ...prev, [id]: { ...(prev[id] ?? {}), ...changes } };
      saveOverrides(next);
      return next;
    });
  }, []);

  const resetProduct = useCallback((id: string) => {
    setOverrides(prev => {
      const next = { ...prev };
      delete next[id];
      saveOverrides(next);
      return next;
    });
  }, []);

  const resetAll = useCallback(() => {
    setOverrides({});
    saveOverrides({});
  }, []);

  const isModified = useCallback((id: string) => id in overrides, [overrides]);
  const modifiedCount = Object.keys(overrides).length;

  return (
    <CatalogContext.Provider value={{ products, updateProduct, resetProduct, resetAll, isModified, modifiedCount }}>
      {children}
    </CatalogContext.Provider>
  );
}

export function useCatalog() {
  const ctx = useContext(CatalogContext);
  if (!ctx) throw new Error("useCatalog must be used within CatalogProvider");
  return ctx;
}
