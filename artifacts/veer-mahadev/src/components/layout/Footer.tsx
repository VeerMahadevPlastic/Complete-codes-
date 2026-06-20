import { Link } from "wouter";
import logoImg from "@assets/Gemini_Generated_Image_6ru27q6ru27q6ru2_1781943190526.png";
import { MapPin, Phone, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="space-y-4 md:col-span-1">
            <Link href="/" className="flex items-center space-x-2">
              <img src={logoImg} alt="Veer Mahadev Plastic" className="h-12 w-auto bg-white rounded-md p-1" />
            </Link>
            <p className="text-sm text-secondary-foreground/80 leading-relaxed">
              Premium wholesale distributor of packaging and disposable products for the hospitality and food service industry.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-secondary-foreground/80">
              <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/products" className="hover:text-white transition-colors">Product Catalog</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact & Enquiries</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Categories</h3>
            <ul className="space-y-2 text-sm text-secondary-foreground/80">
              <li><Link href="/products?category=Disposable+Plates" className="hover:text-white transition-colors">Disposable Plates</Link></li>
              <li><Link href="/products?category=Cups+%26+Glasses" className="hover:text-white transition-colors">Cups & Glasses</Link></li>
              <li><Link href="/products?category=Cutlery" className="hover:text-white transition-colors">Cutlery Sets</Link></li>
              <li><Link href="/products?category=Bowls+%26+Containers" className="hover:text-white transition-colors">Bowls & Containers</Link></li>
              <li><Link href="/products?category=Packaging+%26+Foils" className="hover:text-white transition-colors">Packaging & Foils</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm text-secondary-foreground/80">
              <li className="flex items-start">
                <MapPin className="h-4 w-4 mr-2 mt-0.5 shrink-0 text-primary" />
                <span>123 Wholesale Market, Industrial Area, Delhi, India 110001</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-4 w-4 mr-2 shrink-0 text-primary" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-4 w-4 mr-2 shrink-0 text-primary" />
                <span>sales@veermahadev.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-secondary-foreground/10 text-center text-sm text-secondary-foreground/60">
          <p>© {new Date().getFullYear()} Veer Mahadev Plastic. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
