'use client';

import { useEffect, useState } from 'react';
import { useStore } from '../context/GlobalStateContext';

export function AuthModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { setSession } = useStore();
  const [step, setStep] = useState<1 | 2>(1);
  const [identity, setIdentity] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [seconds, setSeconds] = useState(45);

  useEffect(() => {
    if (!open || step !== 2 || seconds <= 0) return;
    const timer = window.setTimeout(() => setSeconds((value) => value - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [open, seconds, step]);

  if (!open) return null;

  const verifyBusiness = async () => {
    if (identity.trim().length < 5 || businessName.trim().length < 2) return;
    setStep(2);
    setSeconds(45);
    await fetch('/api/auth/request-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ businessName, emailOrPhone: identity }),
    }).catch(() => undefined);
  };

  const completeVerification = () => {
    if (otp.join('').length !== 6) return;
    setSession({ businessName, emailOrPhone: identity, token: `vmp_${crypto.randomUUID()}`, verifiedAt: new Date().toISOString() });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/55 p-4 backdrop-blur-sm">
      <section className="w-full max-w-md overflow-hidden rounded-[2rem] border border-white/35 bg-white/80 p-6 text-slate-950 shadow-glass backdrop-blur-xl backdrop-saturate-150 transform-gpu transition-all duration-300">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-emerald-600">Business verification</p>
            <h2 className="mt-2 text-2xl font-black">Sign In / Register</h2>
          </div>
          <button onClick={onClose} className="rounded-full px-3 py-1 text-slate-500 transition hover:bg-slate-100">×</button>
        </div>
        <div className="flex transition-transform duration-300 ease-premium" style={{ transform: `translateX(${step === 1 ? '0%' : '-100%'})`, width: '200%' }}>
          <div className="w-1/2 pr-2">
            <label className="text-sm font-semibold">Business name</label>
            <input className="mt-2 w-full rounded-2xl border border-black/10 bg-white/80 px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-300" value={businessName} onChange={(event) => setBusinessName(event.target.value)} placeholder="Sharma Enterprises" />
            <label className="mt-4 block text-sm font-semibold">Mobile number or corporate email</label>
            <input className="mt-2 w-full rounded-2xl border border-black/10 bg-white/80 px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-300" value={identity} onChange={(event) => setIdentity(event.target.value)} placeholder="buyer@company.com / +91..." />
            <button onClick={verifyBusiness} className="mt-6 w-full rounded-2xl bg-emerald-600 px-5 py-3 font-bold text-white shadow-lg shadow-emerald-600/25 transition duration-250 ease-premium hover:scale-[1.02] hover:bg-emerald-700 transform-gpu">Verify Business</button>
          </div>
          <div className="w-1/2 pl-2">
            <p className="text-sm text-slate-600">Enter the secure verification code sent to your business contact.</p>
            <div className="mt-5 grid grid-cols-6 gap-2">
              {otp.map((digit, index) => (
                <input key={index} maxLength={1} inputMode="numeric" value={digit} onChange={(event) => setOtp((digits) => digits.map((item, itemIndex) => itemIndex === index ? event.target.value.replace(/\D/g, '') : item))} className="h-12 rounded-2xl border border-black/10 bg-white/90 text-center text-xl font-black outline-none focus:ring-2 focus:ring-emerald-300" />
              ))}
            </div>
            <div className="mt-4 flex items-center justify-between text-sm text-slate-500">
              <span>OTP: 246810 in dev</span>
              <button disabled={seconds > 0} onClick={() => setSeconds(45)} className="font-semibold text-emerald-700 disabled:text-slate-400">Resend {seconds > 0 ? `${seconds}s` : ''}</button>
            </div>
            <button onClick={completeVerification} className="mt-6 w-full rounded-2xl bg-slate-950 px-5 py-3 font-bold text-white transition duration-250 ease-premium hover:scale-[1.02] transform-gpu">Complete Verification</button>
          </div>
        </div>
      </section>
    </div>
  );
}
