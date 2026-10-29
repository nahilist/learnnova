"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ClosingCta } from "@/components/ClosingCta";

export default function CareersPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
    }
  };

  return (
    <div className="min-h-screen bg-white text-neutral-900 flex flex-col font-sans selection:bg-neutral-900 selection:text-white">
      {/* Top Navbar */}
      <Navbar onOpenDemo={() => {}} />

      {/* Main Hero: Coming Soon */}
      <main className="flex-1 w-full bg-white flex flex-col justify-center items-center">
        <section className="w-full max-w-[800px] mx-auto px-6 pt-20 sm:pt-28 pb-16 text-center flex flex-col items-center">
          {/* Subtle Status Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-100 text-[13px] font-medium text-neutral-600 mb-6 select-none">
            <span className="w-2 h-2 rounded-full bg-neutral-900 animate-pulse" />
            <span>Careers • Coming Soon</span>
          </div>

          {/* Headline */}
          <h1 className="text-[36px] sm:text-[48px] lg:text-[56px] font-medium tracking-[-1.5px] sm:tracking-[-2.5px] leading-[1.15] text-[#121212] max-w-[620px]">
            We&apos;re expanding our team soon.
          </h1>

          {/* Subtitle */}
          <p className="text-[16px] sm:text-[18px] text-[#737373] font-normal mt-4 max-w-[500px] leading-relaxed">
            We&apos;re building the next generation of AI-native study tools for over 1.5 million students. Full-time and remote roles across engineering, product, and design will open soon.
          </p>

          {/* Notification Form / Confirmation */}
          <div className="mt-8 sm:mt-10 w-full max-w-[440px]">
            {submitted ? (
              <div className="py-4 px-6 rounded-2xl bg-neutral-50 border border-neutral-200/80 text-sm text-neutral-800 transition-all animate-in fade-in duration-200">
                <p className="font-medium text-neutral-900">Thank you for your interest!</p>
                <p className="text-neutral-500 text-xs mt-1">
                  We&apos;ve noted your email ({email}) and will reach out as soon as applications open.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-2.5">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email to get notified"
                  required
                  className="w-full px-5 py-3 rounded-full border border-neutral-200 bg-neutral-50/70 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white transition-all placeholder:text-neutral-400"
                />
                <button
                  type="submit"
                  className="w-full sm:w-auto shrink-0 px-6 py-3 rounded-full bg-neutral-950 hover:bg-neutral-800 text-white font-medium text-sm transition-all duration-150 cursor-pointer shadow-xs active:scale-[0.98]"
                >
                  Notify Me
                </button>
              </form>
            )}
          </div>
        </section>

        {/* Closing CTA */}
        <ClosingCta />
      </main>

      {/* Footer */}
      <Footer onOpenDemo={() => {}} />
    </div>
  );
}
