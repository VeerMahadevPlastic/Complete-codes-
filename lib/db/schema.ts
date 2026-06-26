import { boolean, index, integer, jsonb, numeric, pgTable, timestamp, uuid, varchar, text } from 'drizzle-orm/pg-core';

export const usersTable = pgTable('users_table', {
  id: uuid('id').primaryKey().defaultRandom(),
  businessName: varchar('business_name', { length: 180 }).notNull(),
  emailOrPhone: varchar('email_or_phone', { length: 180 }).notNull().unique(),
  verifiedStatus: boolean('verified_status').notNull().default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  emailOrPhoneIdx: index('users_email_or_phone_idx').on(table.emailOrPhone),
}));

export const productsTable = pgTable('products_table', {
  id: uuid('id').primaryKey().defaultRandom(),
  itemCode: varchar('item_code', { length: 40 }).notNull().unique(),
  name: varchar('name', { length: 220 }).notNull(),
  imageUrl: text('image_url'),
  rawBasePriceInr: numeric('raw_base_price_inr', { precision: 10, scale: 2 }).notNull(),
  pcsPerPacket: integer('pcs_per_packet').notNull().default(1),
  cartonsPerBox: integer('cartons_per_box').notNull().default(1),
});

export const ordersTable = pgTable('orders_table', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => usersTable.id),
  totalAmount: numeric('total_amount', { precision: 12, scale: 2 }).notNull(),
  selectedCurrency: varchar('selected_currency', { length: 8 }).notNull().default('INR'),
  orderedItemsJson: jsonb('ordered_items_json').$type<Array<{
    productId: string;
    itemCode: string;
    quantity: number;
    masterCartons: number;
    unitPriceInr: string | number;
  }>>().notNull(),
  orderStatus: varchar('order_status', { length: 40 }).notNull().default('Pending_Review'),
});

export type User = typeof usersTable.$inferSelect;
export type Product = typeof productsTable.$inferSelect;
export type Order = typeof ordersTable.$inferSelect;
