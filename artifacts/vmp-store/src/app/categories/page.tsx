import { ProductShowcase } from '../components/ui/ProductShowcase';

export default function CategoriesPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <section className="rounded-[2rem] border border-white/40 bg-white/75 p-8 shadow-glass backdrop-blur-xl">
        <p className="text-xs font-black uppercase tracking-[0.32em] text-emerald-700">8 core categories</p>
        <h1 className="mt-2 text-4xl font-black">Responsive category filtering interface</h1>
        <p className="mt-3 text-slate-600">Mobile users receive a touch-optimized ribbon; larger screens retain a premium catalog matrix.</p>
      </section>
      <ProductShowcase />
    </main>
  );
}
