import { boolean, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { createTable } from "@/server/create-table";

export const emailTable = createTable("email", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  email: text("email").notNull(),
  verifiedAt: boolean("completed").default(false).notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

export type EMAIL = typeof emailTable.$inferSelect;
