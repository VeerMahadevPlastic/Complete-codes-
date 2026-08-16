'use client';

import { useStore } from '../context/GlobalStateContext';
import { ProductCard } from './ProductCard';

export function ProductShowcase() {
  const { products, isProductsLoading, productsError } = useStore();
  return (
    <section className="mx-auto max-w-7xl px-4 py-12">
      <div className="mb-8 flex flex-col justify-between gap-3 md:flex-row md:items-end">
        <div><p className="text-xs font-black uppercase tracking-[0.32em] text-emerald-700">Cinematic product reel</p><h2 className="mt-2 text-4xl font-black">Featured wholesale matrix</h2></div>
        <p className="max-w-xl text-slate-600">Product visuals stay prominent while pricing metadata reveals in refined, stable panels for frictionless mobile browsing.</p>
      </div>
      {productsError && <p className="mb-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800">Live API unavailable; showing manually scanned storefront catalog fallback.</p>}
      {isProductsLoading && <p className="mb-4 text-sm font-semibold text-slate-500">Refreshing product feed…</p>}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => <ProductCard key={product.itemCode} product={product} />)}
      </div>
    </section>
  );
}
