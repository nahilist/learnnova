 "use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronDown, Menu, X } from "lucide-react";
import { YouLearnLogo } from "./Icons";

interface NavbarProps {
  onOpenDemo: (title: string, subtitle: string) => void;
}

export function Navbar({ onOpenDemo }: NavbarProps) {
  const [featuresOpen, setFeaturesOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!mobileMenuOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileMenuOpen]);

  return (
    <header className="sticky top-0 z-50 w-full bg-white/85 backdrop-blur-md border-b border-neutral-100/80 transition-all">
      <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-12 h-18 sm:h-20 flex items-center justify-between">
        {/* Left: Logo & Navigation Links */}
        <div className="flex items-center gap-8 lg:gap-11">
          <Link href="/" className="shrink-0 transition-opacity hover:opacity-85">
            <YouLearnLogo />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-7 lg:gap-8 text-[15px] text-neutral-600 font-normal">
            {/* Features Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setFeaturesOpen(true)}
              onMouseLeave={() => setFeaturesOpen(false)}
            >
              <button
                onClick={() => setFeaturesOpen(!featuresOpen)}
                className="flex items-center gap-1.5 py-2 hover:text-neutral-950 transition-colors focus:outline-none cursor-pointer"
                aria-expanded={featuresOpen}
              >
                <span>Features</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 text-neutral-400 ${
                    featuresOpen ? "rotate-180 text-neutral-900" : ""
                  }`}
                />
              </button>

              {/* Dropdown Menu */}
              {featuresOpen && (
                <div className="absolute top-full -left-2 w-56 pt-2 z-50">
                  <div className="rounded-2xl border border-neutral-200/80 bg-white/95 p-2 py-2.5 shadow-[0_18px_50px_rgba(15,23,42,0.12)] backdrop-blur-2xl animate-in fade-in slide-in-from-top-2 duration-150">
                    <button
                      onClick={() => {
                        setFeaturesOpen(false);
                        onOpenDemo(
                          "All Features",
                          "Explore the complete AI tutoring suite, note generation, quizzes, and chat."
                        );
                      }}
                      className="w-full text-left px-3.5 py-2 rounded-xl text-[14px] text-neutral-700 hover:text-neutral-950 hover:bg-neutral-50 font-medium transition-colors cursor-pointer"
                    >
                      All Features
                    </button>
                    <button
                      onClick={() => {
                        setFeaturesOpen(false);
                        onOpenDemo(
                          "Mobile App",
                          "Take your AI tutor anywhere with iOS and Android applications."
                        );
                      }}
                      className="w-full text-left px-3.5 py-2 rounded-xl text-[14px] text-neutral-700 hover:text-neutral-950 hover:bg-neutral-50 font-medium transition-colors cursor-pointer"
                    >
                      Mobile
                    </button>
                    <Link
                      href="/youtube-summarizer"
                      onClick={() => setFeaturesOpen(false)}
                      className="block w-full text-left px-3.5 py-2 rounded-xl text-[14px] text-neutral-700 hover:text-neutral-950 hover:bg-neutral-50 font-medium transition-colors cursor-pointer"
                    >
                      YouTube Summarizer
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <Link
              href="/blogs"
              className="hover:text-neutral-950 transition-colors cursor-pointer"
            >
              Blogs
            </Link>

            <Link
              href="/pricing"
              className="hover:text-neutral-950 transition-colors cursor-pointer"
            >
              Pricing
            </Link>

            <Link
              href="/careers"
              className="hover:text-neutral-950 transition-colors cursor-pointer"
            >
              Careers
            </Link>
          </nav>
        </div>

        {/* Right: Get Started CTA */}
        <div className="hidden md:flex items-center">
          <Link
            href="/signin"
            className="inline-flex items-center justify-center h-10 px-6 rounded-full bg-neutral-950 hover:bg-neutral-800 text-white text-[15px] font-medium transition-all duration-150 shadow-xs active:scale-[0.98] cursor-pointer"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-neutral-800 hover:text-black focus:outline-none cursor-pointer"
          aria-label="Toggle navigation menu"
          aria-controls="mobile-navigation"
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown Overlay */}
      {mobileMenuOpen && (
        <div
          id="mobile-navigation"
          className="absolute inset-x-0 top-full z-50 flex min-h-[calc(100dvh-72px)] flex-col items-center space-y-6 overflow-y-auto border-t border-neutral-100 bg-white px-6 py-8 text-center shadow-[0_22px_50px_rgba(15,23,42,0.12)] animate-in fade-in slide-in-from-top-2 duration-200 md:hidden"
        >
          <div className="w-full flex flex-col items-center space-y-5 text-[17px] font-medium text-neutral-800">
            {/* Features accordion */}
            <div className="w-full flex flex-col items-center">
              <button
                onClick={() => setFeaturesOpen(!featuresOpen)}
                className="flex items-center justify-center gap-1.5 py-1 text-neutral-800 cursor-pointer"
              >
                <span>Features</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    featuresOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {featuresOpen && (
                <div className="flex flex-col space-y-3 pt-3 text-[15px] text-neutral-600">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenDemo("All Features", "Explore the complete AI tutoring suite.");
                    }}
                    className="hover:text-black py-1 cursor-pointer"
                  >
                    All Features
                  </button>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenDemo("Mobile", "Study on iOS and Android.");
                    }}
                    className="hover:text-black py-1 cursor-pointer"
                  >
                    Mobile
                  </button>
                  <Link
                    href="/youtube-summarizer"
                    onClick={() => setMobileMenuOpen(false)}
                    className="hover:text-black py-1"
                  >
                    YouTube Summarizer
                  </Link>
                </div>
              )}
            </div>

            <Link
              href="/blogs"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-black"
            >
              Blogs
            </Link>
            <Link
              href="/pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-black"
            >
              Pricing
            </Link>
            <Link
              href="/careers"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-black"
            >
              Careers
            </Link>
          </div>

          <div className="w-full pt-4 border-t border-neutral-100">
            <Link
              href="/signin"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full bg-neutral-950 hover:bg-neutral-800 text-white font-medium py-3.5 px-6 rounded-full text-[16px] shadow-sm text-center transition"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
