export const siteBranding = {
  websiteName: process.env.NEXT_PUBLIC_SITE_NAME ?? 'Veer Mahadev Plastic',
  logoUrl: process.env.NEXT_PUBLIC_LOGO_URL ?? '/icons/logo.svg',
  adminWhatsAppNumber: process.env.NEXT_PUBLIC_ADMIN_WHATSAPP ?? '919876543210',
  contact: {
    phone: process.env.NEXT_PUBLIC_CONTACT_PHONE ?? '+91 98765 43210',
    email: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? 'sales@veermahadev.com',
    address: process.env.NEXT_PUBLIC_CONTACT_ADDRESS ?? 'Ahmedabad manufacturing desk, Gujarat, India',
    socials: {
      instagram: process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM ?? '',
      linkedin: process.env.NEXT_PUBLIC_SOCIAL_LINKEDIN ?? '',
      facebook: process.env.NEXT_PUBLIC_SOCIAL_FACEBOOK ?? '',
    },
  },
};
