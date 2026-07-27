export function Footer() {
  return (
    <footer className="mt-20 bg-slate-950 px-4 py-14 text-white">
      <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-3">
        <div><h2 className="text-2xl font-black">Veer Mahadev Plastic</h2><p className="mt-4 text-white/65">Premium eco-friendly wholesale packaging manufacturer for restaurants, caterers, hotels and bakeries.</p></div>
        <div><h3 className="font-black">Quick Links</h3><div className="mt-4 grid gap-2 text-white/65"><a href="/">Home</a><a href="/categories">Categories</a><a href="/checkout">Checkout</a></div></div>
        <div><h3 className="font-black">Contact</h3><p className="mt-4 text-white/65">Ahmedabad manufacturing desk · sales@veermahadev.com · +91 98765 43210</p></div>
      </div>
    </footer>
  );
}
