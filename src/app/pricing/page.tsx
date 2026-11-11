"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Check, ArrowRight, Sparkles, ChevronDown } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ModalDemo } from "@/components/ModalDemo";

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("yearly");
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

  const handleSelectPlan = (planName: string) => {
    setModalState({
      isOpen: true,
      title: `Join the YouLearn ${planName} Priority List`,
      subtitle:
        "Pro & Team subscriptions are currently expanding to new cohorts. Free accounts receive 20 AI questions/day and 3 daily uploads at no charge.",
    });
  };

  const faqs = [
    {
      q: "What do I get with the Pro plan?",
      a: "The Pro plan gives you unlimited AI chat questions, 50 document & video uploads per day (up to 100 MB per file), interactive audio/podcast tutor mode, unlimited active recall decks, and high-priority AI processing with zero wait times.",
    },
    {
      q: "What do I get with the Team plan?",
      a: "The Team plan includes everything in Pro plus shared team study spaces, collaborative note-taking and flashcard decks, centralized seat management, team billing, and dedicated customer success support.",
    },
    {
      q: "What are the limits for different plans?",
      a: "Free accounts receive 20 AI questions/day and 3 uploads/day (up to 10 MB). Pro accounts receive unlimited questions, 50 uploads/day (up to 100 MB), and extended lecture summaries up to 3 hours per video or 500 pages per PDF.",
    },
    {
      q: "What payment methods do you offer?",
      a: "We support all major credit and debit cards (Visa, Mastercard, American Express), Apple Pay, Google Pay, and PayPal through our secure payment processor.",
    },
    {
      q: "Can I cancel my YouLearn plan at any time?",
      a: "Yes, you can easily cancel your subscription anytime directly from your account settings. You will retain full access until the end of your current billing period.",
    },
    {
      q: "Do you offer student discount?",
      a: "Yes! We offer a special 25% educational discount for high school and university students with a verified .edu email address. Contact our support team to activate your discount.",
    },
    {
      q: "What is your refund policy?",
      a: "We offer a 7-day money-back guarantee. If you are not completely satisfied with YouLearn Pro within your first 7 days, reach out to support for a prompt full refund.",
    },
  ];

  return (
    <div className="min-h-screen bg-white text-neutral-900 selection:bg-neutral-200 flex flex-col">
      {/* Global Navigation */}
      <Navbar onOpenDemo={() => {}} />

      {/* Main Pricing Content */}
      <main className="flex-1 w-full max-w-[1240px] mx-auto px-4 sm:px-6 pt-12 sm:pt-16 pb-24">
        {/* Header Section matching YouLearn */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-neutral-100 text-neutral-800 text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5 text-neutral-700" />
            <span>Pricing Plans</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold text-neutral-900 tracking-[-0.035em] mb-4">
            Save hours, learn smarter.
          </h1>

          <p className="text-neutral-500 text-base sm:text-lg md:text-[19px] leading-relaxed max-w-2xl mx-auto">
            Enjoy endless content uploads, chats, voice mode, recorded lectures, and more.
          </p>

          {/* Billing Cycle Toggle (Monthly / Yearly - Save 40%) */}
          <div className="flex items-center justify-center gap-3 mt-8">
            <div className="inline-flex items-center p-1 rounded-full bg-neutral-100 border border-neutral-200/80 shadow-2xs">
              <button
                type="button"
                onClick={() => setBillingCycle("monthly")}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all cursor-pointer ${
                  billingCycle === "monthly"
                    ? "bg-white text-neutral-900 shadow-xs"
                    : "text-neutral-500 hover:text-neutral-900"
                }`}
              >
                Monthly
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle("yearly")}
                className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium transition-all cursor-pointer ${
                  billingCycle === "yearly"
                    ? "bg-white text-neutral-900 shadow-xs"
                    : "text-neutral-500 hover:text-neutral-900"
                }`}
              >
                <span>Yearly</span>
                <span className="text-[11px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                  Save 40%
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* 3 Tier Pricing Cards: Free, Pro (Featured), Team */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto mb-20 items-stretch">
          {/* Card 1: Free Starter */}
          <div className="bg-[#f8f9fa] rounded-3xl sm:rounded-[32px] p-7 sm:p-8 flex flex-col justify-between border border-neutral-200/80 shadow-2xs">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-base font-semibold text-neutral-900">
                  Starter Free
                </span>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-neutral-200/80 text-neutral-700">
                  Free Forever
                </span>
              </div>

              <div className="flex items-baseline gap-1.5 mb-2">
                <span className="text-4xl sm:text-5xl font-bold tracking-tight text-neutral-900">
                  $0
                </span>
                <span className="text-neutral-500 text-sm">/ month</span>
              </div>

              <p className="text-xs sm:text-sm text-neutral-500 mb-6 pb-6 border-b border-neutral-200/80">
                Ideal for individual students studying textbook chapters and lecture notes.
              </p>

              <div className="space-y-3 text-xs sm:text-[13px] text-neutral-700">
                <div className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>20 AI questions / day</strong> with page citations</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>3 document uploads / day</strong> (up to 10 MB)</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Interactive <strong>3D active recall flashcards</strong></span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Instant <strong>practice quizzes with explanations</strong></span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>YouTube lecture transcript summarizer</span>
                </div>
              </div>
            </div>

            <div className="pt-8 mt-8 border-t border-neutral-200/80">
              <Link
                href="/app"
                className="w-full py-3.5 px-6 rounded-full bg-neutral-950 hover:bg-neutral-800 text-white font-semibold text-sm transition-all shadow-xs active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Start Free</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Card 2: Pro Plan (Most Popular / Highlighted) */}
          <div className="bg-[#18181b] rounded-3xl sm:rounded-[32px] p-7 sm:p-8 flex flex-col justify-between text-white border-2 border-neutral-700 shadow-xl relative scale-[1.02]">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-white text-neutral-950 text-xs font-bold px-3.5 py-1 rounded-full shadow-md uppercase tracking-wider">
              Most Popular
            </div>

            <div>
              <div className="flex items-center justify-between mb-4 pt-1">
                <span className="text-base font-semibold text-white">
                  YouLearn Pro
                </span>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {billingCycle === "yearly" ? "Billed Yearly" : "Billed Monthly"}
                </span>
              </div>

              <div className="flex items-baseline gap-1.5 mb-2">
                <span className="text-4xl sm:text-5xl font-bold tracking-tight text-white">
                  {billingCycle === "yearly" ? "$9.60" : "$16"}
                </span>
                <span className="text-neutral-400 text-sm">/ month</span>
              </div>

              <p className="text-xs sm:text-sm text-neutral-400 mb-6 pb-6 border-b border-neutral-800">
                Full power for intensive exam prep and high-volume semester workloads.
              </p>

              <div className="space-y-3 text-xs sm:text-[13px] text-neutral-300">
                <div className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Unlimited AI questions</strong> with zero quotas</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>50 uploads / day</strong> (up to 100 MB per file)</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Audio &amp; Voice mode:</strong> Listen to AI podcast tutor</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Multi-document synthesized cross-examination</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Priority AI inference speed &amp; uptime</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Unlimited deck persistence &amp; spaced review</span>
                </div>
              </div>
            </div>

            <div className="pt-8 mt-8 border-t border-neutral-800">
              <button
                type="button"
                onClick={() => handleSelectPlan("Pro")}
                className="w-full py-3.5 px-6 rounded-full bg-white hover:bg-neutral-100 text-neutral-950 font-semibold text-sm transition-all shadow-md active:scale-[0.98] cursor-pointer"
              >
                Upgrade to Pro
              </button>
            </div>
          </div>

          {/* Card 3: Team / Lab */}
          <div className="bg-[#f8f9fa] rounded-3xl sm:rounded-[32px] p-7 sm:p-8 flex flex-col justify-between border border-neutral-200/80 shadow-2xs">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-base font-semibold text-neutral-900">
                  Team &amp; Lab
                </span>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-neutral-200/80 text-neutral-700">
                  Collaborative
                </span>
              </div>

              <div className="flex items-baseline gap-1.5 mb-2">
                <span className="text-4xl sm:text-5xl font-bold tracking-tight text-neutral-900">
                  {billingCycle === "yearly" ? "$19" : "$24"}
                </span>
                <span className="text-neutral-500 text-sm">/ seat / month</span>
              </div>

              <p className="text-xs sm:text-sm text-neutral-500 mb-6 pb-6 border-b border-neutral-200/80">
                For research groups, study circles, and university student cohorts.
              </p>

              <div className="space-y-3 text-xs sm:text-[13px] text-neutral-700">
                <div className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Everything in Pro</strong> for every member</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Shared <strong>team study spaces &amp; libraries</strong></span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Collaborative study notes &amp; shared decks</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Admin console &amp; centralized seat billing</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Dedicated customer support manager</span>
                </div>
              </div>
            </div>

            <div className="pt-8 mt-8 border-t border-neutral-200/80">
              <button
                type="button"
                onClick={() => handleSelectPlan("Team")}
                className="w-full py-3.5 px-6 rounded-full bg-white hover:bg-neutral-100 border border-neutral-300 text-neutral-900 font-semibold text-sm transition-all shadow-2xs active:scale-[0.98] cursor-pointer"
              >
                Contact for Team
              </button>
            </div>
          </div>
        </div>

        {/* Pricing FAQs matching YouLearn.ai */}
        <div className="max-w-3xl mx-auto pt-6 border-t border-neutral-200/80">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-neutral-900 tracking-[-0.02em] mb-2">
              Frequently Asked Questions
            </h2>
            <p className="text-neutral-500 text-sm sm:text-base">
              Everything you need to know about plans, billing, and discounts.
            </p>
          </div>

          <div className="divide-y divide-neutral-200/80">
            {faqs.map((faq, idx) => {
              const isOpen = expandedFaq === idx;
              return (
                <div key={idx} className="py-4 sm:py-5">
                  <button
                    type="button"
                    onClick={() => setExpandedFaq(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between text-left text-sm sm:text-base font-medium text-neutral-900 hover:text-neutral-600 py-1 cursor-pointer transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-neutral-400 transition-transform duration-200 shrink-0 ml-4 ${
                        isOpen ? "rotate-180 text-neutral-900" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="pt-2.5 text-xs sm:text-sm text-neutral-600 leading-relaxed animate-in fade-in duration-200 font-normal">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* Modal Demo / Waitlist */}
      <ModalDemo
        isOpen={modalState.isOpen}
        onClose={() => setModalState((prev) => ({ ...prev, isOpen: false }))}
        title={modalState.title}
        subtitle={modalState.subtitle}
      />

      {/* Global Footer */}
      <Footer onOpenDemo={() => {}} />
    </div>
  );
}
