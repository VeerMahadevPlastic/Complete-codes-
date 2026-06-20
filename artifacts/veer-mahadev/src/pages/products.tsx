import { useState, useMemo, useEffect } from "react";
import { products, categories } from "@/data/products";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useCart } from "@/context/cart-context";
import { ShoppingCart, Package, Search, CheckCircle2, X } from "lucide-react";
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
      description: `${product.name} added. You have ${count + 1} product(s) queued.`,
    });
  }

  function clearSearch() {
    setSearchQuery("");
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-20">
      {/* Page header */}
      <div className="bg-gray-900 text-white py-10">
        <div className="container mx-auto px-4 md:px-6">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2" data-testid="text-products-title">
            Wholesale Product Catalog
          </h1>
          <p className="text-white/70 text-sm md:text-base">
            Premium disposable items — bulk pricing available on request
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-6">
        {/* Filters row */}
        <div className="flex flex-col md:flex-row gap-3 mb-6">
          {/* Inline search */}
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-8 h-10 bg-white border-gray-300"
              data-testid="input-products-search"
            />
            {searchQuery && (
              <button onClick={clearSearch} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Category tabs — scrollable */}
          <div className="flex gap-1.5 overflow-x-auto no-scrollbar flex-1" data-testid="tabs-category">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`whitespace-nowrap text-sm font-medium px-4 py-2 rounded-full border transition-all shrink-0 ${
                  activeCategory === cat
                    ? "bg-gray-900 text-white border-gray-900"
                    : "bg-white text-gray-700 border-gray-200 hover:border-gray-400"
                }`}
                data-testid={`tab-${cat.replace(/\s+/g, "-").toLowerCase()}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-600">
            {filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""}
            {searchQuery && <span> for "<strong>{searchQuery}</strong>"</span>}
          </p>
          {(searchQuery || activeCategory !== "All") && (
            <button
              onClick={() => { setSearchQuery(""); setActiveCategory("All"); }}
              className="text-xs text-emerald-700 font-medium hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Product grid — Amazon style */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredProducts.map((product) => {
            const added = isInCart(product.id);
            return (
              <div
                key={product.id}
                className="bg-white rounded-lg border border-gray-200 overflow-hidden flex flex-col group hover:shadow-xl hover:border-emerald-300 transition-all duration-200"
                data-testid={`card-product-${product.id}`}
              >
                {/* Image */}
                <div className="aspect-square bg-gray-50 relative overflow-hidden flex items-center justify-center p-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="object-contain max-h-full w-full transition-transform duration-300 group-hover:scale-110"
                  />
                  {/* In Stock badge */}
                  <div className="absolute top-2 left-2">
                    <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-emerald-200">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 inline-block" />
                      In Stock
                    </span>
                  </div>
                  {/* Category badge */}
                  <div className="absolute top-2 right-2">
                    <span className="text-[9px] font-semibold bg-gray-900/70 text-white px-2 py-0.5 rounded-full backdrop-blur-sm">
                      {product.category.split(" ")[0]}
                    </span>
                  </div>
                </div>

                {/* Info */}
                <div className="p-3 flex flex-col flex-1">
                  <h3 className="font-semibold text-sm text-gray-900 leading-snug line-clamp-2 mb-1" title={product.name}>
                    {product.name}
                  </h3>
                  <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
                    <Package className="h-3 w-3" />
                    {product.packSize}
                  </p>

                  {/* Tier pricing hint */}
                  <div className="bg-amber-50 border border-amber-100 rounded px-2 py-1 mb-3">
                    <p className="text-[11px] text-amber-800 font-medium">Bulk pricing available</p>
                    <p className="text-[10px] text-amber-700">Contact for wholesale rates</p>
                  </div>

                  {/* Add to Cart / Added state */}
                  <button
                    onClick={() => !added && handleAddToCart(product)}
                    disabled={added}
                    className={`mt-auto w-full flex items-center justify-center gap-2 h-9 rounded-md text-sm font-semibold border transition-all duration-150 ${
                      added
                        ? "bg-emerald-50 border-emerald-300 text-emerald-700 cursor-default"
                        : "bg-gray-900 border-gray-900 text-white hover:bg-gray-700 active:scale-95"
                    }`}
                    data-testid={`button-add-${product.id}`}
                  >
                    {added ? (
                      <><CheckCircle2 className="h-4 w-4" /> Added to Cart</>
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
            <Search className="h-12 w-12 text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold mb-2">No products found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery ? `No results for "${searchQuery}"` : "Try selecting a different category."}
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
