'use client';

import { useStore } from '../context/GlobalStateContext';
import { ProductCard } from './ProductCard';

export function ProductShowcase() {
  const { products } = useStore();
  return (
    <section className="mx-auto max-w-7xl px-4 py-12">
      <div className="mb-8 flex flex-col justify-between gap-3 md:flex-row md:items-end">
        <div><p className="text-xs font-black uppercase tracking-[0.32em] text-emerald-700">Cinematic product reel</p><h2 className="mt-2 text-4xl font-black">Featured wholesale matrix</h2></div>
        <p className="max-w-xl text-slate-600">Product visuals stay prominent while pricing metadata reveals in refined, stable panels for frictionless mobile browsing.</p>
      </div>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => <ProductCard key={product.itemCode} product={product} />)}
      </div>
    </section>
  );
}
