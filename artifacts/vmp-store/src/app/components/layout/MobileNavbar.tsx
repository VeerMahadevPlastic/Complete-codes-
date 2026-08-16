'use client';

import { useState } from 'react';
import { useStore } from '../context/GlobalStateContext';
import { AuthModal } from '../ui/AuthModal';

export function MobileNavbar() {
  const { cart, session } = useStore();
  const [authOpen, setAuthOpen] = useState(false);
  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-40 grid grid-cols-5 border-t border-black/[0.06] bg-white/90 px-2 py-2 text-[11px] font-bold text-slate-700 shadow-[0_-10px_30px_rgba(15,23,42,0.08)] backdrop-blur-xl md:hidden">
        <a href="/" className="grid place-items-center gap-1">⌂<span>Home</span></a>
        <a href="/#search" className="grid place-items-center gap-1">⌕<span>Search</span></a>
        <a href="/my-orders.html" className="grid place-items-center gap-1">▣<span>Orders</span></a>
        <button onClick={() => !session && setAuthOpen(true)} className="grid place-items-center gap-1">◉<span>{session ? 'Profile' : 'Login'}</span></button>
        <a href="/#menu" className="relative grid place-items-center gap-1">☰<span>Menu</span>{cart.length > 0 && <b className="absolute right-4 top-0 rounded-full bg-emerald-600 px-1.5 text-white">{cart.length}</b>}</a>
      </nav>
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
}
