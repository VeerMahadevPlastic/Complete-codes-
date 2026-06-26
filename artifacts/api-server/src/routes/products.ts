import { Router } from 'express';
import { asc } from 'drizzle-orm';
import { db } from '../../../../lib/db';
import { productsTable } from '../../../../lib/db/schema';

export const productsRouter = Router();

productsRouter.get('/', async (_req, res, next) => {
  try {
    const products = await db.select().from(productsTable).orderBy(asc(productsTable.itemCode));
    res.json({ ok: true, products });
  } catch (error) {
    next(error);
  }
});
