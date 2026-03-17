import { pgTable, serial, text, integer, real, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const universities = pgTable("universities", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  country: text("country").notNull(),
  city: text("city").notNull(),
  website: text("website"),
  description: text("description"),
  ranking: integer("ranking"),
  fields: text("fields"),
  scholarshipsAvailable: boolean("scholarships_available").default(false),
  financialServices: text("financial_services"),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const universityContacts = pgTable("university_contacts", {
  id: serial("id").primaryKey(),
  universityId: integer("university_id").references(() => universities.id).notNull(),
  admissionsEmail: text("admissions_email"),
  admissionsPhone: text("admissions_phone"),
  internationalOfficeEmail: text("international_office_email"),
  internationalOfficePhone: text("international_office_phone"),
  address: text("address"),
  visaCounselorEmail: text("visa_counselor_email"),
  visaCounselorPhone: text("visa_counselor_phone"),
  financialAidEmail: text("financial_aid_email"),
  financialAidPhone: text("financial_aid_phone"),
});

export const programs = pgTable("programs", {
  id: serial("id").primaryKey(),
  universityId: integer("university_id").references(() => universities.id).notNull(),
  name: text("name").notNull(),
  degree: text("degree").notNull(),
  duration: text("duration").notNull(),
  language: text("language").notNull().default("English"),
  tuitionPerYear: text("tuition_per_year"),
  applicationDeadline: text("application_deadline"),
  requirements: text("requirements"),
  ieltsMin: real("ielts_min"),
  toeflMin: real("toefl_min"),
  fieldSlug: text("field_slug"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const visaRequirements = pgTable("visa_requirements", {
  id: serial("id").primaryKey(),
  country: text("country").notNull(),
  visaType: text("visa_type").notNull(),
  requirements: text("requirements").notNull(),
  processingTime: text("processing_time"),
  fees: text("fees"),
  proofOfFunds: text("proof_of_funds"),
  notes: text("notes"),
  visaCounselorTips: text("visa_counselor_tips"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const fieldInsights = pgTable("field_insights", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  futureScope: text("future_scope").notNull(),
  globalCompetition: text("global_competition").notNull(),
  competitionLevel: text("competition_level").notNull(),
  avgStartingSalaryUSD: text("avg_starting_salary_usd"),
  topCountriesForJobs: text("top_countries_for_jobs"),
  growthRate: text("growth_rate"),
  topSkillsRequired: text("top_skills_required"),
  industryTrends: text("industry_trends"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const fieldJobOpportunities = pgTable("field_job_opportunities", {
  id: serial("id").primaryKey(),
  fieldId: integer("field_id").references(() => fieldInsights.id).notNull(),
  title: text("title").notNull(),
  avgSalaryUSD: text("avg_salary_usd").notNull(),
  demandLevel: text("demand_level").notNull(),
  topHiringCountries: text("top_hiring_countries").notNull(),
});

export const insertUniversitySchema = createInsertSchema(universities).omit({ id: true, createdAt: true });
export const insertUniversityContactSchema = createInsertSchema(universityContacts).omit({ id: true });
export const insertProgramSchema = createInsertSchema(programs).omit({ id: true, createdAt: true });
export const insertVisaRequirementSchema = createInsertSchema(visaRequirements).omit({ id: true, createdAt: true });
export const insertFieldInsightSchema = createInsertSchema(fieldInsights).omit({ id: true, createdAt: true });

export type University = typeof universities.$inferSelect;
export type UniversityContact = typeof universityContacts.$inferSelect;
export type Program = typeof programs.$inferSelect;
export type VisaRequirement = typeof visaRequirements.$inferSelect;
export type FieldInsight = typeof fieldInsights.$inferSelect;
export type FieldJobOpportunity = typeof fieldJobOpportunities.$inferSelect;
export type InsertUniversity = z.infer<typeof insertUniversitySchema>;
export type InsertProgram = z.infer<typeof insertProgramSchema>;
export type InsertVisaRequirement = z.infer<typeof insertVisaRequirementSchema>;
