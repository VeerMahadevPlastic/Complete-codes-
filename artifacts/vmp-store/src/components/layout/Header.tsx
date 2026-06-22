import { currencyOptions, type CurrencyCode, isCurrencyCode } from "@workspace/api-client-react";

type HeaderProps = {
  currency: CurrencyCode;
  onCurrencyChange: (currency: CurrencyCode) => void;
};

export function Header({ currency, onCurrencyChange }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-600">VMP Enterprise</p>
          <h1 className="text-2xl font-black text-slate-950">Factory wholesale procurement</h1>
        </div>
        <label className="flex items-center gap-3 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm">
          B2B Currency
          <select
            className="bg-transparent font-bold text-slate-950 outline-none"
            value={currency}
            onChange={(event) => {
              const nextCurrency = event.target.value;
              if (isCurrencyCode(nextCurrency)) onCurrencyChange(nextCurrency);
            }}
            aria-label="Select regional currency"
          >
            {currencyOptions.map((option) => (
              <option key={option.code} value={option.code}>
                {option.code} ({option.symbol})
              </option>
            ))}
          </select>
        </label>
      </div>
    </header>
  );
}
