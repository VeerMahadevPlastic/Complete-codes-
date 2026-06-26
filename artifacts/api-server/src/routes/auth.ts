import { Router } from 'express';
import { authRequestSchema, verifyOtpSchema } from '../validators/schemas';

export const authRouter = Router();
const otpStore = new Map<string, { otp: string; expiresAt: number }>();

const keyFor = (identity: string) => identity.trim().toLowerCase();

authRouter.post('/request-otp', (req, res) => {
  const parsed = authRequestSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ ok: false, errors: parsed.error.flatten() });
  const otp = process.env.NODE_ENV === 'production' ? String(Math.floor(100000 + Math.random() * 900000)) : '246810';
  otpStore.set(keyFor(parsed.data.emailOrPhone), { otp, expiresAt: Date.now() + 5 * 60_000 });
  return res.json({ ok: true, challengeId: keyFor(parsed.data.emailOrPhone), expiresInSeconds: 300, devOtp: process.env.NODE_ENV === 'production' ? undefined : otp });
});

authRouter.post('/verify-otp', (req, res) => {
  const parsed = verifyOtpSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ ok: false, errors: parsed.error.flatten() });
  const challenge = otpStore.get(keyFor(parsed.data.emailOrPhone));
  if (!challenge || challenge.expiresAt < Date.now() || challenge.otp !== parsed.data.otp) {
    return res.status(401).json({ ok: false, message: 'Invalid or expired OTP.' });
  }
  otpStore.delete(keyFor(parsed.data.emailOrPhone));
  return res.json({
    ok: true,
    session: {
      businessName: parsed.data.businessName,
      emailOrPhone: parsed.data.emailOrPhone,
      verifiedStatus: true,
      token: `vmp_${crypto.randomUUID()}`,
      verifiedAt: new Date().toISOString(),
    },
  });
});
