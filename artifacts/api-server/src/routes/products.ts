import { Router } from 'express';
import { asc } from 'drizzle-orm';
import { db } from '../../../../lib/db';
import { productsTable } from '../../../../lib/db/schema';

export const productsRouter = Router();

const fallbackProducts = [
  { id: '7041', itemCode: '7041', name: '3CP Meal Tray with Lid', category: 'Cornstarch Meal Trays', imageUrl: 'https://i.postimg.cc/L8m7Lx3G/black-meal-tray-stack.png', rawBasePriceInr: 4400, pcsPerPacket: 400, cartonsPerBox: 1 },
  { id: '7043', itemCode: '7043', name: '4CP Meal Tray with Lid', category: 'Cornstarch Meal Trays', imageUrl: 'https://i.postimg.cc/L8m7Lx3G/black-meal-tray-stack.png', rawBasePriceInr: 4890, pcsPerPacket: 300, cartonsPerBox: 1 },
  { id: '7045', itemCode: '7045', name: '5CP Meal Tray with Lid', category: 'Cornstarch Meal Trays', imageUrl: 'https://i.postimg.cc/L8m7Lx3G/black-meal-tray-stack.png', rawBasePriceInr: 5055, pcsPerPacket: 300, cartonsPerBox: 1 },
  { id: '7063', itemCode: '7063', name: '350ML Round Container with Lid', category: 'Cornstarch Containers', imageUrl: 'https://i.postimg.cc/k5ccfQqG/round-container.png', rawBasePriceInr: 3760, pcsPerPacket: 800, cartonsPerBox: 1 },
];

productsRouter.get('/', async (_req, res) => {
  try {
    const products = await db.select().from(productsTable).orderBy(asc(productsTable.itemCode));
    res.json({ ok: true, source: 'postgres', products });
  } catch (error) {
    console.warn('Postgres product feed unavailable; serving manually scanned fallback catalog.', error);
    res.json({ ok: true, source: 'manual-fallback', products: fallbackProducts });
  }
});
