import { EMAIL_VERIFICATION } from "@/lib/constants";
import { notFound } from "next/navigation";
import React from "react";
import { emailSchema } from "../_db/email-schema";

const Page = async ({
  searchParams,
}: { searchParams: Promise<{ email?: string }> }) => {
  if (!EMAIL_VERIFICATION) return notFound();
  const params = await searchParams;

  const result = emailSchema.safeParse(params);
  if (!result.success) return notFound();

  const email = result.data.email.trim();
  if (!email) return notFound();

  return (
    <div className="text-center mt-20">
      Your email <strong>{email}</strong> has been successfully verified.
    </div>
  );
};

export default Page;
