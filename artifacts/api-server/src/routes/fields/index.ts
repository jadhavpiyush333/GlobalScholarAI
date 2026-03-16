import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, fieldInsights, fieldJobOpportunities } from "@workspace/db";

const router: IRouter = Router();

router.get("/", async (_req, res) => {
  const fields = await db.select().from(fieldInsights).orderBy(fieldInsights.name);
  res.json(fields);
});

router.get("/:slug", async (req, res) => {
  const { slug } = req.params;
  const [field] = await db
    .select()
    .from(fieldInsights)
    .where(eq(fieldInsights.slug, slug));

  if (!field) {
    res.status(404).json({ error: "Field not found" });
    return;
  }

  const jobs = await db
    .select()
    .from(fieldJobOpportunities)
    .where(eq(fieldJobOpportunities.fieldId, field.id));

  res.json({ ...field, jobOpportunities: jobs });
});

export default router;
