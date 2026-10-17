"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronDown, Menu, X } from "lucide-react";
import { LearnNovaLogo } from "./Icons";

interface NavbarProps {
  onOpenDemo: (title: string, subtitle: string) => void;
}

export function Navbar({ onOpenDemo }: NavbarProps) {
  const [featuresOpen, setFeaturesOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!mobileMenuOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileMenuOpen]);

  return (
    <header
      className={`sticky top-0 z-40 w-full border-b backdrop-blur-[22px] backdrop-saturate-150 transition-all duration-300 ${
        scrolled
          ? "border-white/65 bg-white/[0.46] shadow-[0_8px_30px_rgba(15,23,42,0.07)]"
          : "border-white/45 bg-white/[0.28] shadow-[0_1px_0_rgba(15,23,42,0.03)]"
      }`}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent opacity-90"
      />
      <div className="max-w-[1280px] mx-auto px-6 h-20 flex items-center justify-between">
        {/* Left: Logo */}
        <Link href="/" className="transition-opacity hover:opacity-85 focus:outline-none">
          <LearnNovaLogo />
        </Link>

        {/* Center: Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-9 text-[15px] font-medium text-neutral-600">
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
                  featuresOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Dropdown Menu */}
            {featuresOpen && (
              <div className="absolute top-full -left-4 w-56 pt-2 z-50">
                <div className="rounded-2xl border border-white/70 bg-white/80 p-2 py-2.5 shadow-[0_18px_50px_rgba(15,23,42,0.14)] backdrop-blur-2xl animate-in fade-in slide-in-from-top-2 duration-150">
                  <button
                    onClick={() => {
                      setFeaturesOpen(false);
                      onOpenDemo("All Features", "Explore LearnNova's complete AI tutoring suite, note generation, quizzes, and chat.");
                    }}
                    className="w-full text-left px-3.5 py-2 rounded-xl text-[14px] text-neutral-700 hover:text-neutral-950 hover:bg-neutral-50 font-medium transition-colors cursor-pointer"
                  >
                    All Features
                  </button>
                  <button
                    onClick={() => {
                      setFeaturesOpen(false);
                      onOpenDemo("LearnNova Mobile", "Take your AI tutor anywhere with iOS and Android applications.");
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

        {/* Right: CTA Button */}
        <div className="hidden md:flex items-center">
          <Link
            href="/signin"
            className="bg-neutral-950 hover:bg-neutral-800 text-white font-medium text-[15px] px-5 py-2.5 rounded-full transition-all active:scale-[0.98] shadow-sm cursor-pointer"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-neutral-800 hover:text-black focus:outline-none"
          aria-label="Toggle navigation menu"
          aria-controls="mobile-navigation"
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown Overlay */}
      {mobileMenuOpen && (
        <div id="mobile-navigation" className="md:hidden absolute inset-x-0 top-full min-h-[calc(100dvh-5rem)] max-h-[calc(100dvh-5rem)] overflow-y-auto border-t border-neutral-100 bg-white px-6 py-8 shadow-[0_22px_50px_rgba(15,23,42,0.12)] flex flex-col items-center text-center space-y-6 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="w-full flex flex-col items-center space-y-5 text-[17px] font-medium text-neutral-800">
            {/* Features accordion */}
            <div className="w-full flex flex-col items-center">
              <button
                onClick={() => setFeaturesOpen(!featuresOpen)}
                className="flex items-center justify-center gap-1.5 py-1 text-neutral-800"
              >
                <span>Features</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${featuresOpen ? "rotate-180" : ""}`} />
              </button>

              {featuresOpen && (
                <div className="flex flex-col space-y-3 pt-3 text-[15px] text-neutral-600">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenDemo("All Features", "Explore LearnNova's complete AI tutoring suite.");
                    }}
                    className="hover:text-black py-1"
                  >
                    All Features
                  </button>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenDemo("Mobile", "Study on iOS and Android.");
                    }}
                    className="hover:text-black py-1"
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
              className="block w-full bg-neutral-950 text-white font-medium py-3.5 px-6 rounded-full text-[16px] shadow-md text-center"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
