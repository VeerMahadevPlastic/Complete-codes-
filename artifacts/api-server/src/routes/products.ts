import { Router, type IRouter } from "express";
import { db, productOverridesTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

router.get("/products/overrides", async (req, res) => {
  try {
    const rows = await db.select().from(productOverridesTable);
    const map: Record<string, Record<string, unknown>> = {};
    for (const row of rows) {
      const override: Record<string, unknown> = {};
      if (row.name !== null) override.name = row.name;
      if (row.packSize !== null) override.packSize = row.packSize;
      if (row.boxRate !== null) override.boxRate = row.boxRate;
      if (row.pcsRate !== null) override.pcsRate = row.pcsRate;
      if (row.image !== null) override.image = row.image;
      map[row.id] = override;
    }
    res.json(map);
  } catch (err) {
    req.log.error(err, "Failed to fetch product overrides");
    res.status(500).json({ error: "Failed to fetch product overrides" });
  }
});

router.put("/products/overrides/:id", async (req, res) => {
  const { id } = req.params;
  const { name, packSize, boxRate, pcsRate, image } = req.body as {
    name?: string;
    packSize?: number;
    boxRate?: number;
    pcsRate?: number;
    image?: string;
  };
  try {
    await db
      .insert(productOverridesTable)
      .values({ id, name: name ?? null, packSize: packSize ?? null, boxRate: boxRate ?? null, pcsRate: pcsRate ?? null, image: image ?? null })
      .onConflictDoUpdate({
        target: productOverridesTable.id,
        set: { name: name ?? null, packSize: packSize ?? null, boxRate: boxRate ?? null, pcsRate: pcsRate ?? null, image: image ?? null },
      });
    res.json({ ok: true });
  } catch (err) {
    req.log.error(err, "Failed to upsert product override");
    res.status(500).json({ error: "Failed to upsert product override" });
  }
});

router.delete("/products/overrides", async (req, res) => {
  try {
    await db.delete(productOverridesTable);
    res.json({ ok: true });
  } catch (err) {
    req.log.error(err, "Failed to reset all overrides");
    res.status(500).json({ error: "Failed to reset all overrides" });
  }
});

router.delete("/products/overrides/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await db.delete(productOverridesTable).where(eq(productOverridesTable.id, id));
    res.json({ ok: true });
  } catch (err) {
    req.log.error(err, "Failed to delete product override");
    res.status(500).json({ error: "Failed to delete product override" });
  }
});

export default router;
