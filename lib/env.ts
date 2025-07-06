import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

const env = createEnv({
  server: {
    NODE_ENV: z.enum(["development", "production", "test"]),
    DATABASE_URL: z.string().url().min(1, "DATABASE_URL is required"),
    ARCJET_KEY: z.string().min(1, "ARCJET_KEY is required"),
    RESEND_API_KEY: z.string().min(1, "RESEND_API_KEY is required"),
  },
  client: {
    NEXT_PUBLIC_APP_URL: z.string().min(1),
  },
  runtimeEnv: {
    // Server Side
    NODE_ENV: process.env.NODE_ENV,
    DATABASE_URL: process.env.DATABASE_URL,
    ARCJET_KEY: process.env.ARCJET_KEY,
    RESEND_API_KEY: process.env.RESEND_API_KEY,

    // Client Accessible
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  },
});

export default env;
