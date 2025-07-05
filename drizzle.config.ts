import { defineConfig } from "drizzle-kit";
import env from "@/lib/env";

export default defineConfig({
  out: "./server/db/migration",
  schema: "./server/db/schema/index.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
});
