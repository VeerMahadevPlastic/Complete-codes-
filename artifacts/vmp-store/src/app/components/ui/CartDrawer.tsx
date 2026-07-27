'use client';

import { useStore } from '../context/GlobalStateContext';
import { openWhatsAppInquiry } from '../../lib/whatsapp';

export function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { cart, updateCartQuantity, clearCart, currency, session } = useStore();
  const totalMasterCartons = cart.reduce((sum, item) => sum + item.quantity * item.cartonsPerBox, 0);

  const submitEnquiry = async () => {
    const payload = {
      consignee: { businessName: session?.businessName ?? 'Guest Business', contact: session?.emailOrPhone ?? 'unverified' },
      deliveryAddress: { street: 'Pending checkout address', districtState: 'Pending', pinCode: '000000' },
      items: cart.map((item) => ({ productId: item.id, itemCode: item.itemCode, name: item.name, quantity: item.quantity, masterCartons: item.quantity * item.cartonsPerBox, unitPriceInr: item.rawBasePriceInr })),
      totalMasterCartons,
      currency,
      totalAmount: 0,
    };
    await fetch('/api/enquiries/dispatch-whatsapp', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }).catch(() => undefined);
    const firstItem = cart[0];
    if (firstItem) openWhatsAppInquiry({ product: firstItem, productUrl: `${window.location.origin}/products/${firstItem.itemCode}`, session, address: session?.defaultAddress ?? null });
    clearCart();
    onClose();
  };

  return (
    <aside className={`fixed right-0 top-0 z-40 h-dvh w-full max-w-xl border-l border-white/30 bg-white/80 shadow-glass backdrop-blur-xl backdrop-saturate-150 transition-transform duration-300 ease-premium transform-gpu will-change-transform ${open ? 'translate-x-0' : 'translate-x-full'}`}>
      <header className="flex items-center justify-between bg-slate-950 px-6 py-5 text-white">
        <div><h2 className="text-xl font-black">Enquiry Cart</h2><p className="text-sm text-white/60">{cart.length} products · {totalMasterCartons} master cartons</p></div>
        <button onClick={onClose} className="rounded-full p-2 hover:bg-white/10">×</button>
      </header>
      <div className="h-[calc(100dvh-210px)] space-y-4 overflow-y-auto p-5 [-webkit-overflow-scrolling:touch]">
        {cart.length === 0 ? <p className="rounded-3xl border border-dashed border-black/10 p-10 text-center text-slate-500">Your enquiry cart is empty.</p> : cart.map((item) => (
          <div key={item.itemCode} className="rounded-3xl border border-black/[0.06] bg-white/75 p-4 shadow-sm backdrop-blur">
            <div className="flex gap-4"><img src={item.imageUrl} alt="" className="h-20 w-20 rounded-2xl object-contain bg-slate-50" /><div className="flex-1"><h3 className="font-black">{item.name}</h3><p className="text-sm text-slate-500">{item.itemCode} · {item.pcsPerPacket} pcs/box</p><p className="mt-2 text-xs font-bold text-emerald-700">Qty to Master Cartons: {item.quantity} → {item.quantity * item.cartonsPerBox}</p></div></div>
            <div className="mt-4 flex items-center justify-between"><div className="flex rounded-2xl border border-black/10"><button className="px-3" onClick={() => updateCartQuantity(item.itemCode, item.quantity - 1)}>−</button><span className="px-4 py-2 font-bold">{item.quantity}</span><button className="px-3" onClick={() => updateCartQuantity(item.itemCode, item.quantity + 1)}>+</button></div><strong className="text-emerald-700">Quote on WhatsApp</strong></div>
          </div>
        ))}
      </div>
      <footer className="border-t border-black/[0.06] bg-white/85 p-5 backdrop-blur">
        <div className="mb-4 rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-800">Prices are hidden. Submit items to receive the best live wholesale quote.</div>
        <button disabled={!cart.length} onClick={submitEnquiry} className="w-full rounded-2xl bg-emerald-600 py-4 font-black text-white transition hover:scale-[1.01] disabled:opacity-40 transform-gpu">Get Price on WhatsApp</button>
      </footer>
    </aside>
  );
}
