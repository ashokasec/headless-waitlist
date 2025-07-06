import { sql } from "drizzle-orm";
import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import z from "zod";

export const emailTable = pgTable("email", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  email: text("email").notNull().unique(),
  verifiedAt: timestamp("verified_at", { mode: "date" }).default(sql`NULL`),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

export type EMAIL = typeof emailTable.$inferSelect;

export const emailSchema = z.object({
  email: z
    .string()
    .min(5)
    .max(254)
    .refine(
      (val) => {
        // Basic email structure check
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(val)) return false;

        const [local, domain] = val.split("@");

        if (!local || !domain) return false;

        // Block aliasing via "+"
        if (local.includes("+")) return false;

        // Block double dots in local or domain
        if (local.includes("..") || domain.includes("..")) return false;

        // Local part must not start or end with "."
        if (local.startsWith(".") || local.endsWith(".")) return false;

        // Domain must have at least one dot (e.g., gmail.com)
        if (!domain.includes(".")) return false;

        // Domain TLD must be at least 2 chars
        const domainParts = domain.split(".");
        const tld = domainParts[domainParts.length - 1];
        if (tld.length < 2) return false;

        return true;
      },
      {
        message: "Invalid email format or aliasing not allowed",
      },
    ),
});
