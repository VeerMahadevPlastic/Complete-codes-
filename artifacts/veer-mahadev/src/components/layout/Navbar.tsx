import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import logoImg from "@assets/Gemini_Generated_Image_6ru27q6ru27q6ru2_1781943190526.png";
import { Search, ShoppingCart, Menu, X, ChevronDown, LogIn } from "lucide-react";
import { useCart } from "@/context/cart-context";
import { CartDrawer } from "@/components/ui/cart-drawer";
import { products, categories } from "@/data/products";

interface NavbarProps {
  onSearch?: (query: string) => void;
}

export function Navbar({ onSearch }: NavbarProps) {
  const [location, setLocation] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchCategory, setSearchCategory] = useState("All");
  const [suggestions, setSuggestions] = useState<typeof products>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const { count } = useCart();

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/products", label: "Products" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    }
    function handleScroll() {
      setScrolled(window.scrollY > 8);
    }
    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  function handleSearchInput(e: React.ChangeEvent<HTMLInputElement>) {
    const q = e.target.value;
    setSearchQuery(q);
    if (q.trim().length > 1) {
      const filtered = products.filter((p) => {
        const matchCat = searchCategory === "All" || p.category === searchCategory;
        const matchQ = p.name.toLowerCase().includes(q.toLowerCase()) || p.category.toLowerCase().includes(q.toLowerCase());
        return matchCat && matchQ;
      }).slice(0, 6);
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }

  function handleSearchSubmit(e?: React.FormEvent) {
    if (e) e.preventDefault();
    setShowSuggestions(false);
    if (searchQuery.trim()) {
      setLocation(`/products?search=${encodeURIComponent(searchQuery.trim())}&category=${encodeURIComponent(searchCategory)}`);
    }
  }

  function handleSuggestionClick(name: string) {
    setSearchQuery(name);
    setShowSuggestions(false);
    setLocation(`/products?search=${encodeURIComponent(name)}&category=${encodeURIComponent(searchCategory)}`);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") handleSearchSubmit();
    if (e.key === "Escape") setShowSuggestions(false);
  }

  return (
    <>
      <header className={`sticky top-0 z-50 w-full transition-shadow duration-200 ${scrolled ? "shadow-[0_4px_24px_rgba(0,0,0,0.45)]" : "shadow-lg"}`} data-testid="navbar">
        {/* Top bar — dark charcoal */}
        <div className="bg-gray-900 text-white">
          <div className="container mx-auto px-4 md:px-6 flex h-16 items-center gap-3 md:gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 shrink-0" data-testid="link-logo">
              <img src={logoImg} alt="Veer Mahadev Plastic" className="h-9 w-9 rounded-md bg-white p-0.5 object-contain" />
              <span className="hidden lg:block font-bold text-lg text-white leading-tight whitespace-nowrap">
                Veer Mahadev
              </span>
            </Link>

            {/* Search bar */}
            <div className="flex-1 relative" ref={searchRef}>
              <form onSubmit={handleSearchSubmit} className="flex h-10 w-full">
                {/* Category dropdown embedded in search */}
                <div className="hidden sm:flex shrink-0">
                  <Select value={searchCategory} onValueChange={setSearchCategory}>
                    <SelectTrigger
                      className="h-10 rounded-r-none rounded-l-md border-0 bg-gray-200 text-gray-800 text-xs font-medium w-[130px] focus:ring-0 focus:ring-offset-0"
                      data-testid="select-search-category"
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((c) => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Input
                  type="search"
                  placeholder="Search products, categories..."
                  value={searchQuery}
                  onChange={handleSearchInput}
                  onKeyDown={handleKeyDown}
                  onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                  className="h-10 flex-1 rounded-none border-0 bg-white text-gray-900 placeholder:text-gray-500 focus-visible:ring-0 focus-visible:ring-offset-0 text-sm"
                  data-testid="input-search"
                />
                <button
                  type="submit"
                  className="h-10 px-4 bg-emerald-500 hover:bg-emerald-600 rounded-r-md flex items-center justify-center transition-colors shrink-0"
                  data-testid="button-search"
                >
                  <Search className="h-5 w-5 text-white" />
                </button>
              </form>

              {/* Live suggestions dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-b-md shadow-2xl z-50 divide-y divide-gray-100" data-testid="search-suggestions">
                  {suggestions.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => handleSuggestionClick(p.name)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-emerald-50 text-left transition-colors"
                      data-testid={`suggestion-${p.id}`}
                    >
                      <img src={p.image} alt={p.name} className="h-8 w-8 object-contain shrink-0 rounded" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 line-clamp-1">{p.name}</p>
                        <p className="text-xs text-gray-500">{p.category} · {p.packSize.toLocaleString("en-IN")} pcs/box</p>
                      </div>
                      <Search className="ml-auto h-3.5 w-3.5 text-gray-400 shrink-0" />
                    </button>
                  ))}
                  <button
                    onClick={handleSearchSubmit}
                    className="w-full px-4 py-2 text-sm text-emerald-700 font-medium hover:bg-emerald-50 text-center"
                  >
                    See all results for "{searchQuery}"
                  </button>
                </div>
              )}
            </div>

            {/* Cart + Login */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setCartOpen(true)}
                className="relative flex flex-col items-center justify-center h-10 w-10 rounded-md hover:bg-white/10 transition-colors"
                data-testid="button-cart"
                aria-label={`Enquiry cart, ${count} items`}
              >
                <ShoppingCart className="h-5 w-5" />
                {count > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-emerald-500 text-white text-[10px] font-bold rounded-full border-2 border-gray-900" data-testid="badge-cart-count">
                    {count}
                  </Badge>
                )}
              </button>

              <Button
                variant="outline"
                size="sm"
                className="hidden sm:flex border-white/30 text-white hover:bg-white/10 hover:text-white bg-transparent text-xs font-semibold h-9 gap-1.5"
                onClick={() => setLoginOpen(true)}
                data-testid="button-b2b-login"
              >
                <LogIn className="h-3.5 w-3.5" />
                B2B Login
              </Button>

              {/* Mobile menu */}
              <div className="md:hidden">
                <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 hover:text-white">
                      <Menu className="h-5 w-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-72">
                    <div className="flex flex-col gap-5 pt-6">
                      {navLinks.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={() => setMobileOpen(false)}
                          className={`text-base font-semibold transition-colors ${location === link.href ? "text-emerald-700" : "text-gray-700 hover:text-emerald-700"}`}
                        >
                          {link.label}
                        </Link>
                      ))}
                      <div className="border-t pt-4 space-y-3">
                        <Button className="w-full" onClick={() => { setMobileOpen(false); setLoginOpen(true); }}>
                          <LogIn className="mr-2 h-4 w-4" /> B2B Login
                        </Button>
                        <Link href="/contact" onClick={() => setMobileOpen(false)}>
                          <Button variant="outline" className="w-full border-emerald-700 text-emerald-700">Get Quote</Button>
                        </Link>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>
        </div>

        {/* Secondary nav bar */}
        <div className="bg-gray-800 text-white hidden md:block">
          <div className="container mx-auto px-4 md:px-6 flex items-center h-10 gap-1">
            <Link href="/products" className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded hover:bg-white/10 transition-colors whitespace-nowrap">
              <Menu className="h-3.5 w-3.5" /> All Categories
            </Link>
            <div className="w-px h-4 bg-white/20 mx-1" />
            {categories.filter(c => c !== "All").map((cat) => (
              <Link
                key={cat}
                href={`/products?category=${encodeURIComponent(cat)}`}
                className="text-xs text-white/80 hover:text-white px-3 py-1.5 rounded hover:bg-white/10 transition-colors whitespace-nowrap"
                data-testid={`nav-category-${cat.replace(/\s+/g, '-').toLowerCase()}`}
              >
                {cat}
              </Link>
            ))}
            <div className="ml-auto">
              <Link href="/contact" className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold px-3 py-1.5 whitespace-nowrap">
                Get Quote →
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Cart Drawer */}
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />

      {/* B2B Login Modal */}
      <Dialog open={loginOpen} onOpenChange={setLoginOpen}>
        <DialogContent className="sm:max-w-[400px]" data-testid="dialog-login">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">B2B Portal Login</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700">Business Email</label>
              <Input placeholder="your@business.com" className="h-11" data-testid="input-login-email" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700">Password</label>
              <Input type="password" placeholder="••••••••" className="h-11" data-testid="input-login-password" />
            </div>
            <Button className="w-full h-11 bg-gray-900 hover:bg-gray-800 font-semibold" data-testid="button-login-submit">
              Sign In to B2B Portal
            </Button>
            <div className="text-center">
              <span className="text-sm text-muted-foreground">Don't have an account? </span>
              <Link href="/contact" onClick={() => setLoginOpen(false)} className="text-sm text-emerald-700 font-semibold hover:underline">
                Request Access
              </Link>
            </div>
            <div className="border-t pt-4">
              <p className="text-xs text-center text-muted-foreground">
                B2B accounts get exclusive wholesale pricing and bulk order tracking.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
