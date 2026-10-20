"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export interface ClosingCtaProps {
  onOpenDemo?: (title: string, subtitle: string) => void;
}

export function ClosingCta(props?: ClosingCtaProps) {
  void props;
  return (
    <section className="w-full max-w-[1240px] mx-auto px-4 sm:px-6 pb-20">
      <div className="w-full bg-[#f8f9fa] rounded-3xl sm:rounded-[40px] border border-neutral-200/90 py-16 sm:py-24 px-6 text-center shadow-xs">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-neutral-200 text-xs font-semibold text-neutral-800 mb-6 shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>Start studying in seconds</span>
        </div>

        {/* Headline */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-semibold text-neutral-900 tracking-[-0.035em] mb-4">
          Learn smarter, retain more, test better.
        </h2>

        {/* Subtitle */}
        <p className="text-base sm:text-lg md:text-[20px] text-neutral-600 font-normal mb-8 max-w-xl mx-auto leading-relaxed">
          Upload any lecture PDF or video to start source-grounded tutoring with instant flashcards and exams.
        </p>

        {/* Primary CTA */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/app"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-neutral-950 hover:bg-neutral-800 text-white font-semibold text-[15px] transition-all active:scale-[0.98] shadow-sm cursor-pointer"
          >
            <span>Launch LearnNova Free</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/signin"
            className="inline-flex items-center px-7 py-3.5 rounded-full bg-white hover:bg-neutral-100 border border-neutral-200 text-neutral-900 font-medium text-[15px] transition-all active:scale-[0.98] shadow-2xs cursor-pointer"
          >
            Sign In to Account
          </Link>
        </div>
      </div>
    </section>
  );
}
