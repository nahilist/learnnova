"use client";

import React from "react";
import Link from "next/link";
import { YCBadgeIcon } from "./Icons";

interface HeroProps {
  onOpenDemo: (title: string, subtitle: string) => void;
  onScrollToFeatures: () => void;
}

export function Hero({ onScrollToFeatures }: HeroProps) {
  return (
    <section className="relative pt-10 pb-6 md:pt-16 md:pb-8 flex flex-col items-center text-center px-4 max-w-[1280px] mx-auto overflow-hidden">
      {/* Y Combinator Badge */}
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-neutral-200/90 text-xs font-medium text-neutral-600 shadow-[0_1px_2px_rgba(0,0,0,0.04)] mb-7 animate-in fade-in duration-300">
        <YCBadgeIcon className="w-4 h-4" />
        <span>Backed by Y Combinator</span>
      </div>

      {/* Main Headline */}
      <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[72px] font-semibold text-neutral-900 tracking-[-0.035em] leading-[1.08] max-w-4xl mx-auto mb-5 sm:mb-6">
        An AI tutor made for you
      </h1>

      {/* Supporting Subtitle */}
      <p className="text-base sm:text-lg md:text-[19px] text-neutral-500 font-normal leading-relaxed max-w-2xl mx-auto mb-7 sm:mb-8">
        Turns your learning materials into notes, interactive chats, quizzes, and more
      </p>

      {/* CTA Buttons */}
      <div className="flex items-center justify-center gap-3.5 mb-7 w-full sm:w-auto">
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

      {/* Social Proof / 2M+ Learners */}
      <div className="inline-flex items-center justify-center gap-2.5 text-neutral-500 text-sm">
        <div className="flex -space-x-1.5 items-center">
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white ring-2 ring-white shrink-0 select-none"
            style={{ backgroundColor: "#3B82F6" }}
          >
            A
          </div>
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white ring-2 ring-white shrink-0 select-none"
            style={{ backgroundColor: "#EA580C" }}
          >
            R
          </div>
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white ring-2 ring-white shrink-0 select-none"
            style={{ backgroundColor: "#111827" }}
          >
            Z
          </div>
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white ring-2 ring-white shrink-0 select-none"
            style={{ backgroundColor: "#14B8A6" }}
          >
            A
          </div>
        </div>
        <span className="text-[13px] sm:text-sm font-normal text-neutral-500 select-none">
          Loved by 2,000,000+ learners
        </span>
      </div>
    </section>
  );
}
