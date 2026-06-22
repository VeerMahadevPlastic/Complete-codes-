import { useMemo, useState } from "react";
import { type CurrencyCode } from "@workspace/api-client-react";
import { CartView } from "../components/cart/CartView";
import { Header } from "../components/layout/Header";
import { persistOnboardingProfile, type CartLine } from "../lib/enterpriseCommerce";

const demoLines: CartLine[] = [
  { itemCode: "VMP-7041", name: "3CP meal tray with lid", quantity: 4600, packingSize: 400, pieceRateInr: 12.5 },
  { itemCode: "VMP-BUF-09", name: "Buffer plate premium", quantity: 2500, packingSize: 250, pieceRateInr: 8.75 },
];

export default function Checkout() {
  const [step, setStep] = useState<1 | 2>(1);
  const [currency, setCurrency] = useState<CurrencyCode>("INR");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [profile, setProfile] = useState({
    name: "",
    contact: "",
    corporateGstin: "",
    deliveryAddress: "",
    state: "",
    pinCode: "",
  });
  const otpComplete = useMemo(() => otp.every(Boolean), [otp]);

  function completeProfile() {
    if (!otpComplete) return;
    persistOnboardingProfile({ ...profile, verifiedAt: new Date().toISOString() });
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <Header currency={currency} onCurrencyChange={setCurrency} />
      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-10 lg:grid-cols-[0.95fr_1.05fr]">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
          <p className="text-sm font-bold uppercase tracking-[0.28em] text-amber-600">Secure enterprise login</p>
          <h2 className="mt-2 text-3xl font-black text-slate-950">Amazon-style OTP onboarding</h2>

          <div className="mt-8 space-y-5">
            <label className="block text-sm font-bold text-slate-700">
              Mobile number or business email
              <input className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3" value={profile.contact} onChange={(event) => setProfile({ ...profile, contact: event.target.value })} />
            </label>
            {step === 1 ? (
              <button className="w-full rounded-2xl bg-slate-950 px-5 py-3 font-black text-white" onClick={() => setStep(2)} disabled={!profile.contact}>
                Continue to OTP verification
              </button>
            ) : (
              <div className="rounded-2xl bg-amber-50 p-4">
                <p className="font-bold text-amber-900">Enter simulated one-time password</p>
                <div className="mt-3 grid grid-cols-6 gap-2">
                  {otp.map((digit, index) => (
                    <input key={index} className="h-12 rounded-xl border border-amber-200 text-center text-xl font-black" inputMode="numeric" maxLength={1} value={digit} onChange={(event) => setOtp(otp.map((value, valueIndex) => (valueIndex === index ? event.target.value.replace(/\D/g, "") : value)))} />
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="mt-8 grid gap-4">
            {([
              ["name", "Authorized buyer name"],
              ["corporateGstin", "Corporate GSTIN"],
              ["deliveryAddress", "Complete delivery address"],
              ["state", "State"],
              ["pinCode", "Pin code"],
            ] as const).map(([key, label]) => (
              <label key={key} className="block text-sm font-bold text-slate-700">
                {label}
                <input className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3" value={profile[key]} onChange={(event) => setProfile({ ...profile, [key]: event.target.value })} />
              </label>
            ))}
            <button className="rounded-2xl bg-emerald-600 px-5 py-3 font-black text-white disabled:bg-slate-300" disabled={!otpComplete} onClick={completeProfile}>
              Persist verified session profile
            </button>
          </div>
        </section>
        <CartView lines={demoLines} currency={currency} />
      </div>
    </main>
  );
}
