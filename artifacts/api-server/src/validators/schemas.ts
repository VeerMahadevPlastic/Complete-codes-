import { z } from 'zod';

export const currencySchema = z.enum(['INR', 'USD', 'GBP', 'TRY', 'RUB']);

export const authRequestSchema = z.object({
  businessName: z.string().min(2).max(180),
  emailOrPhone: z.string().min(5).max(180),
});

export const verifyOtpSchema = authRequestSchema.extend({
  otp: z.string().regex(/^\d{6}$/),
});

export const enquiryItemSchema = z.object({
  productId: z.string().optional(),
  itemCode: z.string().min(1),
  name: z.string().min(1),
  quantity: z.number().positive(),
  masterCartons: z.number().nonnegative(),
  unitPriceInr: z.number().nonnegative().optional(),
});

export const enquiryPayloadSchema = z.object({
  consignee: z.object({
    businessName: z.string().min(2),
    contact: z.string().min(5),
    gstin: z.string().optional(),
  }),
  deliveryAddress: z.object({
    street: z.string().min(3),
    landmark: z.string().optional(),
    districtState: z.string().min(2),
    pinCode: z.string().min(4),
  }),
  items: z.array(enquiryItemSchema).min(1),
  totalMasterCartons: z.number().nonnegative(),
  currency: currencySchema.default('INR'),
  totalAmount: z.number().nonnegative(),
});

export type EnquiryPayload = z.infer<typeof enquiryPayloadSchema>;
