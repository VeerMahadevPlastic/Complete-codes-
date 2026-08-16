import { ProductShowcase } from './components/ui/ProductShowcase';
import { CategoryRibbon } from './components/ui/CategoryRibbon';

export default function HomePage() {
  return (
    <main>
      <section className="mx-auto max-w-7xl px-4 py-16 text-center md:py-24">
        <p className="mx-auto inline-flex rounded-full border border-emerald-500/20 bg-white/65 px-4 py-2 text-xs font-black uppercase tracking-[0.32em] text-emerald-700 shadow-sm backdrop-blur">Veer Mahadev Plastic Worldwide</p>
        <h1 className="mx-auto mt-8 max-w-5xl text-5xl font-black leading-[0.95] tracking-tight md:text-8xl">Eco packaging engineered for <span className="text-emerald-600">bulk velocity</span>.</h1>
        <p className="mx-auto mt-6 max-w-3xl text-lg text-slate-600 md:text-2xl">Premium biodegradable manufacturing standards, dynamic wholesale tiers and live master carton conversions for modern B2B buyers.</p>
      </section>
      <CategoryRibbon />
      <section className="mx-auto grid max-w-7xl gap-4 px-4 py-8 md:grid-cols-3">
        {['Trending Categories', 'Recommended for You', 'Deals of the Day'].map((title) => (
          <article key={title} className="rounded-[2rem] border border-white/40 bg-white/80 p-6 shadow-glass backdrop-blur-xl">
            <p className="text-xs font-black uppercase tracking-[0.28em] text-emerald-700">Wholesale picks</p>
            <h2 className="mt-2 text-2xl font-black">{title}</h2>
            <p className="mt-3 text-sm font-semibold text-slate-500">Browse SKU-first catalog modules and request live pricing directly from the admin desk.</p>
          </article>
        ))}
      </section>
      <ProductShowcase />
    </main>
  );
}
