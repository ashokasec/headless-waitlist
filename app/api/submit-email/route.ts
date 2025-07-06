import db from "@/app/_db/db";
import { emailSchema, emailTable } from "@/app/_db/email-schema";
import { WaitlistSignupEmail } from "@/emails/waitlist-signup-template";
import env from "@/lib/env";
import { seo } from "@/lib/seo";
import arcjet, { protectSignup, shield } from "@arcjet/next";
import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(env.RESEND_API_KEY);

const aj = arcjet({
  key: env.ARCJET_KEY,
  characteristics: ["ip.src"],
  rules: [
    shield({ mode: "LIVE" }),
    protectSignup({
      email: {
        mode: "LIVE",
        block: ["DISPOSABLE", "INVALID", "NO_MX_RECORDS"],
      },
      bots: {
        mode: "LIVE",
        allow: [],
      },
      rateLimit: {
        mode: "LIVE",
        interval: "10m",
        max: 5,
      },
    }),
  ],
});

export async function POST(req: Request) {
  let email: string;
  try {
    const body = await req.json();
    const parsed = emailSchema.parse(body);
    email = parsed.email;
  } catch (error) {
    return NextResponse.json(
      { message: "Invalid email format." },
      { status: 400 },
    );
  }

  const decision = await aj.protect(req, { email });

  if (decision.isDenied()) {
    const message = decision.reason.isEmail()
      ? "Invalid or Disposable email"
      : "Request blocked";
    return NextResponse.json(
      { message },
      { status: decision.reason.isEmail() ? 400 : 403 },
    );
  }

  try {
    let isNew = false;

    try {
      await db.insert(emailTable).values({ email });
      isNew = true;
    } catch (error) {
      if (!isUniqueViolation(error)) {
        return NextResponse.json({ message: "Request processed successfully" });
      }
    }

    if (isNew) {
      await resend.emails.send({
        from: `${seo.name} <onboarding@mail.comics.sh>`,
        to: email,
        subject: `You're on the waitlist!`,
        html: WaitlistSignupEmail,
      });
    }

    return NextResponse.json({ message: "Request processed successfully" });
  } catch (error) {
    console.error("Signup failed:", error);
    return NextResponse.json(
      { message: "Could not process request" },
      { status: 500 },
    );
  }
}

function isUniqueViolation(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "23505"
  );
}
