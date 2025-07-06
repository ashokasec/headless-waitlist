"use client";

import { emailSchema } from "@/app/_db/email-schema";
import { geistSans } from "@/lib/fonts";
import { type FormEvent, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

const LOCAL_STORAGE_KEY = "waitlist_email";

export default function EmailForm() {
  const [email, setEmail] = useState("");
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) setSubmittedEmail(stored);
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const validation = emailSchema.safeParse({ email: "ashoka@gmail.com" });
    console.log(validation);
    if (!validation.success) {
      toast.error(validation.error.issues[0]?.message || "Invalid email");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/submit-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 400) {
          toast.error(data.message || "Invalid email.");
        } else if (res.status === 403) {
          toast.error("Too many requests. Try later.");
        } else {
          toast.error("Something went wrong. Please retry.");
        }
        return;
      }

      localStorage.setItem(LOCAL_STORAGE_KEY, email);
      setSubmittedEmail(email);
      setEmail("");
    } catch (err) {
      console.error(err);
      toast.error("Unexpected error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    setSubmittedEmail(null);
  };

  return (
    <>
      <Toaster />
      <div className="w-full max-w-md mx-auto mt-12 px-4 text-center">
        {submittedEmail ? (
          <div className="space-y-3">
            <p className="text-neutral-800 text-base sm:text-lg">
              You&apos;re on the waitlist with{" "}
              <span
                className="font-semibold text-green-700 underline underline-offset-4"
                style={geistSans.style}
              >
                {submittedEmail}
              </span>
            </p>
            <Button
              size="sm"
              onClick={handleReset}
              className="bg-green-600 hover:bg-green-500 text-white"
            >
              Use a different email
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
              className="text-base"
              style={geistSans.style}
            />
            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={loading || !email.trim()}
            >
              {loading ? "Joining..." : "Join Waitlist"}
            </Button>
          </form>
        )}
      </div>
    </>
  );
}
