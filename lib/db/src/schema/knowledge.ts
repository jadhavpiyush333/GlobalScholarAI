import { pgTable, serial, text, integer, real, timestamp } from "drizzle-orm/pg-core";
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
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
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
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const insertUniversitySchema = createInsertSchema(universities).omit({ id: true, createdAt: true });
export const insertProgramSchema = createInsertSchema(programs).omit({ id: true, createdAt: true });
export const insertVisaRequirementSchema = createInsertSchema(visaRequirements).omit({ id: true, createdAt: true });

export type University = typeof universities.$inferSelect;
export type Program = typeof programs.$inferSelect;
export type VisaRequirement = typeof visaRequirements.$inferSelect;
export type InsertUniversity = z.infer<typeof insertUniversitySchema>;
export type InsertProgram = z.infer<typeof insertProgramSchema>;
export type InsertVisaRequirement = z.infer<typeof insertVisaRequirementSchema>;
