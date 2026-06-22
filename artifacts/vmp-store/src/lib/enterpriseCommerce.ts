import { type CurrencyCode, convertFromInr, formatRegionalPrice, roundCurrency } from "@workspace/api-client-react";

export const ONBOARDING_PROFILE_SESSION_KEY = "vmp:onboarding-profile";
export const ONBOARDING_PROFILE_EVENT = "vmp:onboarding-profile-updated";

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
  discountRegionalValue: number;
  netRegionalValue: number;
  formattedPieceRate: string;
};

export function getWholesaleDiscountRate(totalCartons: number): number {
  if (totalCartons >= 25) return 0.05;
  if (totalCartons >= 10) return 0.03;
  return 0;
}

export function calculateCartonSummary(lines: CartLine[], currency: CurrencyCode) {
  const totalCartons = roundCurrency(lines.reduce((sum, line) => sum + line.quantity / line.packingSize, 0));
  const discountRate = getWholesaleDiscountRate(totalCartons);
  const cartonLines: CartonLine[] = lines.map((line) => {
    const grossRegionalValue = convertFromInr(line.quantity * line.pieceRateInr, currency);
    const discountRegionalValue = roundCurrency(grossRegionalValue * discountRate);
    return {
      ...line,
      masterCartons: roundCurrency(line.quantity / line.packingSize),
      grossRegionalValue,
      discountRate,
      discountRegionalValue,
      netRegionalValue: roundCurrency(grossRegionalValue - discountRegionalValue),
      formattedPieceRate: formatRegionalPrice(line.pieceRateInr, currency),
    };
  });
  const grossRegionalTotal = roundCurrency(cartonLines.reduce((sum, line) => sum + line.grossRegionalValue, 0));
  const discountRegionalValue = roundCurrency(grossRegionalTotal * discountRate);
  return {
    lines: cartonLines,
    totalCartons,
    discountRate,
    grossRegionalTotal,
    discountRegionalValue,
    netRegionalTotal: roundCurrency(grossRegionalTotal - discountRegionalValue),
  };
}

export function persistOnboardingProfile(profile: OnboardingProfile) {
  sessionStorage.setItem(ONBOARDING_PROFILE_SESSION_KEY, JSON.stringify(profile));
  window.dispatchEvent(new CustomEvent<OnboardingProfile>(ONBOARDING_PROFILE_EVENT, { detail: profile }));
}

export function readOnboardingProfile(): OnboardingProfile | null {
  const raw = sessionStorage.getItem(ONBOARDING_PROFILE_SESSION_KEY);
  return raw ? (JSON.parse(raw) as OnboardingProfile) : null;
}
