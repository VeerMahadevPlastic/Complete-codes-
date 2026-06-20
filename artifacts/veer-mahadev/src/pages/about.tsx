import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Building2, Users, Award, MapPin } from "lucide-react";

export default function About() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="bg-primary text-primary-foreground py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4" data-testid="text-about-title">About Veer Mahadev Plastic</h1>
            <p className="text-xl opacity-90 leading-relaxed">
              India's trusted wholesale partner for premium disposable items and packaging solutions. We build relationships on reliability and quality.
            </p>
          </div>
        </div>
      </div>

      <section className="py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              <div className="space-y-4 text-muted-foreground text-lg leading-relaxed">
                <p>
                  Established with a vision to streamline the supply chain for hospitality businesses, Veer Mahadev Plastic has grown into a premier wholesale distributor of disposable and packaging products.
                </p>
                <p>
                  We understand that for restaurants, caterers, hotels, and bakeries, packaging isn't just an expense—it's an operational necessity. That's why we focus on maintaining rigorous stock levels, offering competitive B2B pricing, and ensuring prompt delivery.
                </p>
                <p>
                  Our commitment to quality means every plate, cup, and container we supply meets industry standards, helping your business maintain its professional image while managing costs effectively.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-muted/50 p-6 rounded-lg border flex flex-col items-center text-center">
                <div className="h-12 w-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4">
                  <Building2 className="h-6 w-6" />
                </div>
                <h3 className="font-bold text-2xl mb-1">1000+</h3>
                <p className="text-muted-foreground text-sm font-medium">B2B Clients</p>
              </div>
              <div className="bg-muted/50 p-6 rounded-lg border flex flex-col items-center text-center">
                <div className="h-12 w-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4">
                  <Award className="h-6 w-6" />
                </div>
                <h3 className="font-bold text-2xl mb-1">Premium</h3>
                <p className="text-muted-foreground text-sm font-medium">Quality Assured</p>
              </div>
              <div className="bg-muted/50 p-6 rounded-lg border flex flex-col items-center text-center">
                <div className="h-12 w-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4">
                  <Users className="h-6 w-6" />
                </div>
                <h3 className="font-bold text-2xl mb-1">Dedicated</h3>
                <p className="text-muted-foreground text-sm font-medium">Support Team</p>
              </div>
              <div className="bg-muted/50 p-6 rounded-lg border flex flex-col items-center text-center">
                <div className="h-12 w-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4">
                  <MapPin className="h-6 w-6" />
                </div>
                <h3 className="font-bold text-2xl mb-1">Pan-India</h3>
                <p className="text-muted-foreground text-sm font-medium">Supply Network</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted/30 border-t">
        <div className="container mx-auto px-4 md:px-6 text-center max-w-3xl">
          <h2 className="text-3xl font-bold mb-6">Ready to partner with us?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Experience the reliability of a supplier who understands your business needs. Get in touch for bulk orders and wholesale pricing.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/contact" className="inline-flex h-12 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90">
              Request a Quote
            </Link>
            <Link href="/products" className="inline-flex h-12 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground">
              View Catalog
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
