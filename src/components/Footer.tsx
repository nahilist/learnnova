"use client";

import React from "react";
import Link from "next/link";
import { YouLearnLogo } from "./Icons";
import { Landmark } from "lucide-react";

interface FooterProps {
  onOpenDemo: (title: string, subtitle: string) => void;
}

export function Footer({ onOpenDemo }: FooterProps) {
  return (
    <footer className="w-full bg-white border-t border-neutral-100 pt-16 pb-20">
      <div className="max-w-[1240px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-16">
          
          {/* Left Column: Brand, Copyright & Partner Badge */}
          <div className="md:col-span-6 lg:col-span-5 space-y-5">
            <Link href="/" className="inline-block focus:outline-none">
              <YouLearnLogo />
            </Link>

            <p className="text-sm text-neutral-500 font-normal">
              © Copyright 2026 YouLearn Inc.
            </p>

            <div className="pt-2">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#18181b] text-neutral-200 text-xs font-medium shadow-xs border border-neutral-800 select-none">
                <Landmark className="w-3.5 h-3.5 text-neutral-400" />
                <span>AI in Education Partner</span>
              </div>
            </div>
          </div>

          {/* Right Columns: Navigation Links */}
          <div className="md:col-span-6 lg:col-span-7 grid grid-cols-2 gap-8 sm:gap-12 text-sm text-neutral-600">
            {/* Column 1 */}
            <div className="space-y-3.5">
              <div>
                <a
                  href="https://discord.gg/jJbfJvsQGw"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-neutral-950 transition-colors text-left cursor-pointer"
                >
                  Discord Community
                </a>
              </div>

              <div>
                <Link
                  href="/blogs"
                  className="hover:text-neutral-950 transition-colors text-left cursor-pointer"
                >
                  Blogs
                </Link>
              </div>

              <div>
                <button
                  onClick={() => onOpenDemo("Invite & Earn", "Invite classmates to YouLearn and earn free months of Unlimited Pro access.")}
                  className="hover:text-neutral-950 transition-colors text-left cursor-pointer"
                >
                  Invite &amp; Earn
                </button>
              </div>

              <div>
                <Link
                  href="/careers"
                  className="hover:text-neutral-950 transition-colors text-left cursor-pointer"
                >
                  Careers
                </Link>
              </div>
            </div>

            {/* Column 2 */}
            <div className="space-y-3.5">
              <div>
                <Link
                  href="/terms-conditions"
                  className="hover:text-neutral-950 transition-colors text-left cursor-pointer"
                >
                  Terms &amp; Conditions
                </Link>
              </div>

              <div>
                <Link
                  href="/privacy-policy"
                  className="hover:text-neutral-950 transition-colors text-left cursor-pointer"
                >
                  Privacy Policy
                </Link>
              </div>

              <div>
                <button
                  onClick={() => onOpenDemo("Contact Us", "Reach our support team anytime at support@youlearn.ai")}
                  className="hover:text-neutral-950 transition-colors text-left cursor-pointer"
                >
                  Contact Us
                </button>
              </div>
            </div>

          </div>

        </div>
      </div>
    </footer>
  );
}
