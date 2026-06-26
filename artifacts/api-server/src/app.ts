import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { authRouter } from './routes/auth';
import { productsRouter } from './routes/products';
import { enquiriesRouter, queueAdminNotification } from './routes/enquiries';

export const app = express();

const corsOrigins = process.env.CORS_ORIGIN
  ?.split(',')
  .map((origin) => origin.trim())
  .filter((origin) => origin.length > 0);

app.use(helmet());
app.use(cors({ origin: corsOrigins && corsOrigins.length > 0 ? corsOrigins : false, credentials: true }));
app.use(express.json({ limit: '1mb' }));

app.get('/health', (_req, res) => res.json({ ok: true, service: 'vmp-api-server' }));
app.use('/api/auth', authRouter);
app.use('/api/products', productsRouter);
app.use('/api/enquiries', enquiriesRouter);
app.post('/api/orders/notify-whatsapp', queueAdminNotification);

app.use((error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(error);
  res.status(500).json({ ok: false, message: 'Internal server error' });
});
