import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import env from "@/lib/env";
import { EMAIL_VERIFICATION } from "@/lib/constants";
import { notFound } from "next/navigation";
import db from "@/app/_db/db";
import { emailTable } from "@/app/_db/email-schema";
import { eq } from "drizzle-orm";

export const GET = async (req: Request) => {
  if (!EMAIL_VERIFICATION) {
    return notFound();
  }

  const url = new URL(req.url);
  const token = url.searchParams.get("token");

  if (!token || token.trim() === "") {
    return NextResponse.json(
      { message: "Invalid verification link." },
      { status: 400 },
    );
  }

  try {
    // biome-ignore lint/style/noNonNullAssertion: verified statically
    const result = jwt.verify(token, env.JWT_SECRET!) as { email: string };
    await db
      .update(emailTable)
      .set({ verifiedAt: new Date() })
      .where(eq(emailTable.email, result.email));
    return NextResponse.redirect(
      `${env.NEXT_PUBLIC_APP_URL}/email-verified?email=${result.email}`,
    );
  } catch (err) {
    return NextResponse.json(
      { message: "Invalid or expired token." },
      { status: 401 },
    );
  }
};
