import { useState, useMemo } from "react";
import { Link, useLocation } from "wouter";
import { products, categories } from "@/data/products";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ShoppingBag, Package } from "lucide-react";

export default function Products() {
  const [location] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  const initialCategory = searchParams.get("category") || "All";
  
  const [activeCategory, setActiveCategory] = useState(initialCategory);

  const filteredProducts = useMemo(() => {
    if (activeCategory === "All") return products;
    return products.filter(p => p.category === activeCategory);
  }, [activeCategory]);

  return (
    <div className="flex flex-col min-h-screen bg-muted/20 pb-20">
      <div className="bg-primary text-primary-foreground py-16">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4" data-testid="text-products-title">Wholesale Product Catalog</h1>
          <p className="text-primary-foreground/80 max-w-2xl mx-auto text-lg">Browse our extensive range of premium disposable items and packaging solutions.</p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 -mt-8 relative z-10">
        <Card className="p-2 mb-10 shadow-md">
          <div className="flex flex-nowrap overflow-x-auto pb-2 sm:pb-0 gap-2 no-scrollbar" data-testid="tabs-category">
            {categories.map((category) => (
              <Button
                key={category}
                variant={activeCategory === category ? "default" : "ghost"}
                className={`whitespace-nowrap rounded-sm ${activeCategory === category ? "" : "text-muted-foreground hover:text-foreground"}`}
                onClick={() => setActiveCategory(category)}
                data-testid={`tab-${category.replace(/\s+/g, '-').toLowerCase()}`}
              >
                {category}
              </Button>
            ))}
          </div>
        </Card>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="overflow-hidden flex flex-col group transition-all hover:shadow-lg border-muted" data-testid={`card-product-${product.id}`}>
              <div className="aspect-[4/3] bg-white relative overflow-hidden border-b flex items-center justify-center p-4">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="object-contain max-h-full transition-transform duration-300 group-hover:scale-105" 
                />
                <Badge className="absolute top-3 left-3 bg-white/90 text-primary border-primary/20 hover:bg-white pointer-events-none" variant="outline">
                  {product.category}
                </Badge>
              </div>
              <CardContent className="p-5 flex-grow">
                <h3 className="font-semibold text-lg leading-tight mb-2 line-clamp-2" title={product.name}>{product.name}</h3>
                <div className="flex items-center text-muted-foreground text-sm">
                  <Package className="h-4 w-4 mr-2" />
                  <span>{product.packSize}</span>
                </div>
              </CardContent>
              <CardFooter className="p-5 pt-0">
                <Link href={`/contact?product=${encodeURIComponent(product.name)}`} className="w-full">
                  <Button className="w-full" variant="outline" data-testid={`button-enquire-${product.id}`}>
                    <ShoppingBag className="mr-2 h-4 w-4" /> Enquire Now
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-20">
            <h3 className="text-xl font-semibold mb-2">No products found</h3>
            <p className="text-muted-foreground">Try selecting a different category.</p>
          </div>
        )}
      </div>
    </div>
  );
}
