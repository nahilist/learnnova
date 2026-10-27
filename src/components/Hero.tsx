"use client";

import React from "react";
import Link from "next/link";
interface HeroProps {
  onOpenDemo: (title: string, subtitle: string) => void;
  onScrollToFeatures: () => void;
}

export function Hero({ onScrollToFeatures }: HeroProps) {
  return (
    <section className="relative pt-10 pb-6 md:pt-16 md:pb-8 flex flex-col items-center text-center px-4 max-w-[1280px] mx-auto overflow-visible">
      {/* Subtle top ambient glow matching YouLearn.ai */}
      <div
        className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 w-[980px] max-w-[95vw] h-[480px] -z-10 select-none overflow-hidden"
        aria-hidden="true"
      >
        <div className="w-full h-full bg-[radial-gradient(ellipse_at_top,_rgba(147,197,253,0.32)_0%,_rgba(191,219,254,0.18)_40%,_transparent_72%)] blur-2xl" />
      </div>

      {/* Main Headline */}
      <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[64px] font-semibold text-[#111111] tracking-[-0.02em] leading-[1.12] max-w-4xl mx-auto mb-5 sm:mb-6">
        An AI tutor made for you
      </h1>

      {/* Supporting Subtitle */}
      <p className="text-base sm:text-lg md:text-[19px] text-neutral-500 font-normal leading-relaxed max-w-2xl mx-auto mb-7 sm:mb-8">
        Turns your learning materials into notes, interactive chats, quizzes, and more
      </p>

      {/* CTA Buttons */}
      <div className="flex items-center justify-center gap-3.5 w-full sm:w-auto">
        <button
          onClick={onScrollToFeatures}
          className="inline-flex items-center justify-center px-6 py-2.5 sm:py-3 rounded-full bg-white hover:bg-neutral-50 border border-neutral-200 text-neutral-900 font-medium text-[15px] transition-all active:scale-[0.98] shadow-2xs whitespace-nowrap cursor-pointer"
        >
          See features
        </button>

        <Link
          href="/app"
          className="inline-flex items-center justify-center px-6 py-2.5 sm:py-3 rounded-full bg-black hover:bg-neutral-800 text-white font-medium text-[15px] transition-all active:scale-[0.98] shadow-xs whitespace-nowrap cursor-pointer"
        >
          Start Learning
        </Link>
      </div>
    </section>
  );
}
