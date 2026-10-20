"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Check, ArrowRight, Sparkles } from "lucide-react";
import { LearnNovaLogo } from "@/components/Icons";
import { ModalDemo } from "@/components/ModalDemo";

export default function PricingPage() {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    title: string;
    subtitle: string;
  }>({
    isOpen: false,
    title: "",
    subtitle: "",
  });

  const handleProInterest = () => {
    setModalState({
      isOpen: true,
      title: "Join the LearnNova Pro Waitlist",
      subtitle:
        "Pro tier expansions are rolling out. Free tier accounts currently enjoy 20 AI questions/day and 3 daily uploads at no charge.",
    });
  };

  const faqs = [
    {
      q: "What is included in the Free Starter plan?",
      a: "The Free plan provides 20 AI questions per day, 3 document uploads per day (up to 10 MB per file), full Socratic chat with page-cited answers, active recall flashcards with spaced review, and server-graded practice exams.",
    },
    {
      q: "What happens when I reach my daily quota?",
      a: "Your daily questions and upload quotas automatically reset at midnight UTC. You can continue reviewing all existing saved documents, notes, and flashcards anytime.",
    },
    {
      q: "Are citations guaranteed to come from my materials?",
      a: "Yes. LearnNova partitions your uploaded material into discrete chunks with page references. When asked factual questions, the AI tutor quotes exact page citations.",
    },
    {
      q: "Do I need a credit card to get started?",
      a: "No! You can create a free account with your email or sign in immediately to start studying.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#fafafa] text-neutral-900 selection:bg-neutral-200">
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-neutral-100">
        <div className="max-w-[1240px] mx-auto px-6 h-18 flex items-center justify-between">
          <Link href="/" className="hover:opacity-80 transition-opacity">
            <LearnNovaLogo />
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/signin"
              className="text-xs sm:text-sm font-medium text-neutral-600 hover:text-black px-3 py-1.5"
            >
              Sign In
            </Link>
            <Link
              href="/app"
              className="bg-neutral-950 hover:bg-neutral-800 text-white font-medium text-xs sm:text-sm px-4 sm:px-5 py-2 rounded-full transition-all shadow-xs cursor-pointer"
            >
              Start Free
            </Link>
          </div>
        </div>
      </header>

      {/* Main Pricing Content */}
      <main className="max-w-[1180px] mx-auto px-4 sm:px-6 pt-12 pb-24">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Transparent, Honest Usage Limits</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-neutral-900 tracking-[-0.03em] mb-4">
            Study smarter with predictable quotas
          </h1>
          <p className="text-neutral-500 text-base sm:text-lg leading-relaxed">
            Get started completely free with daily generative AI questions, document-grounded tutoring, and active recall decks.
          </p>
        </div>

        {/* Dual Tier Cards: Free Starter & Pro Waitlist */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-4xl mx-auto mb-16 items-stretch">
          {/* Card 1: Free Starter Plan */}
          <div className="bg-white rounded-3xl sm:rounded-[36px] p-7 sm:p-9 text-neutral-900 shadow-sm flex flex-col justify-between border border-neutral-200/90 relative">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold text-neutral-900">
                  Starter Plan
                </span>
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Free Forever
                </span>
              </div>

              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-4xl sm:text-5xl font-bold tracking-tight text-neutral-900">
                  $0
                </span>
                <span className="text-neutral-500 text-sm">/ month</span>
              </div>

              <p className="text-xs sm:text-sm text-neutral-500 mb-8 pb-6 border-b border-neutral-100">
                Ideal for individual students studying textbook chapters and lecture notes.
              </p>

              <div className="space-y-3.5 text-xs sm:text-[13px] text-neutral-700">
                <div className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>20 AI questions / day</strong> with exact page citations</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>3 document uploads / day</strong> (up to 10 MB per file)</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Interactive <strong>3D active recall flashcards</strong></span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Server-graded <strong>practice exams with explanations</strong></span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>YouTube lecture transcripts & chapter summaries</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Autosaved study notes with Markdown export</span>
                </div>
              </div>
            </div>

            <div className="pt-8 mt-8 border-t border-neutral-100">
              <Link
                href="/app"
                className="w-full py-3.5 px-6 rounded-full bg-neutral-950 hover:bg-neutral-800 text-white font-semibold text-sm transition-all shadow-md active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Start Studying Free</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Card 2: Pro Plan (Coming Soon / High Capacity) */}
          <div className="bg-[#18181b] rounded-3xl sm:rounded-[36px] p-7 sm:p-9 text-white shadow-xl flex flex-col justify-between border border-neutral-800 relative">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-neutral-400">
                  <strong className="text-white font-semibold">Pro Tier</strong> (Planned)
                </span>
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white/10 text-white border border-white/20">
                  Coming Soon
                </span>
              </div>

              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-4xl sm:text-5xl font-bold tracking-tight">
                  $12
                </span>
                <span className="text-neutral-400 text-sm">/ month</span>
              </div>

              <p className="text-xs sm:text-sm text-neutral-400 mb-8 pb-6 border-b border-neutral-800">
                Expanded capacity for intensive exam prep and high-volume semester workloads.
              </p>

              <div className="space-y-3.5 text-xs sm:text-[13px] text-neutral-300">
                <div className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>150 AI questions / day</strong> for heavy study sessions</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>20 uploads / day</strong> with 50 MB file limits</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Priority Groq AI inference speed</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Multi-document synthesized cross-examination</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Unlimited deck persistence & spaced repetition review</span>
                </div>
              </div>
            </div>

            <div className="pt-8 mt-8 border-t border-neutral-800">
              <button
                onClick={handleProInterest}
                className="w-full py-3.5 px-6 rounded-full bg-white hover:bg-neutral-100 text-neutral-900 font-semibold text-sm transition-all shadow-md active:scale-[0.98] cursor-pointer"
              >
                Join Pro Waitlist
              </button>
            </div>
          </div>
        </div>

        {/* FAQs */}
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-semibold text-neutral-900 mb-2">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="divide-y divide-neutral-200">
            {faqs.map((faq, idx) => {
              const isOpen = expandedFaq === idx;
              return (
                <div key={idx} className="py-4">
                  <button
                    onClick={() => setExpandedFaq(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between text-left text-sm sm:text-base font-medium text-neutral-800 hover:text-black py-1 cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <span className="text-neutral-400 text-sm ml-4">
                      {isOpen ? "▲" : "▼"}
                    </span>
                  </button>
                  {isOpen && (
                    <div className="pt-2 text-xs sm:text-sm text-neutral-600 leading-relaxed animate-in fade-in duration-150">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </main>

      <ModalDemo
        isOpen={modalState.isOpen}
        onClose={() => setModalState((prev) => ({ ...prev, isOpen: false }))}
        title={modalState.title}
        subtitle={modalState.subtitle}
      />
    </div>
  );
}
