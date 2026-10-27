"use client";

import React from "react";
import Link from "next/link";
import { AppleIcon, GooglePlayIcon } from "./Icons";

export interface ClosingCtaProps {
  onOpenDemo?: (title: string, subtitle: string) => void;
}

export function ClosingCta(props?: ClosingCtaProps) {
  void props;
  return (
    <section id="closing-cta" className="w-full max-w-[1240px] mx-auto px-4 sm:px-6 pb-20 pt-8">
      <div className="w-full bg-[#f3f4f6] rounded-3xl sm:rounded-[38px] border border-neutral-200/80 py-16 sm:py-20 md:py-24 px-6 text-center shadow-2xs">
        {/* Headline */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[52px] font-semibold text-neutral-900 tracking-[-0.035em] mb-3">
          Learn smarter, faster, easier.
        </h2>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-neutral-500 font-normal mb-8 max-w-lg mx-auto leading-relaxed">
          Join over 2 million people learning smarter
        </p>

        {/* Primary CTA */}
        <div className="flex justify-center mb-9">
          <Link
            href="/signin"
            className="inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-neutral-950 hover:bg-neutral-800 text-white font-medium text-[15.5px] transition-all active:scale-[0.98] shadow-xs cursor-pointer"
          >
            Get Started
          </Link>
        </div>

        {/* App Store and Google Play Badges */}
        <div className="flex flex-wrap items-center justify-center gap-3.5">
          <a
            href="https://apps.apple.com"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-white/90 hover:bg-white border border-neutral-200 text-neutral-900 text-left transition-all shadow-2xs active:scale-[0.98] cursor-pointer"
          >
            <AppleIcon className="w-6 h-6 text-neutral-900" />
            <div className="flex flex-col leading-none">
              <span className="text-[10px] text-neutral-500 font-medium">Download on the</span>
              <span className="text-[14px] font-semibold text-neutral-900 mt-0.5">App Store</span>
            </div>
          </a>

          <a
            href="https://play.google.com"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-white/90 hover:bg-white border border-neutral-200 text-neutral-900 text-left transition-all shadow-2xs active:scale-[0.98] cursor-pointer"
          >
            <GooglePlayIcon className="w-5 h-5" />
            <div className="flex flex-col leading-none">
              <span className="text-[10px] text-neutral-500 font-medium">Get it on</span>
              <span className="text-[14px] font-semibold text-neutral-900 mt-0.5">Google Play</span>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}

