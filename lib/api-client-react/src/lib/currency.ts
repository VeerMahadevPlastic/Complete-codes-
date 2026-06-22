export const currencyMatrix = {
  INR: { code: "INR", symbol: "₹", multiplier: 1, label: "Indian Rupee" },
  USD: { code: "USD", symbol: "$", multiplier: 0.012, label: "US Dollar" },
  GBP: { code: "GBP", symbol: "£", multiplier: 0.0095, label: "Pound Sterling" },
  TRY: { code: "TRY", symbol: "₺", multiplier: 0.39, label: "Turkish Lira" },
  RUB: { code: "RUB", symbol: "₽", multiplier: 1.08, label: "Russian Ruble" },
} as const;

export type CurrencyCode = keyof typeof currencyMatrix;
export type CurrencyOption = (typeof currencyMatrix)[CurrencyCode];

export const currencyOptions: CurrencyOption[] = Object.values(currencyMatrix);

export function isCurrencyCode(value: string): value is CurrencyCode {
  return value in currencyMatrix;
}

export function convertFromInr(amount: number, currency: CurrencyCode): number {
  return roundCurrency(amount * currencyMatrix[currency].multiplier);
}

export function formatRegionalPrice(amountInInr: number, currency: CurrencyCode): string {
  const converted = convertFromInr(amountInInr, currency);
  return `${currencyMatrix[currency].symbol}${converted.toLocaleString("en-IN", {
    minimumFractionDigits: converted % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  })}`;
}

export function roundCurrency(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}
