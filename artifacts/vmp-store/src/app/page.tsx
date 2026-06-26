import { ProductShowcase } from './components/ui/ProductShowcase';

const categories = ['Cornstarch Meal Trays', 'Cornstarch Containers', 'Cornstarch Plates & Cutlery', 'Biodegradable Glasses', 'Meal Trays (PP)', 'Hinged Boxes', 'Bakery Boxes', 'PP Containers'];

export default function HomePage() {
  return (
    <main>
      <section className="mx-auto max-w-7xl px-4 py-16 text-center md:py-24">
        <p className="mx-auto inline-flex rounded-full border border-emerald-500/20 bg-white/65 px-4 py-2 text-xs font-black uppercase tracking-[0.32em] text-emerald-700 shadow-sm backdrop-blur">Veer Mahadev Plastic Worldwide</p>
        <h1 className="mx-auto mt-8 max-w-5xl text-5xl font-black leading-[0.95] tracking-tight md:text-8xl">Eco packaging engineered for <span className="text-emerald-600">bulk velocity</span>.</h1>
        <p className="mx-auto mt-6 max-w-3xl text-lg text-slate-600 md:text-2xl">Premium biodegradable manufacturing standards, dynamic wholesale tiers and live master carton conversions for modern B2B buyers.</p>
      </section>
      <nav className="sticky top-[73px] z-20 mx-auto max-w-7xl overflow-x-auto px-4 pb-3 [-webkit-overflow-scrolling:touch] md:top-[77px]">
        <div className="flex gap-3 rounded-[1.75rem] border border-white/40 bg-white/75 p-3 shadow-glass backdrop-blur-xl backdrop-saturate-150 transform-gpu will-change-transform">
          {categories.map((category) => <a key={category} href="/categories" className="whitespace-nowrap rounded-2xl px-4 py-3 text-sm font-bold text-slate-700 transition duration-250 ease-premium hover:scale-[1.02] hover:bg-emerald-50 hover:text-emerald-700 transform-gpu">{category}</a>)}
        </div>
      </nav>
      <ProductShowcase />
    </main>
  );
}
