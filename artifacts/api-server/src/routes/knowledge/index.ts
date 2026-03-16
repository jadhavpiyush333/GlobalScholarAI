import { Router, type IRouter } from "express";
import { eq, ilike, or } from "drizzle-orm";
import { db, universities, programs, visaRequirements } from "@workspace/db";

const router: IRouter = Router();

router.get("/universities", async (req, res) => {
  const { country, search } = req.query as { country?: string; search?: string };

  let query = db.select().from(universities);
  const conditions = [];

  if (country) {
    conditions.push(ilike(universities.country, `%${country}%`));
  }
  if (search) {
    conditions.push(
      or(
        ilike(universities.name, `%${search}%`),
        ilike(universities.city, `%${search}%`)
      )!
    );
  }

  let results;
  if (conditions.length > 0) {
    results = await query.where(conditions.length === 1 ? conditions[0] : conditions[0]);
  } else {
    results = await query;
  }

  res.json(results);
});

router.get("/universities/:id", async (req, res) => {
  const id = Number(req.params.id);
  const [uni] = await db
    .select()
    .from(universities)
    .where(eq(universities.id, id));

  if (!uni) {
    res.status(404).json({ error: "University not found" });
    return;
  }

  const progs = await db
    .select()
    .from(programs)
    .where(eq(programs.universityId, id));

  res.json({
    ...uni,
    programs: progs.map((p) => ({
      ...p,
      universityName: uni.name,
    })),
  });
});

router.get("/programs", async (req, res) => {
  const { universityId, degree } = req.query as {
    universityId?: string;
    degree?: string;
  };

  const allPrograms = await db.select({
    id: programs.id,
    universityId: programs.universityId,
    universityName: universities.name,
    name: programs.name,
    degree: programs.degree,
    duration: programs.duration,
    language: programs.language,
    tuitionPerYear: programs.tuitionPerYear,
    applicationDeadline: programs.applicationDeadline,
    requirements: programs.requirements,
    ieltsMin: programs.ieltsMin,
    toeflMin: programs.toeflMin,
  })
  .from(programs)
  .innerJoin(universities, eq(programs.universityId, universities.id));

  let filtered = allPrograms;
  if (universityId) {
    filtered = filtered.filter((p) => p.universityId === Number(universityId));
  }
  if (degree) {
    filtered = filtered.filter((p) =>
      p.degree.toLowerCase().includes(degree.toLowerCase())
    );
  }

  res.json(filtered);
});

router.get("/visa-requirements", async (req, res) => {
  const { country, visaType } = req.query as {
    country?: string;
    visaType?: string;
  };

  const all = await db.select().from(visaRequirements);

  let filtered = all;
  if (country) {
    filtered = filtered.filter((v) =>
      v.country.toLowerCase().includes(country.toLowerCase())
    );
  }
  if (visaType) {
    filtered = filtered.filter((v) =>
      v.visaType.toLowerCase().includes(visaType.toLowerCase())
    );
  }

  res.json(filtered);
});

export default router;
