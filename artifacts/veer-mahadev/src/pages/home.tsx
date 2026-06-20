import { useState, useRef } from "react";
import { categories, products } from "@/data/products";
import { Link, useLocation } from "wouter";
import {
  ArrowRight, Search, Truck, ShieldCheck, Package,
  Star, Users, Award, Factory, Zap, MessageCircle, Smartphone
} from "lucide-react";

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
      setSuggestions(
        products.filter(p =>
          p.name.toLowerCase().includes(q.toLowerCase()) ||
          p.category.toLowerCase().includes(q.toLowerCase())
        ).slice(0, 6)
      );
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
    <div className="flex flex-col min-h-screen bg-[#f7f8fa]">

      {/* ═══ HERO ═══════════════════════════════════════════ */}
      <section className="relative bg-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-emerald-950" />
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "28px 28px" }} />

        <div className="relative container mx-auto px-4 md:px-6 py-16 md:py-24 flex flex-col items-center text-center">

          {/* Eyebrow pill */}
          <div className="inline-flex items-center gap-2 bg-amber-500/15 border border-amber-500/30 text-amber-300 rounded-full px-4 py-1.5 text-xs font-bold tracking-wide uppercase mb-6" data-testid="badge-hero">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
            India's Trusted Wholesale Supplier · Est. 2005
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.06] mb-5 max-w-5xl" data-testid="text-hero-title">
            Leading Manufacturer &amp;{" "}
            <span className="text-amber-400">Wholesaler</span>{" "}
            of Disposable Products
          </h1>
          <p className="text-gray-300 text-base md:text-lg max-w-2xl mb-10 leading-relaxed font-medium" data-testid="text-hero-subtitle">
            Premium food-grade plates, cups, cutlery &amp; packaging — supplied in bulk to restaurants, caterers, hotels &amp; bakeries across India. Direct from our factory in Ahmedabad.
          </p>

          {/* ── HERO SEARCH ── */}
          <div className="w-full max-w-2xl" ref={searchRef}>
            <form onSubmit={handleSearch} className="relative flex shadow-2xl rounded-xl overflow-hidden">
              <input
                type="search"
                value={query}
                onChange={handleInput}
                onFocus={() => suggestions.length > 0 && setShowSug(true)}
                onBlur={() => setTimeout(() => setShowSug(false), 150)}
                placeholder="Search plates, cups, foil containers, spoons..."
                className="flex-1 h-14 pl-5 pr-4 text-gray-900 text-[15px] bg-white outline-none placeholder:text-gray-400 font-medium"
                data-testid="input-hero-search"
              />
              <button
                type="submit"
                className="h-14 px-6 bg-amber-500 hover:bg-amber-600 active:bg-amber-700 transition-colors flex items-center justify-center gap-2 font-bold text-white shrink-0 text-sm"
                data-testid="button-hero-search"
              >
                <Search className="h-5 w-5" />
                <span className="hidden sm:inline">Search</span>
              </button>

              {/* Suggestions dropdown */}
              {showSug && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-white rounded-b-xl shadow-2xl border border-gray-100 mt-0 overflow-hidden z-50" data-testid="hero-suggestions">
                  {suggestions.map(p => (
                    <button key={p.id} onMouseDown={() => handleSuggestion(p.name)}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-amber-50 text-left transition-colors border-b border-gray-50 last:border-0"
                      data-testid={`hero-suggestion-${p.id}`}>
                      <img src={p.image} alt={p.name} className="h-9 w-9 object-contain rounded-lg bg-gray-50 border border-gray-100 shrink-0" />
                      <div className="flex-1 text-left min-w-0">
                        <p className="text-sm font-bold text-gray-900 truncate">{p.name}</p>
                        <p className="text-xs text-gray-400">{p.category} · {p.packSize}</p>
                      </div>
                      <span className="text-[10px] font-semibold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full shrink-0">Bulk</span>
                    </button>
                  ))}
                  <button onMouseDown={() => handleSearch()}
                    className="w-full px-4 py-2.5 text-sm text-amber-700 font-semibold hover:bg-amber-50 text-center border-t border-gray-100">
                    See all results for "{query}" →
                  </button>
                </div>
              )}
            </form>

            {/* Quick category pills */}
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {categories.filter(c => c !== "All").map(cat => (
                <Link key={cat} href={`/products?category=${encodeURIComponent(cat)}`}
                  className="text-xs text-gray-300 hover:text-white bg-white/8 hover:bg-white/15 border border-white/15 rounded-full px-3 py-1 transition-all"
                  data-testid={`pill-${cat.replace(/\s+/g, '-').toLowerCase()}`}>
                  {cat}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Stats strip */}
        <div className="relative border-t border-white/10 bg-white/5">
          <div className="container mx-auto px-4 md:px-6 py-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              {[
                { icon: Package, value: "500+", label: "SKUs In Stock" },
                { icon: Truck, value: "Pan-India", label: "Delivery" },
                { icon: Award, value: "20+ Years", label: "Experience" },
                { icon: Users, value: "1,000+", label: "B2B Clients" },
              ].map(({ icon: Icon, value, label }) => (
                <div key={label} className="flex flex-col items-center gap-0.5">
                  <Icon className="h-4 w-4 text-amber-400 mb-0.5" />
                  <span className="text-base font-extrabold text-white">{value}</span>
                  <span className="text-[11px] text-gray-400">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 4 TRUST BADGES ═════════════════════════════════ */}
      <section className="bg-white border-b border-gray-100 py-8">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0 divide-y sm:divide-y-0 sm:divide-x divide-gray-100">
            {[
              {
                icon: ShieldCheck,
                iconBg: "bg-emerald-50 border-emerald-100",
                iconColor: "text-emerald-700",
                title: "Premium Quality Guaranteed",
                desc: "All products meet BIS & FSSAI food-safety standards. Manufactured under ISO-certified quality controls.",
              },
              {
                icon: Zap,
                iconBg: "bg-amber-50 border-amber-100",
                iconColor: "text-amber-700",
                title: "Wholesale & Bulk Pricing",
                desc: "Direct-manufacturer tiered rates — no middlemen. Higher volume = deeper discounts for your business.",
              },
              {
                icon: Factory,
                iconBg: "bg-blue-50 border-blue-100",
                iconColor: "text-blue-700",
                title: "Direct Factory Dispatch",
                desc: "Orders dispatched directly from our Ahmedabad facility. Same-week shipping for in-stock items.",
              },
              {
                icon: Smartphone,
                iconBg: "bg-indigo-50 border-indigo-100",
                iconColor: "text-indigo-700",
                title: "Secure UPI & WhatsApp Billing",
                desc: "Place orders and pay via UPI in seconds. Invoices sent directly to your WhatsApp & email.",
              },
            ].map(({ icon: Icon, iconBg, iconColor, title, desc }) => (
              <div key={title} className="flex gap-4 items-start p-5 md:p-6">
                <div className={`h-11 w-11 rounded-xl border flex items-center justify-center shrink-0 ${iconBg}`}>
                  <Icon className={`h-5 w-5 ${iconColor}`} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm mb-1">{title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CATEGORY GRID ══════════════════════════════════ */}
      <section className="py-14 bg-[#f7f8fa]">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-xs font-bold text-amber-600 uppercase tracking-widest mb-1">Browse by Category</p>
              <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">Our Product Range</h2>
              <p className="text-sm text-gray-500 mt-1">Food-grade disposables for every scale of operation</p>
            </div>
            <Link href="/products"
              className="hidden sm:inline-flex items-center text-sm font-semibold text-gray-700 hover:text-gray-900 gap-1 border border-gray-200 rounded-lg px-4 py-2 bg-white hover:border-gray-300 transition-all"
              data-testid="link-view-all">
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
            {categories.filter(c => c !== "All").map((category, index) => {
              const categoryProduct = products.find(p => p.category === category);
              const count = products.filter(p => p.category === category).length;
              return (
                <Link key={category} href={`/products?category=${encodeURIComponent(category)}`}
                  className="group flex flex-col overflow-hidden rounded-xl bg-white border border-gray-200 hover:border-amber-400 hover:shadow-lg transition-all duration-200 shadow-sm"
                  data-testid={`link-category-${index}`}>
                  <div className="aspect-square bg-gray-50 relative overflow-hidden">
                    {categoryProduct && (
                      <img src={categoryProduct.image} alt={category}
                        className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-[9px] bg-amber-500 text-white font-bold px-2 py-0.5 rounded-full">{count} items</span>
                    </div>
                  </div>
                  <div className="p-3 flex items-center justify-between">
                    <h3 className="font-bold text-gray-900 text-xs leading-tight">{category}</h3>
                    <ArrowRight className="h-3.5 w-3.5 text-gray-300 group-hover:text-amber-500 group-hover:translate-x-0.5 transition-all shrink-0" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══ FEATURED PRODUCTS ══════════════════════════════ */}
      <section className="py-12 bg-white border-t border-gray-100">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-xs font-bold text-amber-600 uppercase tracking-widest mb-1">Top Sellers</p>
              <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">Featured Products</h2>
            </div>
            <Link href="/products"
              className="hidden sm:inline-flex items-center text-sm font-semibold text-gray-700 hover:text-gray-900 gap-1 border border-gray-200 rounded-lg px-4 py-2 bg-white hover:border-gray-300 transition-all"
              data-testid="link-featured-all">
              See All <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {products.slice(0, 6).map(product => (
              <Link key={product.id} href="/products"
                className="group flex flex-col overflow-hidden rounded-xl bg-gray-50 border border-gray-200 hover:border-amber-300 hover:shadow-md transition-all duration-200"
                data-testid={`link-featured-${product.id}`}>
                <div className="aspect-square bg-white relative overflow-hidden flex items-center justify-center p-3">
                  <img src={product.image} alt={product.name}
                    className="object-contain max-h-full transition-transform duration-300 group-hover:scale-110" />
                </div>
                <div className="p-2.5">
                  <p className="text-xs font-bold text-gray-900 line-clamp-2 leading-snug mb-1">{product.name}</p>
                  <p className="text-[10px] text-gray-400 mb-1.5">{product.packSize}</p>
                  <div className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    In Stock
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link href="/products"
              className="inline-flex h-11 items-center justify-center rounded-lg bg-amber-500 hover:bg-amber-600 text-white px-8 text-sm font-bold gap-2 transition-colors shadow-sm shadow-amber-200"
              data-testid="link-view-all-mobile">
              Browse Full Catalog <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ SOCIAL PROOF STRIP ════════════════════════════ */}
      <section className="py-10 bg-gray-50 border-t border-gray-100">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-12">
            <div className="shrink-0 text-center">
              <div className="flex items-center justify-center gap-0.5 mb-1">
                {[1,2,3,4,5].map(i => <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />)}
              </div>
              <p className="text-2xl font-extrabold text-gray-900">4.9 / 5</p>
              <p className="text-xs text-gray-500 mt-0.5">from 200+ B2B partners</p>
            </div>
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { name: "Sharma Caterers, Delhi", text: "Best quality plates at factory prices. Our go-to supplier for 5 years." },
                { name: "Hotel Grand, Mumbai", text: "Fast dispatch, consistent quality, and great WhatsApp support every time." },
              ].map(({ name, text }) => (
                <div key={name} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                  <p className="text-xs text-gray-700 italic leading-relaxed mb-2">"{text}"</p>
                  <p className="text-[10px] font-bold text-gray-900">{name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ CTA BANNER ═════════════════════════════════════ */}
      <section className="py-14 bg-gray-900 text-white">
        <div className="container mx-auto px-4 md:px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-xs font-bold text-amber-400 uppercase tracking-widest mb-2">Get in Touch</p>
            <h2 className="text-2xl md:text-3xl font-extrabold mb-2 tracking-tight">Ready to place a bulk order?</h2>
            <p className="text-gray-400 text-sm md:text-base max-w-lg leading-relaxed">
              Wholesale pricing, same-week dispatch, and dedicated account support. Our sales team responds within 2 hours.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <a href="https://wa.me/919876543210?text=Hello%2C+I+want+to+place+a+bulk+order"
              target="_blank" rel="noopener noreferrer"
              className="inline-flex h-11 items-center justify-center rounded-lg bg-[#25D366] hover:bg-[#20bd5a] text-white px-6 text-sm font-bold gap-2 transition-colors"
              data-testid="button-cta-whatsapp">
              <MessageCircle className="h-4 w-4" />
              Chat on WhatsApp
            </a>
            <Link href="/contact"
              className="inline-flex h-11 items-center justify-center rounded-lg bg-amber-500 hover:bg-amber-600 text-white px-6 text-sm font-bold gap-2 transition-colors"
              data-testid="button-cta-enquiry">
              Send Enquiry <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
