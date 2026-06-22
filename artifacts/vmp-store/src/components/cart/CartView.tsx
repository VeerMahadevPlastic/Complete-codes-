import { currencyMatrix, type CurrencyCode } from "@workspace/api-client-react";
import { calculateCartonSummary, type CartLine } from "../../lib/enterpriseCommerce";

type CartViewProps = {
  lines: CartLine[];
  currency: CurrencyCode;
};

function formatConverted(value: number, currency: CurrencyCode) {
  return `${currencyMatrix[currency].symbol}${value.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;
}

export function CartView({ lines, currency }: CartViewProps) {
  const summary = calculateCartonSummary(lines, currency);

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-xl font-black text-slate-950">Wholesale carton calculator</h2>
        <span className="rounded-full bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-700">
          {summary.totalCartons.toFixed(2)} master cartons
        </span>
      </div>
      <div className="space-y-4">
        {summary.lines.map((line) => (
          <article key={line.itemCode} className="grid gap-3 rounded-2xl border border-slate-100 p-4 md:grid-cols-5">
            <div className="md:col-span-2">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-400">{line.itemCode}</p>
              <h3 className="font-bold text-slate-900">{line.name}</h3>
            </div>
            <p className="font-semibold text-slate-700">Qty: {line.quantity}</p>
            <p className="font-semibold text-slate-700">Pack: {line.packingSize}</p>
            <p className="font-semibold text-slate-950">{line.masterCartons.toFixed(2)} cartons</p>
            <p className="md:col-span-5 text-sm text-slate-500">
              Piece rate {line.formattedPieceRate} · Line net {formatConverted(line.netRegionalValue, currency)}
            </p>
          </article>
        ))}
      </div>
      <div className="mt-6 rounded-2xl bg-slate-950 p-5 text-white">
        <div className="flex justify-between"><span>Gross regional value</span><b>{formatConverted(summary.grossRegionalTotal, currency)}</b></div>
        <div className="flex justify-between text-amber-200"><span>Volume discount</span><b>{(summary.discountRate * 100).toFixed(0)}%</b></div>
        <div className="mt-3 flex justify-between border-t border-white/20 pt-3 text-lg"><span>Checkout total</span><b>{formatConverted(summary.netRegionalTotal, currency)}</b></div>
      </div>
    </section>
  );
}
