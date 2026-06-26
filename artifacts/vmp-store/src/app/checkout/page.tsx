'use client';

import { useMemo, useState } from 'react';
import { useStore } from '../components/context/GlobalStateContext';

export default function CheckoutPage() {
  const { cart, currency, session, formatMoney, clearCart } = useStore();
  const [form, setForm] = useState({ fullName: '', mobile: '', street: '', landmark: '', districtState: '', pinCode: '', gstin: '' });
  const total = useMemo(() => cart.reduce((sum, item) => sum + item.rawBasePriceInr * item.quantity, 0), [cart]);
  const totalMasterCartons = cart.reduce((sum, item) => sum + item.quantity * item.cartonsPerBox, 0);

  const submit = async () => {
    const payload = {
      consignee: { businessName: session?.businessName ?? form.fullName, contact: form.mobile, gstin: form.gstin || undefined },
      deliveryAddress: { street: form.street, landmark: form.landmark, districtState: form.districtState, pinCode: form.pinCode },
      items: cart.map((item) => ({ productId: item.id, itemCode: item.itemCode, name: item.name, quantity: item.quantity, masterCartons: item.quantity * item.cartonsPerBox, unitPriceInr: item.rawBasePriceInr })),
      totalMasterCartons,
      currency,
      totalAmount: total,
    };
    await fetch('/api/enquiries/dispatch-whatsapp', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    clearCart();
  };

  return (
    <main className="mx-auto grid max-w-7xl gap-6 px-4 py-10 lg:grid-cols-[1fr_420px]">
      <section className="rounded-[2rem] border border-white/40 bg-white/80 p-6 shadow-glass backdrop-blur-xl">
        <p className="text-xs font-black uppercase tracking-[0.32em] text-emerald-700">Delivery metadata</p>
        <h1 className="mt-2 text-3xl font-black">Corporate order submission matrix</h1>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {[
            ['fullName', 'Consignee Full Name'], ['mobile', 'Active Mobile Contact'], ['street', 'Complete Factory/Warehouse Street Address'], ['landmark', 'Landmark'], ['districtState', 'District / State'], ['pinCode', 'Pin Code'], ['gstin', 'Corporate GSTIN (optional)'],
          ].map(([key, label]) => <label key={key} className="text-sm font-bold text-slate-700">{label}<input value={form[key as keyof typeof form]} onChange={(event) => setForm((value) => ({ ...value, [key]: event.target.value }))} className="mt-2 w-full rounded-2xl border border-black/[0.06] bg-white/75 px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-300" /></label>)}
        </div>
      </section>
      <aside className="rounded-[2rem] border border-white/40 bg-white/80 p-6 shadow-glass backdrop-blur-xl">
        <h2 className="text-2xl font-black">Final review</h2>
        <div className="mt-5 space-y-3">{cart.map((item) => <div key={item.itemCode} className="rounded-2xl border border-black/[0.06] bg-white/70 p-3"><strong>{item.name}</strong><p className="text-sm text-slate-500">{item.quantity} boxes · {item.quantity * item.cartonsPerBox} master cartons</p></div>)}</div>
        <div className="mt-6 flex items-center justify-between border-t border-black/[0.06] pt-4"><span className="font-bold">Total</span><strong className="text-2xl">{formatMoney(total)}</strong></div>
        <button onClick={submit} className="mt-5 w-full rounded-2xl bg-emerald-600 py-4 font-black text-white transition hover:scale-[1.01] transform-gpu">Dispatch to Admin</button>
      </aside>
    </main>
  );
}
