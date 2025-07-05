"use client";

import React, {
  useState,
  type FormEvent,
  type ChangeEvent,
  type JSX,
  useEffect,
} from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import toast, { Toaster } from "react-hot-toast";
import { geistSans } from "@/lib/fonts";

interface FormData {
  email: string;
}

interface ApiResponse {
  message: string;
}

const LOCAL_STORAGE_KEY = "waitlist_email";

export default function EmailForm(): JSX.Element {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({
    email: "",
  });
  const [alreadySubmitted, setAlreadySubmitted] = useState<boolean>(false);
  const [savedEmail, setSavedEmail] = useState<string>("");

  // Check localStorage on component mount
  useEffect(() => {
    // Only run in browser environment
    if (typeof window !== "undefined") {
      const storedEmail = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedEmail) {
        setSavedEmail(storedEmail);
        setAlreadySubmitted(true);
      }
    }
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  async function onSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/submit-email", {
        method: "POST",
        body: JSON.stringify({ email: formData.email }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data: ApiResponse = await response.json();

      if (!response.ok) {
        if (response.status === 400) {
          toast.error(data.message || "Invalid or Disposable Email.");
          return;
        }
        if (response.status === 403) {
          toast.error("Too many requests. Please try again later.");
          return;
        }
        toast.error("Something went wrong. Please try again.");
        return;
      }

      // Save to localStorage after successful submission
      localStorage.setItem(LOCAL_STORAGE_KEY, formData.email);
      setSavedEmail(formData.email);
      setAlreadySubmitted(true);

      setFormData({ email: "" });
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleReset = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    setSavedEmail("");
    setAlreadySubmitted(false);
  };

  return (
    <div className="w-full max-w-xl mx-auto px-3 mt-10">
      <Toaster />
      {alreadySubmitted ? (
        <div className="mt-4 text-center">
          <p className="mb-2 text-neutral-800 text-[15px] sm:text-base md:text-lg">
            You&apos;ve joined our waitlist with{" "}
            <strong
              className="text-green-700 font-medium underline decoration-0 underline-offset-4"
              style={geistSans.style}
            >
              {savedEmail}
            </strong>
          </p>
          <Button
            size="sm"
            onClick={handleReset}
            className="mt-2 text-white !bg-green-600 hover:!bg-green-500"
          >
            Join with a different email
          </Button>
        </div>
      ) : (
        <form
          onSubmit={onSubmit}
          className="mt-4 flex flex-col sm:items-center gap-2 sm:gap-4 w-full"
        >
          <Input
            className="w-full !text-base text-black focus-visible:ring-green-500 px-6 py-6 bg-white/5 border-2 border-green-500/80 rounded-xl focus:outline-none focus:border-transparent transition-all placeholder:text-gray-500 disabled:opacity-70"
            placeholder="you@example.com"
            type="email"
            value={formData.email}
            onChange={handleChange}
            name="email"
            id="email"
            spellCheck={false}
            disabled={isLoading}
            style={geistSans.style}
            required
          />
          <Button
            type="submit"
            size="lg"
            className="w-full text-white bg-gradient-to-r from-green-500 to-green-600 px-8 py-6 text-[15px] rounded-xl font-medium hover:from-green-600 hover:to-green-700 transition-all flex items-center justify-center space-x-3 shadow-lg shadow-green-500/20 disabled:opacity-90 !mt-2"
            disabled={isLoading || !formData.email.trim()}
          >
            {isLoading ? "Joining..." : "Join Waitlist"}
          </Button>
        </form>
      )}
    </div>
  );
}
