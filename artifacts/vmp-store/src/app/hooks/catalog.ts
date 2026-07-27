'use client';

import { useEffect, useMemo, useState } from 'react';
import type { Product } from '../components/context/GlobalStateContext';

export const CORE_CATEGORIES = [
  'Cornstarch Meal Trays',
  'Cornstarch Containers',
  'Cornstarch Plates & Cutlery',
  'Biodegradable Glasses',
  'Meal Trays (PP)',
  'Hinged Boxes',
  'Bakery Boxes',
  'PP Containers',
] as const;

export const manualCatalogProducts: Product[] = [
  { id: '7041', itemCode: '7041', name: '3CP Meal Tray with Lid', category: 'Cornstarch Meal Trays', imageUrl: 'https://i.postimg.cc/L8m7Lx3G/black-meal-tray-stack.png', rawBasePriceInr: 4400, pcsPerPacket: 400, cartonsPerBox: 1 },
  { id: '7043', itemCode: '7043', name: '4CP Meal Tray with Lid', category: 'Cornstarch Meal Trays', imageUrl: 'https://i.postimg.cc/L8m7Lx3G/black-meal-tray-stack.png', rawBasePriceInr: 4890, pcsPerPacket: 300, cartonsPerBox: 1 },
  { id: '7045', itemCode: '7045', name: '5CP Meal Tray with Lid', category: 'Cornstarch Meal Trays', imageUrl: 'https://i.postimg.cc/L8m7Lx3G/black-meal-tray-stack.png', rawBasePriceInr: 5055, pcsPerPacket: 300, cartonsPerBox: 1 },
  { id: '7048', itemCode: '7048', name: '8CP Meal Tray with Lid', category: 'Cornstarch Meal Trays', imageUrl: 'https://i.postimg.cc/L8m7Lx3G/black-meal-tray-stack.png', rawBasePriceInr: 4700, pcsPerPacket: 200, cartonsPerBox: 1 },
  { id: '7063', itemCode: '7063', name: '350ML Round Container with Lid', category: 'Cornstarch Containers', imageUrl: 'https://i.postimg.cc/k5ccfQqG/round-container.png', rawBasePriceInr: 3760, pcsPerPacket: 800, cartonsPerBox: 1 },
  { id: '7065', itemCode: '7065', name: '500ML Round Container with Lid', category: 'Cornstarch Containers', imageUrl: 'https://i.postimg.cc/k5ccfQqG/round-container.png', rawBasePriceInr: 4800, pcsPerPacket: 800, cartonsPerBox: 1 },
  { id: 'VMP-CUT-11', itemCode: 'VMP-CUT-11', name: '11 Inch 4CP Round Plate', category: 'Cornstarch Plates & Cutlery', imageUrl: 'https://i.postimg.cc/52rXmQZ5/round-plate.png', rawBasePriceInr: 3250, pcsPerPacket: 500, cartonsPerBox: 1 },
  { id: 'VMP-BIO-500', itemCode: 'VMP-BIO-500', name: 'Biodegradable Glass 500ML', category: 'Biodegradable Glasses', imageUrl: 'https://i.postimg.cc/D0Z9JvFq/bubble-tea-cup.png', rawBasePriceInr: 2520, pcsPerPacket: 500, cartonsPerBox: 1 },
  { id: 'VMP-PP-4CP', itemCode: 'VMP-PP-4CP', name: '4CP Meal Tray Black / Milky', category: 'Meal Trays (PP)', imageUrl: 'https://i.postimg.cc/B6rQWn0P/pp-meal-tray.png', rawBasePriceInr: 4170, pcsPerPacket: 800, cartonsPerBox: 1 },
  { id: 'VMP-HB-750', itemCode: 'VMP-HB-750', name: '750ML Hinged Box', category: 'Hinged Boxes', imageUrl: 'https://i.postimg.cc/L6M93KDb/hinged-box.png', rawBasePriceInr: 3920, pcsPerPacket: 600, cartonsPerBox: 1 },
  { id: 'VMP-BK-CAKE', itemCode: 'VMP-BK-CAKE', name: 'Clear Bakery Cake Box', category: 'Bakery Boxes', imageUrl: 'https://i.postimg.cc/y6j72sQ1/bakery-box.png', rawBasePriceInr: 2860, pcsPerPacket: 400, cartonsPerBox: 1 },
  { id: 'VMP-PP-1000', itemCode: 'VMP-PP-1000', name: '1000ML PP Container', category: 'PP Containers', imageUrl: 'https://i.postimg.cc/k5ccfQqG/round-container.png', rawBasePriceInr: 5150, pcsPerPacket: 600, cartonsPerBox: 1 },
];

type ApiProduct = Partial<Product> & {
  item_code?: string;
  image_url?: string;
  raw_base_price_inr?: string | number;
  pcs_per_packet?: number;
  cartons_per_box?: number;
};

function normalizeProduct(product: ApiProduct): Product {
  return {
    id: String(product.id ?? product.itemCode ?? product.item_code ?? crypto.randomUUID()),
    itemCode: String(product.itemCode ?? product.item_code ?? product.id ?? 'VMP-NEW'),
    name: String(product.name ?? 'VMP Product'),
    category: String(product.category ?? 'PP Containers'),
    imageUrl: String(product.imageUrl ?? product.image_url ?? '/assets/products/placeholder.png'),
    rawBasePriceInr: Number(product.rawBasePriceInr ?? product.raw_base_price_inr ?? 0),
    pcsPerPacket: Number(product.pcsPerPacket ?? product.pcs_per_packet ?? 1),
    cartonsPerBox: Number(product.cartonsPerBox ?? product.cartons_per_box ?? 1),
  };
}

export function useListProducts() {
  const [products, setProducts] = useState<Product[]>(manualCatalogProducts);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setIsLoading(true);
    fetch('/api/products')
      .then((response) => response.ok ? response.json() : Promise.reject(new Error(`HTTP ${response.status}`)))
      .then((payload) => {
        const rows = Array.isArray(payload?.products) ? payload.products : Array.isArray(payload) ? payload : [];
        if (active && rows.length) setProducts(rows.map(normalizeProduct));
      })
      .catch((reason) => {
        if (active) setError(reason instanceof Error ? reason.message : 'Unable to load products');
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => { active = false; };
  }, []);

  return { products, isLoading, error };
}

export function useListCategories(products: Product[] = manualCatalogProducts) {
  return useMemo(() => {
    const fromProducts = products.map((product) => product.category).filter(Boolean);
    return Array.from(new Set([...CORE_CATEGORIES, ...fromProducts]));
  }, [products]);
}
