import { useState, useMemo, useEffect } from "react";
import { products, categories } from "@/data/products";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/context/cart-context";
import { ShoppingCart, Package, Search, CheckCircle2, X, Zap, Factory } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Products() {
  const searchParams = new URLSearchParams(window.location.search);
  const initialCategory = searchParams.get("category") || "All";
  const initialSearch = searchParams.get("search") || "";

  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const { addItem, isInCart, count } = useCart();
  const { toast } = useToast();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const cat = params.get("category");
    const q = params.get("search");
    if (cat) setActiveCategory(cat);
    if (q) setSearchQuery(q);
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchCat = activeCategory === "All" || p.category === activeCategory;
      const q = searchQuery.trim().toLowerCase();
      const matchQ = !q || p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
      return matchCat && matchQ;
    });
  }, [activeCategory, searchQuery]);

  function handleAddToCart(product: typeof products[0]) {
    addItem(product);
    toast({
      title: "Added to Enquiry Cart",
      description: `${product.name} added. ${count + 1} product(s) queued.`,
    });
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#f7f8fa] pb-20">

      {/* Page header */}
      <div className="bg-gray-900 text-white py-8 md:py-10 border-b border-gray-800">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Factory className="h-4 w-4 text-amber-400" />
                <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">Direct Factory Prices</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight leading-tight" data-testid="text-products-title">
                Wholesale Product Catalog
              </h1>
              <p className="text-white/60 text-sm mt-1">
                {products.length}+ premium disposable products — tiered bulk pricing on request
              </p>
            </div>
            <div className="hidden md:flex items-center gap-2 text-xs text-white/50 divide-x divide-white/20">
              <span className="pr-3 flex items-center gap-1.5"><Zap className="h-3.5 w-3.5 text-emerald-400" />In-stock &amp; ready to ship</span>
              <span className="pl-3">MOQ: 1 carton</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-5">
        {/* Filters row */}
        <div className="flex flex-col md:flex-row gap-3 mb-5">
          <div className="relative flex-none w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-8 h-10 bg-white border-gray-200 shadow-sm text-sm"
              data-testid="input-products-search"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700">
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <div className="flex gap-1.5 overflow-x-auto no-scrollbar flex-1" data-testid="tabs-category">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`whitespace-nowrap text-xs font-semibold px-4 py-2 rounded-full border transition-all shrink-0 ${
                  activeCategory === cat
                    ? "bg-gray-900 text-white border-gray-900 shadow"
                    : "bg-white text-gray-600 border-gray-200 hover:border-gray-400 hover:text-gray-900"
                }`}
                data-testid={`tab-${cat.replace(/\s+/g, "-").toLowerCase()}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Results bar */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-500 font-medium">
            <span className="text-gray-900 font-bold">{filteredProducts.length}</span> product{filteredProducts.length !== 1 ? "s" : ""}
            {searchQuery && <span> matching "<em className="not-italic text-amber-700 font-semibold">{searchQuery}</em>"</span>}
          </p>
          {(searchQuery || activeCategory !== "All") && (
            <button
              onClick={() => { setSearchQuery(""); setActiveCategory("All"); }}
              className="text-xs text-gray-500 hover:text-gray-900 font-medium flex items-center gap-1"
            >
              <X className="h-3 w-3" /> Clear filters
            </button>
          )}
        </div>

        {/* ── Product Grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredProducts.map((product) => {
            const added = isInCart(product.id);
            return (
              <div
                key={product.id}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden flex flex-col group hover:shadow-xl hover:border-amber-300 transition-all duration-200 shadow-sm"
                data-testid={`card-product-${product.id}`}
              >
                {/* Image zone */}
                <div className="aspect-square bg-gray-50 relative overflow-hidden flex items-center justify-center p-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="object-contain max-h-full w-full transition-transform duration-300 group-hover:scale-110"
                  />

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

                  {/* In Stock */}
                  <div className="absolute top-2.5 left-2.5">
                    <span className="inline-flex items-center gap-1 bg-emerald-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                      <span className="h-1.5 w-1.5 rounded-full bg-white/80 inline-block" />
                      In Stock
                    </span>
                  </div>

                  {/* Category chip */}
                  <div className="absolute top-2.5 right-2.5">
                    <span className="text-[9px] font-semibold bg-white/90 text-gray-700 px-2 py-0.5 rounded-full border border-gray-200 shadow-sm backdrop-blur-sm">
                      {product.category.split(" ")[0]}
                    </span>
                  </div>
                </div>

                {/* Info zone */}
                <div className="p-3 flex flex-col flex-1 gap-2">
                  <div>
                    <h3 className="font-bold text-sm text-gray-900 leading-snug line-clamp-2 mb-0.5" title={product.name}>
                      {product.name}
                    </h3>
                    <p className="text-[11px] text-gray-400 flex items-center gap-1">
                      <Package className="h-3 w-3 shrink-0" />
                      {product.packSize}
                    </p>
                  </div>

                  {/* Pricing + MOQ block */}
                  <div className="rounded-lg border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 px-2.5 py-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wide">Wholesale Price</span>
                      <span className="text-[9px] text-amber-600 font-semibold bg-amber-100 px-1.5 py-0.5 rounded-full">MOQ: 1 ctn</span>
                    </div>
                    <p className="text-[11px] text-amber-900 font-semibold leading-tight">Contact for tiered rates</p>
                    <div className="flex gap-1.5 mt-1.5">
                      <span className="text-[9px] bg-white border border-amber-200 text-amber-700 font-semibold px-1.5 py-0.5 rounded">5 ctn+</span>
                      <span className="text-[9px] bg-white border border-amber-200 text-amber-700 font-semibold px-1.5 py-0.5 rounded">25 ctn+</span>
                      <span className="text-[9px] bg-white border border-amber-200 text-amber-700 font-semibold px-1.5 py-0.5 rounded">100 ctn+</span>
                    </div>
                  </div>

                  {/* CTA — amber accent */}
                  <button
                    onClick={() => !added && handleAddToCart(product)}
                    disabled={added}
                    className={`w-full flex items-center justify-center gap-2 h-9 rounded-lg text-sm font-bold transition-all duration-150 ${
                      added
                        ? "bg-emerald-50 border border-emerald-300 text-emerald-700 cursor-default"
                        : "bg-amber-500 hover:bg-amber-600 active:scale-95 text-white shadow-sm shadow-amber-200"
                    }`}
                    data-testid={`button-add-${product.id}`}
                  >
                    {added ? (
                      <><CheckCircle2 className="h-4 w-4" /> Added ✓</>
                    ) : (
                      <><ShoppingCart className="h-4 w-4" /> Add to Enquiry</>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty state */}
        {filteredProducts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Search className="h-12 w-12 text-gray-200 mb-4" />
            <h3 className="text-lg font-bold text-gray-900 mb-1">No products found</h3>
            <p className="text-sm text-gray-500 mb-5">
              {searchQuery ? `No results for "${searchQuery}"` : "Try a different category."}
            </p>
            <Button variant="outline" onClick={() => { setSearchQuery(""); setActiveCategory("All"); }}>
              View all products
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
