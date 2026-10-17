"use client";

import React from "react";
import Link from "next/link";

interface HeroProps {
  onOpenDemo: (title: string, subtitle: string) => void;
  onScrollToFeatures: () => void;
}

export function Hero({ onOpenDemo, onScrollToFeatures }: HeroProps) {
  return (
    <section className="relative pt-12 pb-14 md:pt-16 md:pb-16 flex flex-col items-center text-center px-4 max-w-[1280px] mx-auto overflow-hidden">
      {/* Main Headline */}
      <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[70px] font-semibold text-neutral-900 tracking-[-0.035em] leading-[1.08] max-w-4xl mx-auto mb-6">
        An AI tutor made for you
      </h1>

      {/* Supporting Subtitle */}
      <p className="text-lg sm:text-xl md:text-[21px] text-neutral-500 font-normal leading-relaxed max-w-2xl mx-auto mb-9">
        Turns your learning materials into notes, interactive chats, quizzes, and more
      </p>

      {/* CTA Buttons */}
      <div className="flex items-center justify-center gap-4 mb-9 w-full sm:w-auto">
        {/* Left button: "See features" on desktop, "Get the app" on mobile */}
        <button
          onClick={onScrollToFeatures}
          className="hidden sm:inline-flex items-center justify-center px-7 py-3.5 rounded-full bg-[#f3f4f6] hover:bg-neutral-200/70 border border-neutral-200 text-neutral-900 font-medium text-[16px] transition-all active:scale-[0.98] shadow-xs cursor-pointer"
        >
          See features
        </button>

        <button
          onClick={() => onOpenDemo("Download the App", "Get the LearnNova mobile app on iOS and Android to study anywhere.")}
          className="sm:hidden inline-flex items-center justify-center px-6 py-3.5 rounded-full bg-[#f3f4f6] hover:bg-neutral-200 border border-neutral-200 text-neutral-900 font-medium text-[15px] transition-all active:scale-[0.98] shadow-xs cursor-pointer flex-1"
        >
          Get the app
        </button>

        {/* Right button: Start Learning */}
        <Link
          href="/app"
          className="inline-flex items-center justify-center px-7 py-3.5 rounded-full bg-neutral-950 hover:bg-neutral-800 text-white font-medium text-[16px] transition-all active:scale-[0.98] shadow-sm cursor-pointer flex-1 sm:flex-initial"
        >
          Start Learning
        </Link>
      </div>

      {/* Social Proof: Avatars and Count */}
      <div className="flex items-center justify-center gap-3 select-none">
        {/* Avatar cluster */}
        <div className="flex items-center -space-x-2">
          <div className="w-7 h-7 rounded-full bg-[#3b82f6] text-white flex items-center justify-center text-xs font-semibold ring-2 ring-white">
            A
          </div>
          <div className="w-7 h-7 rounded-full bg-[#ea580c] text-white flex items-center justify-center text-xs font-semibold ring-2 ring-white">
            R
          </div>
          <div className="w-7 h-7 rounded-full bg-[#18181b] text-white flex items-center justify-center text-xs font-semibold ring-2 ring-white">
            Z
          </div>
          <div className="w-7 h-7 rounded-full bg-[#0d9488] text-white flex items-center justify-center text-xs font-semibold ring-2 ring-white">
            A
          </div>
        </div>

        {/* Text */}
        <span className="text-[14px] sm:text-[15px] font-normal text-neutral-600">
          Loved by <span className="font-medium text-neutral-800">2,000,000+</span> learners
        </span>
      </div>
    </section>
  );
}
