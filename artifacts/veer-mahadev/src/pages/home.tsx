import { categories, products } from "@/data/products";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Truck, ShieldCheck, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-primary text-primary-foreground py-24 md:py-32">
        <div className="container mx-auto px-4 md:px-6 relative z-10 flex flex-col items-center text-center">
          <Badge className="bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20 border-primary-foreground/20 mb-6 text-sm py-1.5 px-4" data-testid="badge-hero">
            Trusted Wholesale Supplier
          </Badge>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 max-w-4xl" data-testid="text-hero-title">
            Premium Disposable Products for Bulk Buyers
          </h1>
          <p className="text-lg md:text-xl opacity-90 max-w-2xl mb-10" data-testid="text-hero-subtitle">
            Reliable supply, wholesale pricing, and top-tier quality for restaurants, caterers, and event planners across India.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link href="/products" className="inline-flex h-12 items-center justify-center rounded-md bg-white px-8 text-sm font-medium text-primary shadow transition-colors hover:bg-gray-100" data-testid="link-browse-catalog">
              Browse Catalog
            </Link>
            <Link href="/contact" className="inline-flex h-12 items-center justify-center rounded-md border border-primary-foreground/20 bg-transparent px-8 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary-foreground/10" data-testid="link-enquire-now">
              Enquire Now <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-12 bg-white border-b">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-gray-100">
            <div className="flex flex-col items-center p-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <ShoppingCart className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Bulk Orders</h3>
              <p className="text-muted-foreground text-sm">Specialized in handling large-scale wholesale orders efficiently.</p>
            </div>
            <div className="flex flex-col items-center p-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Truck className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
              <p className="text-muted-foreground text-sm">Prompt and reliable dispatch to keep your business running.</p>
            </div>
            <div className="flex flex-col items-center p-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <ShieldCheck className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Wholesale Pricing</h3>
              <p className="text-muted-foreground text-sm">Competitive rates designed for B2B profitability and scale.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Showcase */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-bold tracking-tight mb-2">Our Product Range</h2>
              <p className="text-muted-foreground">High-quality disposables for every need.</p>
            </div>
            <Link href="/products" className="hidden sm:inline-flex text-sm font-medium text-primary hover:underline items-center" data-testid="link-view-all">
              View All Products <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.slice(0, 6).map((category, index) => {
              const categoryProduct = products.find(p => p.category === category);
              return (
                <Link key={category} href={`/products?category=${encodeURIComponent(category)}`} className="group block overflow-hidden rounded-lg bg-card border shadow-sm transition-all hover:shadow-md hover:border-primary/50" data-testid={`link-category-${index}`}>
                  <div className="aspect-[4/3] bg-muted relative overflow-hidden">
                    {categoryProduct && (
                      <img 
                        src={categoryProduct.image} 
                        alt={category}
                        className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                      />
                    )}
                  </div>
                  <div className="p-4 flex items-center justify-between">
                    <h3 className="font-semibold">{category}</h3>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                </Link>
              )
            })}
          </div>
          
          <div className="mt-8 text-center sm:hidden">
            <Link href="/products" className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90" data-testid="link-view-all-mobile">
              View All Products
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
