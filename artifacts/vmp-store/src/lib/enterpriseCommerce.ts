import { type CurrencyCode, convertFromInr, formatRegionalPrice } from "@workspace/api-client-react";

export type OnboardingProfile = {
  name: string;
  contact: string;
  corporateGstin: string;
  deliveryAddress: string;
  state: string;
  pinCode: string;
  verifiedAt: string;
};

export type CartLine = {
  itemCode: string;
  name: string;
  quantity: number;
  packingSize: number;
  pieceRateInr: number;
};

export type CartonLine = CartLine & {
  masterCartons: number;
  grossRegionalValue: number;
  discountRate: number;
  netRegionalValue: number;
  formattedPieceRate: string;
};

export function getWholesaleDiscountRate(totalCartons: number): number {
  if (totalCartons >= 25) return 0.05;
  if (totalCartons >= 10) return 0.03;
  return 0;
}

export function calculateCartonSummary(lines: CartLine[], currency: CurrencyCode) {
  const totalCartons = lines.reduce((sum, line) => sum + line.quantity / line.packingSize, 0);
  const discountRate = getWholesaleDiscountRate(totalCartons);
  const cartonLines: CartonLine[] = lines.map((line) => {
    const grossRegionalValue = convertFromInr(line.quantity * line.pieceRateInr, currency);
    return {
      ...line,
      masterCartons: line.quantity / line.packingSize,
      grossRegionalValue,
      discountRate,
      netRegionalValue: grossRegionalValue * (1 - discountRate),
      formattedPieceRate: formatRegionalPrice(line.pieceRateInr, currency),
    };
  });
  const grossRegionalTotal = cartonLines.reduce((sum, line) => sum + line.grossRegionalValue, 0);
  return {
    lines: cartonLines,
    totalCartons,
    discountRate,
    grossRegionalTotal,
    discountRegionalValue: grossRegionalTotal * discountRate,
    netRegionalTotal: grossRegionalTotal * (1 - discountRate),
  };
}

export function persistOnboardingProfile(profile: OnboardingProfile) {
  sessionStorage.setItem("vmp:onboarding-profile", JSON.stringify(profile));
}

export function readOnboardingProfile(): OnboardingProfile | null {
  const raw = sessionStorage.getItem("vmp:onboarding-profile");
  return raw ? (JSON.parse(raw) as OnboardingProfile) : null;
}
