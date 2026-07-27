'use client';

import { useMemo, useState } from 'react';
import { useStore } from '../context/GlobalStateContext';
import { openWhatsAppInquiry } from '../../lib/whatsapp';

export function ProductDetail({ itemCode }: { itemCode: string }) {
  const { products, session } = useStore();
  const product = useMemo(() => products.find((item) => item.itemCode === itemCode) ?? products[0], [itemCode, products]);
  const [activeImage, setActiveImage] = useState(product?.imageUrl);

  if (!product) return <p className="p-10 text-center font-bold text-slate-500">Product not found.</p>;

  const productUrl = typeof window === 'undefined' ? `/products/${product.itemCode}` : `${window.location.origin}/products/${product.itemCode}`;
  const gallery = [product.imageUrl, product.imageUrl, product.imageUrl];

  return (
    <main className="mx-auto grid max-w-7xl gap-8 px-4 py-8 lg:grid-cols-[minmax(0,1fr)_420px]">
      <section className="grid gap-5 md:grid-cols-[90px_1fr]">
        <div className="flex gap-3 overflow-x-auto md:flex-col">
          {gallery.map((image, index) => <button key={index} onClick={() => setActiveImage(image)} className="h-20 w-20 shrink-0 rounded-2xl border border-black/[0.06] bg-white/80 p-2"><img src={image} alt="" className="h-full w-full object-contain" /></button>)}
        </div>
        <div className="group grid min-h-[420px] place-items-center overflow-hidden rounded-[2rem] border border-black/[0.06] bg-white/80 p-10 shadow-glass backdrop-blur-xl">
          <img src={activeImage ?? product.imageUrl} alt={product.name} className="max-h-[520px] w-full object-contain transition duration-500 group-hover:scale-110 transform-gpu" />
        </div>
      </section>
      <aside className="rounded-[2rem] border border-white/40 bg-white/85 p-6 shadow-glass backdrop-blur-xl">
        <p className="text-xs font-black uppercase tracking-[0.3em] text-emerald-700">{product.category}</p>
        <h1 className="mt-3 text-3xl font-black leading-tight">{product.name}</h1>
        <p className="mt-2 text-sm font-bold text-slate-500">SKU: {product.itemCode}</p>
        <div className="mt-5 rounded-2xl bg-emerald-50 p-4 text-emerald-900"><strong>Price hidden by policy</strong><p className="mt-1 text-sm">Request the best wholesale quote on WhatsApp with product link and customer details auto-filled.</p></div>
        <button onClick={() => openWhatsAppInquiry({ product, productUrl, session, address: session?.defaultAddress ?? null })} className="mt-5 w-full rounded-2xl bg-emerald-600 py-4 font-black text-white shadow-lg shadow-emerald-600/20 transition hover:scale-[1.02] transform-gpu">Get Price on WhatsApp</button>
        <div className="mt-6 overflow-hidden rounded-2xl border border-black/[0.06] text-sm"><div className="grid grid-cols-2 border-b border-black/[0.06] bg-slate-50 p-3"><span>Pieces / box</span><strong>{product.pcsPerPacket}</strong></div><div className="grid grid-cols-2 border-b border-black/[0.06] p-3"><span>Master cartons</span><strong>{product.cartonsPerBox}</strong></div><div className="grid grid-cols-2 p-3"><span>Availability</span><strong className="text-emerald-700">In Stock</strong></div></div>
        <section className="mt-6"><h2 className="font-black">Customer reviews</h2><div className="mt-3 space-y-2 text-sm text-slate-600"><p>★★★★★ 4.8 average rating</p><p>Verified B2B buyers highlight fast dispatch, stable packing and reliable bulk quality.</p></div></section>
      </aside>
    </main>
  );
}
