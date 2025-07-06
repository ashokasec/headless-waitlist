import env from "@/lib/env";

// TODO: 1. Change the values according to your app.

const name = "Headless Waitlist";

export const seo = {
  title: `Join the Waitlist – ${name}`,
  name,
  description: `Be the first to experience ${name} — a revolutionary tool that changes the game.`,
  url: env.NEXT_PUBLIC_APP_URL,
  ogImage: "https://yourdomain.com/og.png",
  keywords: "waitlist, product, launch, early access, signup",
  twitter: {
    handle: "@yourhandle",
    site: "@yourhandle",
    cardType: "summary_large_image",
  },
};
