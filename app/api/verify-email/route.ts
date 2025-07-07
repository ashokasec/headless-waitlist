import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import env from "@/lib/env";

export const GET = async (req: Request) => {
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
