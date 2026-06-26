'use client';

import { useMemo, useState } from 'react';
import { useStore, type CurrencyCode } from '../context/GlobalStateContext';
import { AuthModal } from '../ui/AuthModal';
import { CartDrawer } from '../ui/CartDrawer';

export function Header() {
  const { products, currency, setCurrency, cart, session, setSession } = useStore();
  const [query, setQuery] = useState('');
  const [authOpen, setAuthOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const suggestions = useMemo(() => products.filter((product) => `${product.name} ${product.itemCode} ${product.category}`.toLowerCase().includes(query.toLowerCase())).slice(0, 6), [products, query]);

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/90 text-white shadow-2xl shadow-slate-950/10 backdrop-blur-xl backdrop-saturate-150">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 md:gap-5">
          <a href="/" className="hidden text-lg font-black tracking-tight sm:block">Veer Mahadev</a>
          <div className="relative flex-1">
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search products, categories, item codes..." className="h-12 w-full rounded-2xl border border-white/10 bg-white px-4 text-slate-950 outline-none ring-emerald-400/40 transition focus:ring-4" />
            {query && (
              <div className="absolute left-0 right-0 top-14 overflow-hidden rounded-3xl border border-white/40 bg-white/80 text-slate-950 shadow-glass backdrop-blur-xl backdrop-saturate-150">
                {suggestions.map((product) => <button key={product.itemCode} className="flex w-full items-center gap-3 border-b border-black/[0.06] px-4 py-3 text-left transition hover:bg-emerald-50"><img src={product.imageUrl} alt="" className="h-10 w-10 rounded-xl object-contain bg-slate-50" /><span><strong className="block">{product.name}</strong><small className="text-slate-500">{product.itemCode} · {product.category}</small></span></button>)}
              </div>
            )}
          </div>
          <select aria-label="Currency" value={currency} onChange={(event) => setCurrency(event.target.value as CurrencyCode)} className="h-12 rounded-2xl border border-white/10 bg-white/10 px-3 font-bold outline-none backdrop-blur transition hover:bg-white/15">
            {(['INR', 'USD', 'GBP', 'TRY', 'RUB'] as CurrencyCode[]).map((code) => <option key={code} value={code}>{code}</option>)}
          </select>
          <button onClick={() => setCartOpen(true)} className="relative h-12 rounded-2xl bg-emerald-500 px-4 font-black text-white transition duration-250 ease-premium hover:scale-[1.03] transform-gpu">Cart<span className="ml-2 rounded-full bg-white px-2 py-0.5 text-xs text-emerald-700">{cart.length}</span></button>
          {!session ? (
            <button onClick={() => setAuthOpen(true)} className="hidden rounded-2xl border border-white/15 px-4 py-3 text-sm font-bold transition hover:bg-white/10 md:block">Sign In / Register</button>
          ) : (
            <div className="relative">
              <button onClick={() => setAccountOpen((value) => !value)} className="grid h-12 w-12 place-items-center rounded-2xl bg-white text-sm font-black text-emerald-700">{session.businessName.slice(0, 2).toUpperCase()}</button>
              {accountOpen && <div className="absolute right-0 mt-3 w-56 rounded-3xl border border-white/30 bg-white/85 p-2 text-slate-950 shadow-glass backdrop-blur-xl"><a className="block rounded-2xl px-4 py-3 hover:bg-emerald-50">My Profile</a><a className="block rounded-2xl px-4 py-3 hover:bg-emerald-50">Business Profile</a><button onClick={() => setSession(null)} className="block w-full rounded-2xl px-4 py-3 text-left text-red-600 hover:bg-red-50">Logout</button></div>}
            </div>
          )}
        </div>
      </header>
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
