import { Router, type IRouter } from "express";
import { eq, ilike, or, and } from "drizzle-orm";
import { db, universities, programs, visaRequirements, universityContacts } from "@workspace/db";

const router: IRouter = Router();

router.get("/universities", async (req, res) => {
  const { country, search, field } = req.query as { country?: string; search?: string; field?: string };

  let allUnis = await db.select().from(universities);

  if (country) {
    allUnis = allUnis.filter((u) => u.country.toLowerCase().includes(country.toLowerCase()));
  }
  if (search) {
    allUnis = allUnis.filter(
      (u) =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.city.toLowerCase().includes(search.toLowerCase()) ||
        (u.description?.toLowerCase().includes(search.toLowerCase()) ?? false)
    );
  }
  if (field) {
    allUnis = allUnis.filter(
      (u) => u.fields?.toLowerCase().includes(field.toLowerCase()) ?? false
    );
  }

  res.json(allUnis);
});

router.get("/universities/:id", async (req, res) => {
  const id = Number(req.params.id);
  const [uni] = await db.select().from(universities).where(eq(universities.id, id));

  if (!uni) {
    res.status(404).json({ error: "University not found" });
    return;
  }

  const [contact] = await db
    .select()
    .from(universityContacts)
    .where(eq(universityContacts.universityId, id));

  const progs = await db.select().from(programs).where(eq(programs.universityId, id));

  res.json({
    ...uni,
    contact: contact ?? null,
    programs: progs.map((p) => ({ ...p, universityName: uni.name })),
    financialServices: uni.financialServices ?? null,
  });
});

router.get("/programs", async (req, res) => {
  const { universityId, degree, field } = req.query as {
    universityId?: string;
    degree?: string;
    field?: string;
  };

  const allPrograms = await db
    .select({
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
      fieldSlug: programs.fieldSlug,
    })
    .from(programs)
    .innerJoin(universities, eq(programs.universityId, universities.id));

  let filtered = allPrograms;
  if (universityId) filtered = filtered.filter((p) => p.universityId === Number(universityId));
  if (degree) filtered = filtered.filter((p) => p.degree.toLowerCase().includes(degree.toLowerCase()));
  if (field) filtered = filtered.filter((p) => (p.fieldSlug ?? "").toLowerCase().includes(field.toLowerCase()) || p.name.toLowerCase().includes(field.toLowerCase()));

  res.json(filtered);
});

router.get("/visa-requirements", async (req, res) => {
  const { country, visaType } = req.query as { country?: string; visaType?: string };

  let all = await db.select().from(visaRequirements);

  if (country) all = all.filter((v) => v.country.toLowerCase().includes(country.toLowerCase()));
  if (visaType) all = all.filter((v) => v.visaType.toLowerCase().includes(visaType.toLowerCase()));

  res.json(all);
});

export default router;
