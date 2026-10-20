"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, ShieldCheck } from "lucide-react";

interface HeroProps {
  onOpenDemo: (title: string, subtitle: string) => void;
  onScrollToFeatures: () => void;
}

export function Hero({ onScrollToFeatures }: HeroProps) {
  return (
    <section className="relative pt-12 pb-14 md:pt-16 md:pb-16 flex flex-col items-center text-center px-4 max-w-[1280px] mx-auto overflow-hidden">
      {/* Product Tag */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-100 border border-neutral-200/80 text-xs font-medium text-neutral-800 mb-6 animate-in fade-in duration-300">
        <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
        <span>Grounded AI Tutor & Active Recall Platform</span>
      </div>

      {/* Main Headline */}
      <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[70px] font-semibold text-neutral-900 tracking-[-0.035em] leading-[1.08] max-w-4xl mx-auto mb-6">
        An AI tutor made for you
      </h1>

      {/* Supporting Subtitle */}
      <p className="text-base sm:text-lg md:text-[20px] text-neutral-500 font-normal leading-relaxed max-w-2xl mx-auto mb-7 sm:mb-8">
        Turns your learning materials into notes, interactive chats, quizzes, and more
      </p>

      {/* CTA Buttons */}
      <div className="flex items-center justify-center gap-3 mb-9 w-full sm:w-auto">
        <a
          href="#closing-cta"
          onClick={(e) => {
            const el = document.getElementById("closing-cta") || document.getElementById("features");
            if (el) {
              e.preventDefault();
              el.scrollIntoView({ behavior: "smooth" });
            } else {
              onScrollToFeatures();
            }
          }}
          className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-white hover:bg-neutral-50 border border-neutral-200 text-neutral-800 font-medium text-sm transition-all active:scale-[0.98] shadow-2xs whitespace-nowrap cursor-pointer"
        >
          Get the app
        </a>

        <Link
          href="/app"
          className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-black hover:bg-neutral-800 text-white font-medium text-sm transition-all active:scale-[0.98] shadow-xs whitespace-nowrap cursor-pointer"
        >
          Start Learning
        </Link>
      </div>

      {/* Honest Value Props */}
      <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-neutral-500 select-none">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Page-cited grounded answers</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-neutral-300"></span>
          <span>Free tier with 20 daily AI questions</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-neutral-300"></span>
          <span>No credit card required</span>
        </div>
      </div>
    </section>
  );
}
