"use client";

import React from "react";
import Link from "next/link";
import { AppleIcon, GooglePlayIcon } from "./Icons";

interface ClosingCtaProps {
  onOpenDemo: (title: string, subtitle: string) => void;
}

export function ClosingCta({ onOpenDemo }: ClosingCtaProps) {
  return (
    <section className="w-full max-w-[1240px] mx-auto px-4 sm:px-6 pb-20">
      <div className="w-full bg-[#f3f4f6] rounded-3xl sm:rounded-[40px] border border-neutral-200/90 py-16 sm:py-24 px-6 text-center shadow-xs">
        {/* Headline */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-semibold text-neutral-900 tracking-[-0.035em] mb-4">
          Learn smarter, faster, easier.
        </h2>

        {/* Subtitle */}
        <p className="text-base sm:text-lg md:text-[20px] text-neutral-600 font-normal mb-8 max-w-xl mx-auto">
          Join over 2 million people learning smarter
        </p>

        {/* Primary CTA */}
        <div className="flex justify-center mb-10">
          <Link
            href="/signin"
            className="px-8 py-3.5 rounded-full bg-neutral-950 hover:bg-neutral-800 text-white font-medium text-[16px] transition-all active:scale-[0.98] shadow-sm cursor-pointer"
          >
            Get Started
          </Link>
        </div>

        {/* App Store Download Badges */}
        <div className="flex flex-wrap items-center justify-center gap-3.5 sm:gap-4 select-none">
          {/* Apple App Store */}
          <button
            onClick={() => onOpenDemo("Apple App Store", "Download YouLearn on your iPhone and iPad.")}
            className="inline-flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-white hover:bg-neutral-50 border border-neutral-200/90 text-neutral-900 shadow-2xs transition-all active:scale-[0.98] cursor-pointer"
          >
            <AppleIcon className="w-6 h-6 text-black" />
            <div className="text-left leading-tight">
              <span className="block text-[10px] text-neutral-500 font-medium">Download on the</span>
              <span className="block text-[14px] font-semibold text-neutral-900">App Store</span>
            </div>
          </button>

          {/* Google Play Store */}
          <button
            onClick={() => onOpenDemo("Google Play Store", "Download YouLearn for Android devices on Google Play.")}
            className="inline-flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-white hover:bg-neutral-50 border border-neutral-200/90 text-neutral-900 shadow-2xs transition-all active:scale-[0.98] cursor-pointer"
          >
            <GooglePlayIcon className="w-5 h-5" />
            <div className="text-left leading-tight">
              <span className="block text-[10px] text-neutral-500 font-medium">Get it on</span>
              <span className="block text-[14px] font-semibold text-neutral-900">Google Play</span>
            </div>
          </button>
        </div>
      </div>
    </section>
  );
}
