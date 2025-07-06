import env from "@/lib/env";
import * as schema from "@/server/db/schema";
import { drizzle } from "drizzle-orm/postgres-js";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";

// ✅ NEW: declare globals to persist across hot reloads in development
declare global {
  var drizzleDb: PostgresJsDatabase<typeof schema> | undefined;
  var pgClient: ReturnType<typeof postgres> | undefined;
}

const connectionString = env.DATABASE_URL;

let db: PostgresJsDatabase<typeof schema>;

// Only for production we want to use SSL connection
if (env.NODE_ENV === "production") {
  const pgClient = postgres(connectionString, { prepare: false });
  db = drizzle(pgClient, { schema });
} else {
  // 💡 Development: reuse client and db to avoid hot-reload leaks

  // ✅ Create and memoize the postgres client only once
  if (!global.pgClient) {
    global.pgClient = postgres(connectionString, {
      prepare: false,
      max: 1, // 🧼 important: limit to 1 connection in dev
    });
  }

  // ✅ Create and memoize drizzle instance
  if (!global.drizzleDb) {
    global.drizzleDb = drizzle(global.pgClient, { schema });
  }

  db = global.drizzleDb;
}

export default db;
