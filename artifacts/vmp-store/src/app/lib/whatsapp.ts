import type { BusinessSession, Product, SavedAddress } from '../components/context/GlobalStateContext';
import { siteBranding } from './branding';

type WhatsAppInquiryInput = {
  product: Product;
  productUrl?: string;
  session?: BusinessSession | null;
  address?: SavedAddress | null;
};

export function buildWhatsAppInquiryMessage({ product, productUrl, session, address }: WhatsAppInquiryInput) {
  const lines = [
    `Hi, I am interested in ${product.name} (SKU: ${product.itemCode}).`,
    `Product Link: ${productUrl ?? ''}`,
    'Please share the best price.',
  ];

  if (session) lines.push(`Customer Name: ${session.businessName}, Mobile: ${session.phone ?? session.emailOrPhone}`);
  if (address) lines.push(`Deliver to: ${address.cityOrDistrict} ${address.pinCode}`);

  return lines.filter(Boolean).join('\n');
}

export function buildWhatsAppInquiryUrl(input: WhatsAppInquiryInput) {
  const message = encodeURIComponent(buildWhatsAppInquiryMessage(input));
  return `https://wa.me/${siteBranding.adminWhatsAppNumber}?text=${message}`;
}

export function openWhatsAppInquiry(input: WhatsAppInquiryInput) {
  window.open(buildWhatsAppInquiryUrl(input), '_blank', 'noopener,noreferrer');
}
