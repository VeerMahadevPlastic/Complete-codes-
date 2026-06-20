import { useState, useRef } from "react";
import { categories, products } from "@/data/products";
import { Link, useLocation } from "wouter";
import { ArrowRight, Search, Truck, ShieldCheck, Package, Star, Users, Award } from "lucide-react";

export default function Home() {
  const [, setLocation] = useLocation();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<typeof products>([]);
  const [showSug, setShowSug] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    const q = e.target.value;
    setQuery(q);
    if (q.trim().length > 1) {
      setSuggestions(products.filter(p =>
        p.name.toLowerCase().includes(q.toLowerCase()) || p.category.toLowerCase().includes(q.toLowerCase())
      ).slice(0, 5));
      setShowSug(true);
    } else {
      setSuggestions([]);
      setShowSug(false);
    }
  }

  function handleSearch(e?: React.FormEvent) {
    if (e) e.preventDefault();
    if (query.trim()) {
      setShowSug(false);
      setLocation(`/products?search=${encodeURIComponent(query.trim())}`);
    }
  }

  function handleSuggestion(name: string) {
    setShowSug(false);
    setLocation(`/products?search=${encodeURIComponent(name)}`);
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">

      {/* ── HERO ──────────────────────────────────────── */}
      <section className="relative bg-gray-900 text-white overflow-hidden">
        {/* Background texture */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-900 to-emerald-950 opacity-90" />
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "32px 32px" }} />

        <div className="relative container mx-auto px-4 md:px-6 py-16 md:py-24 flex flex-col items-center text-center">

          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 rounded-full px-4 py-1.5 text-sm font-semibold mb-6" data-testid="badge-hero">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            India's Trusted Wholesale Supplier
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.08] mb-5 max-w-4xl" data-testid="text-hero-title">
            Leading Manufacturer &amp;{" "}
            <span className="text-emerald-400">Wholesaler</span>{" "}
            of Disposable Products
          </h1>
          <p className="text-gray-300 text-base md:text-lg max-w-2xl mb-10 leading-relaxed" data-testid="text-hero-subtitle">
            Premium-grade packaging, plates, cups &amp; cutlery — supplied in bulk to restaurants, caterers, hotels &amp; bakeries across India.
          </p>

          {/* ── Prominent Search ── */}
          <div className="w-full max-w-2xl" ref={searchRef}>
            <form onSubmit={handleSearch} className="flex relative">
              <input
                type="search"
                value={query}
                onChange={handleInput}
                onFocus={() => suggestions.length > 0 && setShowSug(true)}
                onBlur={() => setTimeout(() => setShowSug(false), 150)}
                placeholder="Search plates, cups, foil, spoons..."
                className="flex-1 h-14 pl-5 pr-4 text-gray-900 text-base bg-white rounded-l-xl border-0 outline-none placeholder:text-gray-400 shadow-2xl"
                data-testid="input-hero-search"
              />
              <button
                type="submit"
                className="h-14 px-6 bg-emerald-500 hover:bg-emerald-600 transition-colors rounded-r-xl flex items-center justify-center gap-2 font-semibold text-white shadow-2xl shrink-0"
                data-testid="button-hero-search"
              >
                <Search className="h-5 w-5" />
                <span className="hidden sm:inline">Search</span>
              </button>

              {/* Suggestions */}
              {showSug && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-white rounded-xl shadow-2xl border border-gray-100 mt-1 overflow-hidden z-50" data-testid="hero-suggestions">
                  {suggestions.map(p => (
                    <button key={p.id} onMouseDown={() => handleSuggestion(p.name)}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-emerald-50 text-left transition-colors border-b border-gray-50 last:border-0"
                      data-testid={`hero-suggestion-${p.id}`}>
                      <img src={p.image} alt={p.name} className="h-9 w-9 object-contain rounded bg-gray-50 border shrink-0" />
                      <div className="text-left">
                        <p className="text-sm font-semibold text-gray-900">{p.name}</p>
                        <p className="text-xs text-gray-500">{p.category} · {p.packSize}</p>
                      </div>
                      <Search className="ml-auto h-3.5 w-3.5 text-gray-300 shrink-0" />
                    </button>
                  ))}
                </div>
              )}
            </form>

            {/* Quick category pills */}
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {categories.filter(c => c !== "All").map(cat => (
                <Link key={cat} href={`/products?category=${encodeURIComponent(cat)}`}
                  className="text-xs text-gray-300 hover:text-white bg-white/10 hover:bg-white/20 border border-white/10 rounded-full px-3 py-1 transition-all"
                  data-testid={`pill-${cat.replace(/\s+/g,'-').toLowerCase()}`}>
                  {cat}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="relative border-t border-white/10 bg-white/5 backdrop-blur-sm">
          <div className="container mx-auto px-4 md:px-6 py-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              {[
                { icon: Package, value: "500+", label: "Products" },
                { icon: Truck, value: "Pan-India", label: "Delivery" },
                { icon: Award, value: "10+ Years", label: "Experience" },
                { icon: Users, value: "1000+", label: "Businesses" },
              ].map(({ icon: Icon, value, label }) => (
                <div key={label} className="flex flex-col items-center gap-0.5">
                  <Icon className="h-4 w-4 text-emerald-400 mb-0.5" />
                  <span className="text-base font-bold text-white">{value}</span>
                  <span className="text-xs text-gray-400">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── TRUST STRIP ───────────────────────────────── */}
      <section className="bg-white border-b border-gray-100 py-8">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 divide-y sm:divide-y-0 sm:divide-x divide-gray-100">
            {[
              { icon: ShieldCheck, title: "Food-Grade Certified", desc: "All products meet BIS / FSSAI food-safety standards for restaurants and bakeries." },
              { icon: Truck, title: "Bulk-Ready Dispatch", desc: "Orders of any scale dispatched same-week with tracking and dedicated support." },
              { icon: Star, title: "Wholesale Pricing", desc: "Direct-from-manufacturer rates — no middlemen, maximum margin for your business." },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex gap-4 items-start p-4">
                <div className="h-10 w-10 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
                  <Icon className="h-5 w-5 text-emerald-700" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm mb-0.5">{title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CATEGORY GRID ─────────────────────────────── */}
      <section className="py-14 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-xs font-bold text-emerald-700 uppercase tracking-widest mb-1">Browse by Category</p>
              <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">Our Product Range</h2>
            </div>
            <Link href="/products"
              className="hidden sm:inline-flex items-center text-sm font-semibold text-emerald-700 hover:text-emerald-600 gap-1"
              data-testid="link-view-all">
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
            {categories.filter(c => c !== "All").map((category, index) => {
              const categoryProduct = products.find(p => p.category === category);
              return (
                <Link key={category} href={`/products?category=${encodeURIComponent(category)}`}
                  className="group flex flex-col overflow-hidden rounded-xl bg-white border border-gray-200 hover:border-emerald-400 hover:shadow-lg transition-all duration-200"
                  data-testid={`link-category-${index}`}>
                  <div className="aspect-square bg-gray-50 relative overflow-hidden">
                    {categoryProduct && (
                      <img src={categoryProduct.image} alt={category}
                        className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="p-3 flex items-center justify-between">
                    <h3 className="font-bold text-gray-900 text-xs leading-tight">{category}</h3>
                    <ArrowRight className="h-3.5 w-3.5 text-gray-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all shrink-0" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ─────────────────────────── */}
      <section className="py-12 bg-white border-t border-gray-100">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-xs font-bold text-emerald-700 uppercase tracking-widest mb-1">Top Sellers</p>
              <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">Featured Products</h2>
            </div>
            <Link href="/products"
              className="hidden sm:inline-flex items-center text-sm font-semibold text-emerald-700 hover:text-emerald-600 gap-1"
              data-testid="link-featured-all">
              See All <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {products.slice(0, 6).map(product => (
              <Link key={product.id} href={`/products?search=${encodeURIComponent(product.name)}`}
                className="group flex flex-col overflow-hidden rounded-xl bg-gray-50 border border-gray-200 hover:border-emerald-300 hover:shadow-md transition-all duration-200"
                data-testid={`link-featured-${product.id}`}>
                <div className="aspect-square bg-white relative overflow-hidden flex items-center justify-center p-3">
                  <img src={product.image} alt={product.name}
                    className="object-contain max-h-full transition-transform duration-300 group-hover:scale-110" />
                </div>
                <div className="p-2.5">
                  <p className="text-xs font-bold text-gray-900 line-clamp-2 leading-snug mb-1">{product.name}</p>
                  <p className="text-[10px] text-gray-400">{product.packSize}</p>
                  <div className="mt-1.5 inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    In Stock
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link href="/products"
              className="inline-flex h-11 items-center justify-center rounded-lg bg-gray-900 hover:bg-gray-700 text-white px-8 text-sm font-semibold gap-2 transition-colors"
              data-testid="link-view-all-mobile">
              Browse Full Catalog <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ────────────────────────────────── */}
      <section className="py-14 bg-emerald-900 text-white">
        <div className="container mx-auto px-4 md:px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold mb-2 tracking-tight">Ready to place a bulk order?</h2>
            <p className="text-emerald-200 text-sm md:text-base max-w-lg leading-relaxed">
              Get wholesale pricing, fast dispatch, and dedicated account support. Our sales team responds within 2 hours.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <a href="https://wa.me/919876543210?text=Hello%2C+I+want+to+place+a+bulk+order"
              target="_blank" rel="noopener noreferrer"
              className="inline-flex h-11 items-center justify-center rounded-lg bg-[#25D366] hover:bg-[#20bd5a] text-white px-6 text-sm font-bold gap-2 transition-colors"
              data-testid="button-cta-whatsapp">
              Chat on WhatsApp
            </a>
            <Link href="/contact"
              className="inline-flex h-11 items-center justify-center rounded-lg border border-white/30 hover:bg-white/10 text-white px-6 text-sm font-semibold gap-2 transition-colors"
              data-testid="button-cta-enquiry">
              Send Enquiry <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
