import { EMAIL_VERIFICATION } from "@/lib/constants";
import { notFound } from "next/navigation";
import React from "react";

const Page = async ({
  searchParams,
}: { searchParams: Promise<{ email?: string }> }) => {
  if (!EMAIL_VERIFICATION) return notFound();

  const email = (await searchParams).email?.trim();

  if (!email) return notFound();

  return (
    <div className="text-center mt-20">
      Your email <strong>{email}</strong> has been successfully verified.
    </div>
  );
};

export default Page;
