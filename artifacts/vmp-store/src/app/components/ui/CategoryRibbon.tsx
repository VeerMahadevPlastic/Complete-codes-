'use client';

import { useStore } from '../context/GlobalStateContext';

export function CategoryRibbon() {
  const { categories } = useStore();
  return (
    <nav className="sticky top-[73px] z-20 mx-auto max-w-7xl overflow-x-auto px-4 pb-3 [-webkit-overflow-scrolling:touch] md:top-[77px]">
      <div className="flex gap-3 rounded-[1.75rem] border border-white/40 bg-white/75 p-3 shadow-glass backdrop-blur-xl backdrop-saturate-150 transform-gpu will-change-transform">
        {categories.map((category) => (
          <a key={category} href={`/categories?category=${encodeURIComponent(category)}`} className="whitespace-nowrap rounded-2xl px-4 py-3 text-sm font-bold text-slate-700 transition duration-250 ease-premium hover:scale-[1.02] hover:bg-emerald-50 hover:text-emerald-700 transform-gpu">
            {category}
          </a>
        ))}
      </div>
    </nav>
  );
}
