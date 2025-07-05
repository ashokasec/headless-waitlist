import arcjet, { protectSignup, shield } from "@arcjet/next";
import { NextResponse } from "next/server";
import { emailTable } from "@/server/db/schema/email";
import db from "@/server/db";
import { eq } from "drizzle-orm";
import env from "@/lib/env";
import { Resend } from "resend";
import { seo } from "@/lib/config/seo";
import { WaitlistSignupEmail } from "@/emails/waitlist-signup";

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
  const { email } = await req.json();

  const decision = await aj.protect(req, {
    email,
  });

  if (decision.isDenied()) {
    if (decision.reason.isEmail()) {
      return NextResponse.json(
        {
          message: "Invalid or Disposable email",
        },
        { status: 400 },
      );
    }
    // Return a generic forbidden response
    return NextResponse.json({ message: "Request blocked" }, { status: 403 });
  }
  try {
    const [existingEmail] = await db
      .select()
      .from(emailTable)
      .where(eq(emailTable.email, email))
      .limit(1);

    if (!existingEmail) {
      await db.insert(emailTable).values({ email });

      await resend.emails.send({
        from: `${seo.name} <onboarding@mail.comics.sh>`,
        to: email,
        subject: `You're on the waitlist! - ${seo.name}`,
        html: WaitlistSignupEmail,
      });
    }

    return NextResponse.json({
      message: "Request processed successfully",
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Could not process request" },
      { status: 500 },
    );
  }
}
