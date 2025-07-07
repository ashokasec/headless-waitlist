import arcjet, { createMiddleware, detectBot } from "@arcjet/next";
import env from "./lib/env";

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

const aj = arcjet({
  key: env.ARCJET_KEY,
  rules: [
    detectBot({
      mode: "LIVE",
      allow: [
        "CATEGORY:SEARCH_ENGINE", // Google, Bing, etc
        "CATEGORY:PREVIEW", // Link previews e.g. Slack, Discord
        // See the full list at https://arcjet.com/bot-list
      ],
    }),
  ],
});

export default createMiddleware(aj);
