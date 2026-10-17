"use client";

import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ArrowLeft, Lock } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white text-neutral-900 flex flex-col font-sans">
      <Navbar onOpenDemo={() => {}} />

      <main className="flex-1 max-w-[760px] mx-auto px-6 py-16 sm:py-20">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-neutral-950 mb-8"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </Link>

        <div className="flex items-center gap-2 mb-3">
          <div className="p-1.5 rounded-lg bg-neutral-100 text-neutral-800">
            <Lock className="w-4 h-4" />
          </div>
          <span className="text-xs font-semibold tracking-wider uppercase text-neutral-400">
            Privacy &amp; Security
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-950 mb-3">
          Privacy Policy
        </h1>
        <p className="text-xs text-neutral-400 font-medium mb-10">
          Last updated: March 30, 2026
        </p>

        <div className="space-y-8 text-sm sm:text-base text-neutral-600 leading-relaxed font-normal">
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-neutral-900">1. Student Privacy First</h2>
            <p>
              At LearnNova, protecting student and educator privacy is central to our core mission. We respect your trust and are committed to safeguarding personal information collected through our website, mobile applications, and AI tutoring services.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-neutral-900">2. Information We Collect</h2>
            <ul className="list-disc pl-5 space-y-1.5 text-sm">
              <li><strong className="text-neutral-800">Account Details:</strong> Name, university/school email address, and authentication tokens via Google or Apple SSO.</li>
              <li><strong className="text-neutral-800">Study Materials:</strong> Uploaded lecture notes, YouTube lecture links, PDFs, slide decks, and quiz responses stored in your private workspace.</li>
              <li><strong className="text-neutral-800">Usage Analytics:</strong> Anonymized metrics on study time, flashcard review frequency, and system performance to enhance tutor accuracy.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-neutral-900">3. How We Use and Protect Data</h2>
            <p>
              We process your course documents exclusively to provide you with personalized study notes, flashcards, practice exams, and audio podcasts. We do not sell your personal data or uploaded academic files to data brokers or third-party advertisers.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-neutral-900">4. Data Security &amp; Encryption</h2>
            <p>
              All data transmissions are encrypted using industry-standard TLS 1.3 cryptographic protocols, and stored data is encrypted at rest using AES-256 bit encryption.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-neutral-900">5. Contact Our Data Protection Team</h2>
            <p>
              If you have any questions or requests regarding your personal data or account deletion, please email our privacy team at <span className="font-semibold text-neutral-900">privacy@learnnova.ai</span>.
            </p>
          </section>
        </div>
      </main>

      <Footer onOpenDemo={() => {}} />
    </div>
  );
}
