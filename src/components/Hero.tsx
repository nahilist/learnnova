"use client";

import React from "react";
import Link from "next/link";
import { Star, Smartphone } from "lucide-react";
import { YCBadgeIcon } from "./Icons";

interface HeroProps {
  onOpenDemo?: (title: string, subtitle: string) => void;
  onScrollToFeatures: () => void;
}

export function Hero({ onScrollToFeatures }: HeroProps) {
  return (
    <section className="relative pt-8 pb-6 md:pt-14 md:pb-8 flex flex-col items-center text-center px-4 max-w-[1280px] mx-auto overflow-visible select-none">
      {/* Subtle top ambient glow matching YouLearn.ai */}
      <div
        className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 w-[980px] max-w-[95vw] h-[480px] -z-10 select-none overflow-hidden"
        aria-hidden="true"
      >
        <div className="w-full h-full bg-[radial-gradient(ellipse_at_top,_rgba(147,197,253,0.32)_0%,_rgba(191,219,254,0.18)_40%,_transparent_72%)] blur-2xl" />
      </div>

      {/* 1. Backed by Y Combinator Badge */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 border border-neutral-200/90 text-neutral-800 text-[13px] font-medium mb-5 sm:mb-6 shadow-2xs backdrop-blur-xs hover:border-neutral-300 transition-colors">
        <YCBadgeIcon className="w-4 h-4 rounded-[3px]" />
        <span>Backed by <strong className="font-semibold text-neutral-900">Y Combinator</strong></span>
      </div>

      {/* 2. Main Headline */}
      <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[66px] font-semibold text-[#111111] tracking-[-0.03em] leading-[1.1] max-w-4xl mx-auto mb-4 sm:mb-5">
        An AI tutor made for you
      </h1>

      {/* 3. Supporting Subtitle */}
      <p className="text-base sm:text-lg md:text-[19px] text-neutral-500 font-normal leading-relaxed max-w-2xl mx-auto mb-7 sm:mb-8">
        Turns your learning materials into notes, interactive chats, quizzes, and more
      </p>

      {/* 4. CTA Buttons */}
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

      {/* 5. Social Proof / Community Rating */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-xs sm:text-sm text-neutral-600">
        <div className="flex -space-x-2">
          <img
            src="/avatars/mihir.webp"
            alt="Learner"
            className="w-7 h-7 rounded-full border-2 border-white object-cover"
          />
          <img
            src="/avatars/g-shaw.webp"
            alt="Learner"
            className="w-7 h-7 rounded-full border-2 border-white object-cover"
          />
          <img
            src="/avatars/nasim.webp"
            alt="Learner"
            className="w-7 h-7 rounded-full border-2 border-white object-cover"
          />
          <img
            src="/avatars/kate.webp"
            alt="Learner"
            className="w-7 h-7 rounded-full border-2 border-white object-cover"
          />
        </div>

        <div className="flex items-center gap-1.5">
          <div className="flex text-amber-400">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            ))}
          </div>
          <span className="font-semibold text-neutral-900">Loved by 2,000,000+ learners</span>
        </div>

        <span className="hidden sm:inline text-neutral-300">•</span>

        <Link
          href="/app"
          className="inline-flex items-center gap-1 text-neutral-500 hover:text-neutral-900 transition-colors font-medium cursor-pointer"
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>Get the app</span>
        </Link>
      </div>
    </section>
  );
}
