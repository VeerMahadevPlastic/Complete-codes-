import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { products as staticProducts } from "@/data/products";
import type { Product } from "@/data/products";

export type ProductOverride = Partial<Omit<Product, "id" | "sku" | "category">>;

interface CatalogContextValue {
  products: Product[];
  loading: boolean;
  updateProduct: (id: string, changes: ProductOverride) => Promise<void>;
  resetProduct: (id: string) => Promise<void>;
  resetAll: () => Promise<void>;
  isModified: (id: string) => boolean;
  modifiedCount: number;
}

const CatalogContext = createContext<CatalogContextValue | null>(null);
const API_BASE = "/api/products/overrides";

export function CatalogProvider({ children }: { children: React.ReactNode }) {
  const [overrides, setOverrides] = useState<Record<string, ProductOverride>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(API_BASE)
      .then((r) => {
        if (!r.ok) throw new Error("API error");
        return r.json() as Promise<Record<string, ProductOverride>>;
      })
      .then((data) => {
        setOverrides(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const products = staticProducts.map((p) => ({
    ...p,
    ...(overrides[p.id] ?? {}),
  }));

  const updateProduct = useCallback(async (id: string, changes: ProductOverride) => {
    setOverrides((prev) => ({ ...prev, [id]: { ...(prev[id] ?? {}), ...changes } }));
    const res = await fetch(`${API_BASE}/${encodeURIComponent(id)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(changes),
    });
    if (!res.ok) throw new Error("Failed to save");
  }, []);

  const resetProduct = useCallback(async (id: string) => {
    setOverrides((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
    const res = await fetch(`${API_BASE}/${encodeURIComponent(id)}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to reset");
  }, []);

  const resetAll = useCallback(async () => {
    setOverrides({});
    const res = await fetch(API_BASE, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to reset all");
  }, []);

  const isModified = useCallback((id: string) => id in overrides, [overrides]);
  const modifiedCount = Object.keys(overrides).length;

  return (
    <CatalogContext.Provider
      value={{ products, loading, updateProduct, resetProduct, resetAll, isModified, modifiedCount }}
    >
      {children}
    </CatalogContext.Provider>
  );
}

export function useCatalog() {
  const ctx = useContext(CatalogContext);
  if (!ctx) throw new Error("useCatalog must be used within CatalogProvider");
  return ctx;
}
