import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/context/cart-context";
import { AdminProvider } from "@/context/admin-context";
import { CatalogProvider } from "@/context/catalog-context";
import NotFound from "@/pages/not-found";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/ui/whatsapp-button";

import Home from "@/pages/home";
import Products from "@/pages/products";
import About from "@/pages/about";
import Contact from "@/pages/contact";
import Admin from "@/pages/admin";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/products" component={Products} />
      <Route path="/about" component={About} />
      <Route path="/contact" component={Contact} />
      <Route path="/admin" component={Admin} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AdminProvider>
        <CatalogProvider>
          <CartProvider>
            <TooltipProvider>
              <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
                <div className="relative min-h-screen flex flex-col font-sans">
                  <Navbar />
                  <main className="flex-1">
                    <Router />
                  </main>
                  <Footer />
                  <WhatsAppButton />
                </div>
              </WouterRouter>
              <Toaster />
            </TooltipProvider>
          </CartProvider>
        </CatalogProvider>
      </AdminProvider>
    </QueryClientProvider>
  );
}

export default App;
