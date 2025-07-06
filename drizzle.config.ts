import env from "@/lib/env";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./server/db/migration",
  schema: "./app/_db/email-schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
});
