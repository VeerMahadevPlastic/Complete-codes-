import type { Request, Response } from 'express';
import { Router } from 'express';
import { enquiryPayloadSchema, type EnquiryPayload } from '../validators/schemas';

export const enquiriesRouter = Router();
const enquiryLog: Array<{ id: string; status: string; payload: EnquiryPayload; adminMessage: string; createdAt: string }> = [];

function formatAdminNotification(payload: EnquiryPayload): string {
  const itemLines = payload.items.map((item) => `• ${item.itemCode} ${item.name} × ${item.quantity} | ${item.masterCartons.toFixed(2)} cartons`);
  return [
    'VMP SYSTEM ADMIN NOTIFICATION',
    `Business: ${payload.consignee.businessName}`,
    `Contact/GSTIN: ${payload.consignee.contact}${payload.consignee.gstin ? ` / ${payload.consignee.gstin}` : ''}`,
    `Delivery: ${payload.deliveryAddress.street}, ${payload.deliveryAddress.landmark ?? ''}, ${payload.deliveryAddress.districtState} ${payload.deliveryAddress.pinCode}`,
    `Total cartons: ${payload.totalMasterCartons.toFixed(2)}`,
    `Total: ${payload.currency} ${payload.totalAmount.toFixed(2)}`,
    'Items:',
    ...itemLines,
  ].join('\n');
}

export function queueAdminNotification(req: Request, res: Response) {
  const parsed = enquiryPayloadSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ ok: false, errors: parsed.error.flatten() });
  const record = {
    id: crypto.randomUUID(),
    status: 'Pending_Review',
    payload: parsed.data,
    adminMessage: formatAdminNotification(parsed.data),
    createdAt: new Date().toISOString(),
  };
  enquiryLog.unshift(record);
  console.info(record.adminMessage);
  return res.status(202).json({ ok: true, channel: 'admin_notification', enquiry: record });
}

enquiriesRouter.get('/', (_req, res) => {
  res.json({ ok: true, enquiries: enquiryLog });
});

enquiriesRouter.post('/dispatch-whatsapp', queueAdminNotification);
