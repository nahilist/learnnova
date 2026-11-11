"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AppleIcon, GooglePlayIcon } from "./Icons";

export interface ClosingCtaProps {
  onOpenDemo?: (title: string, subtitle: string) => void;
}

export function ClosingCta(props?: ClosingCtaProps) {
  void props;
  return (
    <section id="closing-cta" className="w-full max-w-[1240px] mx-auto px-4 sm:px-6 pb-20 pt-8 select-none">
      <div className="w-full bg-[#f8f9fa] rounded-3xl sm:rounded-[40px] border border-neutral-200/90 py-16 sm:py-20 md:py-24 px-6 text-center shadow-xs">
        {/* Headline matching YouLearn */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-semibold text-neutral-900 tracking-[-0.035em] mb-4">
          Learn smarter, faster, easier.
        </h2>

        {/* Subtitle */}
        <p className="text-base sm:text-lg md:text-[20px] text-neutral-500 font-normal mb-8 max-w-xl mx-auto leading-relaxed">
          Join over 2 million people learning smarter
        </p>

        {/* Action Buttons: Get Started + App Store Badges */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4">
          <Link
            href="/app"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-neutral-950 hover:bg-neutral-800 text-white font-semibold text-[15px] transition-all active:scale-[0.98] shadow-sm cursor-pointer"
          >
            <span>Start Learning Free</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          {/* App Store badge */}
          <Link
            href="/app"
            className="inline-flex items-center gap-2.5 px-6 py-2.5 rounded-full bg-white hover:bg-neutral-100 border border-neutral-200 text-neutral-900 font-medium text-xs transition-all active:scale-[0.98] shadow-2xs cursor-pointer"
          >
            <AppleIcon className="w-4 h-4" />
            <div className="text-left leading-tight">
              <div className="text-[9px] text-neutral-500">Download on the</div>
              <div className="font-semibold text-xs text-neutral-900">App Store</div>
            </div>
          </Link>

          {/* Google Play badge */}
          <Link
            href="/app"
            className="inline-flex items-center gap-2.5 px-6 py-2.5 rounded-full bg-white hover:bg-neutral-100 border border-neutral-200 text-neutral-900 font-medium text-xs transition-all active:scale-[0.98] shadow-2xs cursor-pointer"
          >
            <GooglePlayIcon className="w-4 h-4" />
            <div className="text-left leading-tight">
              <div className="text-[9px] text-neutral-500">GET IT ON</div>
              <div className="font-semibold text-xs text-neutral-900">Google Play</div>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
