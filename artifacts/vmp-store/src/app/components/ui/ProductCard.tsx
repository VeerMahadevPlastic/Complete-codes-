'use client';

import type { Product } from '../context/GlobalStateContext';
import { useStore } from '../context/GlobalStateContext';
import { openWhatsAppInquiry } from '../../lib/whatsapp';

export function ProductCard({ product }: { product: Product }) {
  const { session } = useStore();
  const productUrl = typeof window === 'undefined' ? `/products/${product.itemCode}` : `${window.location.origin}/products/${product.itemCode}`;

  return (
    <article className="group relative overflow-hidden rounded-[2rem] border border-black/[0.06] bg-white/75 shadow-sm backdrop-blur-xl backdrop-saturate-150 transition-all duration-250 ease-premium hover:-translate-y-1 hover:shadow-glass transform-gpu will-change-transform">
      <div className="absolute left-4 top-4 z-10 rounded-full bg-emerald-500 px-3 py-1 text-xs font-bold text-white shadow-lg shadow-emerald-500/25">In Stock</div>
      <div className="absolute right-4 top-4 z-10 rounded-full border border-black/10 bg-white/70 px-3 py-1 text-xs font-semibold text-slate-600 backdrop-blur">SKU {product.itemCode}</div>
      <a href={`/products/${product.itemCode}`} className="flex aspect-[4/5] items-center justify-center bg-gradient-to-br from-slate-50 to-emerald-50/40 p-8">
        <img loading="lazy" src={product.imageUrl} alt={product.name} className="h-full max-h-72 w-full object-contain transition duration-500 ease-premium group-hover:scale-105 transform-gpu" />
      </a>
      <div className="space-y-4 p-5">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-emerald-700">{product.category}</p>
          <a href={`/products/${product.itemCode}`} className="mt-2 block min-h-12 text-lg font-black leading-tight text-slate-950 hover:text-emerald-700">{product.name}</a>
          <p className="mt-1 text-sm text-slate-500">{product.pcsPerPacket.toLocaleString()} pcs / box · master-carton inquiry</p>
        </div>
        <div className="rounded-2xl border border-black/[0.06] bg-emerald-50/70 p-3 text-sm text-emerald-900">
          <strong>Best wholesale price on WhatsApp</strong>
          <p className="mt-1 text-xs font-semibold text-emerald-700">No public price shown. Admin shares live quote by SKU and quantity.</p>
        </div>
        <button onClick={() => openWhatsAppInquiry({ product, productUrl, session, address: session?.defaultAddress ?? null })} className="w-full rounded-2xl bg-gradient-to-r from-emerald-600 to-green-500 px-4 py-3 font-black text-white shadow-lg shadow-emerald-600/20 transition duration-250 ease-premium hover:scale-[1.02] hover:shadow-emerald-600/30 transform-gpu">Get Price on WhatsApp</button>
      </div>
    </article>
  );
}
