import { pgTable, text, real, integer } from "drizzle-orm/pg-core";

export const productOverridesTable = pgTable("product_overrides", {
  id: text("id").primaryKey(),
  name: text("name"),
  packSize: integer("pack_size"),
  boxRate: real("box_rate"),
  pcsRate: real("pcs_rate"),
  image: text("image"),
});

export type ProductOverrideRow = typeof productOverridesTable.$inferSelect;
