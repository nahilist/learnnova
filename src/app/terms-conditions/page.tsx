"use client";

import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ArrowLeft, ShieldCheck } from "lucide-react";

export default function TermsPage() {
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
            <ShieldCheck className="w-4 h-4" />
          </div>
          <span className="text-xs font-semibold tracking-wider uppercase text-neutral-400">
            Legal &amp; Compliance
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-950 mb-3">
          Terms &amp; Conditions
        </h1>
        <p className="text-xs text-neutral-400 font-medium mb-10">
          Last updated: March 30, 2026
        </p>

        <div className="space-y-8 text-sm sm:text-base text-neutral-600 leading-relaxed font-normal">
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-neutral-900">1. Acceptance of Terms</h2>
            <p>
              By accessing or using LearnNova (&ldquo;Service&rdquo;), provided by LearnNova Inc., you agree to be bound by these Terms and Conditions. If you do not agree with any portion of these terms, you may not access or use our services.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-neutral-900">2. Description of Service</h2>
            <p>
              LearnNova is an AI-powered personalized tutoring workspace designed to help students analyze and study their own educational materials, including YouTube lectures, slide decks, PDFs, and notes. The service generates study guides, interactive flashcards, practice quizzes, and conversational tutoring assistance.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-neutral-900">3. Academic Integrity &amp; Acceptable Use</h2>
            <p>
              LearnNova is built to foster genuine conceptual mastery, active recall, and pedagogical understanding. You agree not to use LearnNova for unauthorized academic dishonesty, cheating on live proctored examinations, or circumventing institutional codes of conduct.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-neutral-900">4. User Uploaded Content &amp; Intellectual Property</h2>
            <p>
              You retain all ownership rights to documents, lecture slides, and notes uploaded to your private workspace. We do not sell your personal data or use your private study documents to train publicly accessible machine learning models without your explicit consent.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-neutral-900">5. Subscription &amp; Billing</h2>
            <p>
              Certain advanced features (such as LearnNova Pro and LearnNova Max) require paid subscriptions billed either monthly or annually. You may cancel your subscription at any time directly through your account settings or Stripe portal.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-neutral-900">6. Contact Information</h2>
            <p>
              Questions regarding these Terms should be sent to <span className="font-semibold text-neutral-900">legal@learnnova.ai</span>.
            </p>
          </section>
        </div>
      </main>

      <Footer onOpenDemo={() => {}} />
    </div>
  );
}
