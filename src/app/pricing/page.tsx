"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Check, 
  ChevronDown, 
  Menu, 
  HelpCircle, 
  Sparkles, 
  ArrowRight, 
  Plus, 
  X,
  CreditCard,
  ShieldCheck
} from "lucide-react";
import { YouLearnLogo, StanfordSeal, HarvardSeal, PrincetonSeal, UCLASeal } from "@/components/Icons";
import { ModalDemo } from "@/components/ModalDemo";

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<"yearly" | "monthly">("yearly");
  const [currency, setCurrency] = useState<"USD" | "INR">("USD");
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);
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

  const handleSelectPlan = (planName: string, price: string) => {
    setModalState({
      isOpen: true,
      title: `Upgrade to YouLearn ${planName}`,
      subtitle: `Start your 7-day free trial on the ${planName} plan (${price} billed ${billingCycle}). Cancel anytime in 1 click.`,
    });
  };

  const pricingData = {
    USD: {
      symbol: "$",
      proMonthly: 19,
      proYearly: 12,
      maxMonthly: 49,
      maxYearly: 29,
      teamMonthly: 15,
      teamYearly: 10,
    },
    INR: {
      symbol: "₹",
      proMonthly: 750,
      proYearly: 450,
      maxMonthly: 4900,
      maxYearly: 3300,
      teamMonthly: 120,
      teamYearly: 60,
    },
  };

  const currentPrices = pricingData[currency];
  const proPrice = billingCycle === "yearly" ? currentPrices.proYearly : currentPrices.proMonthly;
  const maxPrice = billingCycle === "yearly" ? currentPrices.maxYearly : currentPrices.maxMonthly;
  const teamPrice = billingCycle === "yearly" ? currentPrices.teamYearly : currentPrices.teamMonthly;

  const faqs = [
    {
      q: "What do I get with the Pro plan?",
      a: "The Pro plan unlocks unlimited uploads of PDFs, YouTube links, audio recordings, and slides, unlimited AI chats with all documents, unlimited quiz answers, 12 audio podcast generations per day, 30 AI generated video lessons per month, and file uploads up to 2,000 pages / 300 MB.",
    },
    {
      q: "What do I get with the Team plan?",
      a: "The Team plan provides everything in Pro plus shared workspace collaboration, centralized billing, admin role controls, volume seat discounts, and dedicated group study spaces.",
    },
    {
      q: "What are the limits for different plans?",
      a: "Free accounts get 5 daily queries. Pro accounts enjoy unlimited chats, quiz answers, and exams with 2,000-page file sizes. Max plans double AI video allowances and increase file upload sizes up to 5,000 pages (500 MB).",
    },
    {
      q: "What payment methods do you offer?",
      a: "We accept all major credit and debit cards (Visa, MasterCard, American Express), Apple Pay, Google Pay, and UPI / NetBanking for regional currencies.",
    },
    {
      q: "Can I cancel my YouLearn plan at any time?",
      a: "Yes! You can cancel your subscription at any time with a single click from your account settings. You will retain full access until the end of your billing cycle.",
    },
    {
      q: "Do you offer student discount?",
      a: "Yes! Students with a valid .edu or university email receive an additional 20% discount on both monthly and yearly plans.",
    },
    {
      q: "What is your refund policy?",
      a: "We offer a 100% money-back guarantee within 7 days of purchase if you are not completely satisfied with YouLearn.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#fafafa] text-neutral-900 selection:bg-neutral-200">
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-neutral-100">
        <div className="max-w-[1240px] mx-auto px-6 h-18 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="hover:opacity-80 transition-opacity">
              <YouLearnLogo />
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {/* Currency Selector */}
            <div className="relative">
              <button
                onClick={() => setCurrencyDropdownOpen(!currencyDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-neutral-200 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors"
              >
                <span>{currency === "USD" ? "US $" : "INR ₹"}</span>
                <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
              </button>

              {currencyDropdownOpen && (
                <div className="absolute right-0 top-full mt-1.5 w-28 bg-white rounded-xl shadow-lg border border-neutral-200 p-1.5 z-40">
                  <button
                    onClick={() => {
                      setCurrency("USD");
                      setCurrencyDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium ${
                      currency === "USD" ? "bg-neutral-100 text-black font-semibold" : "text-neutral-600 hover:bg-neutral-50"
                    }`}
                  >
                    USD ($)
                  </button>
                  <button
                    onClick={() => {
                      setCurrency("INR");
                      setCurrencyDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium ${
                      currency === "INR" ? "bg-neutral-100 text-black font-semibold" : "text-neutral-600 hover:bg-neutral-50"
                    }`}
                  >
                    INR (₹)
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={() =>
                setModalState({
                  isOpen: true,
                  title: "Sign in to YouLearn",
                  subtitle: "Access your saved lecture notes, spaces, and generated quizzes.",
                })
              }
              className="bg-neutral-950 hover:bg-neutral-800 text-white font-medium text-xs sm:text-sm px-4 sm:px-5 py-2 rounded-full transition-all shadow-xs cursor-pointer"
            >
              Sign in
            </button>
          </div>
        </div>
      </header>

      {/* Main Pricing Content */}
      <main className="max-w-[1180px] mx-auto px-4 sm:px-6 pt-12 pb-24">
        {/* Title & Subtitle */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-neutral-900 tracking-[-0.03em] mb-4">
            Save hours, learn smarter.
          </h1>
          <p className="text-neutral-500 text-base sm:text-lg leading-relaxed">
            Enjoy endless content uploads, chats, voice mode, recorded lectures, and more.
          </p>
        </div>

        {/* Billing Cycle Switcher Toggle */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex items-center p-1 bg-neutral-200/60 rounded-full border border-neutral-200">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-5 py-2 rounded-full text-xs sm:text-[13px] font-medium transition-all cursor-pointer ${
                billingCycle === "monthly"
                  ? "bg-white text-neutral-900 shadow-xs"
                  : "text-neutral-600 hover:text-neutral-900"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle("yearly")}
              className={`flex items-center gap-1.5 px-5 py-2 rounded-full text-xs sm:text-[13px] font-medium transition-all cursor-pointer ${
                billingCycle === "yearly"
                  ? "bg-white text-neutral-900 shadow-xs"
                  : "text-neutral-600 hover:text-neutral-900"
              }`}
            >
              <span>Yearly</span>
              <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Save 40%
              </span>
            </button>
          </div>
        </div>

        {/* Dual Tier Cards: Pro & Max */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-4xl mx-auto mb-8 items-stretch">
          
          {/* Card 1: Pro Plan (Popular Dark Card) */}
          <div className="bg-[#18181b] rounded-3xl sm:rounded-[36px] p-7 sm:p-9 text-white shadow-xl flex flex-col justify-between border border-neutral-800 relative">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-neutral-400">
                  <strong className="text-white font-semibold">Pro</strong> Billed {billingCycle === "yearly" ? "Yearly" : "Monthly"}
                </span>
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Popular
                </span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-4xl sm:text-5xl font-bold tracking-tight">
                  {currentPrices.symbol} {proPrice}
                </span>
                <span className="text-neutral-400 text-sm">/ month</span>
              </div>

              <p className="text-xs sm:text-sm text-neutral-400 mb-8 pb-6 border-b border-neutral-800">
                Learn faster and go deeper.
              </p>

              {/* Features List */}
              <div className="space-y-3.5 text-xs sm:text-[13px] text-neutral-300">
                <div className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Unlimited</strong> uploads, pastes, and records</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Unlimited AI</strong> chats</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Unlimited</strong> quiz answers</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Unlimited</strong> exams</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>12 podcasts</strong> / day</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>30 AI videos</strong> / month</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>5 lesson plans</strong> / day</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>200K</strong> read-aloud characters / day</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Upload files, each up to <strong>2000 pages / 300 MB</strong> in size</span>
                </div>
              </div>
            </div>

            <div className="pt-8 mt-8 border-t border-neutral-800">
              <button
                onClick={() => handleSelectPlan("Pro", `${currentPrices.symbol}${proPrice}`)}
                className="w-full py-3.5 px-6 rounded-full bg-white hover:bg-neutral-100 text-neutral-900 font-semibold text-sm transition-all shadow-md active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Select Plan</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Card 2: Max Plan (Light Card) */}
          <div className="bg-white rounded-3xl sm:rounded-[36px] p-7 sm:p-9 text-neutral-900 shadow-sm flex flex-col justify-between border border-neutral-200/90 relative">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-neutral-500">
                  <strong className="text-neutral-900 font-semibold">Max</strong> Billed {billingCycle === "yearly" ? "Yearly" : "Monthly"}
                </span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-4xl sm:text-5xl font-bold tracking-tight text-neutral-900">
                  {currentPrices.symbol} {maxPrice}
                </span>
                <span className="text-neutral-500 text-sm">/ month</span>
              </div>

              <p className="text-xs sm:text-sm text-neutral-500 mb-8 pb-6 border-b border-neutral-100">
                Learn at the highest level.
              </p>

              {/* Features List */}
              <div className="space-y-3.5 text-xs sm:text-[13px] text-neutral-700">
                <div className="font-semibold text-neutral-900 pb-1">
                  Everything in Pro +
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-neutral-900 shrink-0 mt-0.5" />
                  <span><strong>Extended</strong> premium chat limits</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-neutral-900 shrink-0 mt-0.5" />
                  <span><strong>Unlimited podcast</strong> generations</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-neutral-900 shrink-0 mt-0.5" />
                  <span><strong>60 AI videos</strong> / month</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-neutral-900 shrink-0 mt-0.5" />
                  <span><strong>50 lesson plans</strong> / day</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-neutral-900 shrink-0 mt-0.5" />
                  <span><strong>Unlimited</strong> read-aloud characters</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-neutral-900 shrink-0 mt-0.5" />
                  <span>Upload files, each up to <strong>5000 pages / 500 MB</strong> in size</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-neutral-900 shrink-0 mt-0.5" />
                  <span><strong>Priority customer</strong> support</span>
                </div>
              </div>
            </div>

            <div className="pt-8 mt-8 border-t border-neutral-100">
              <button
                onClick={() => handleSelectPlan("Max", `${currentPrices.symbol}${maxPrice}`)}
                className="w-full py-3.5 px-6 rounded-full bg-neutral-950 hover:bg-neutral-800 text-white font-semibold text-sm transition-all shadow-md active:scale-[0.98] cursor-pointer"
              >
                Select Plan
              </button>
            </div>
          </div>

        </div>

        {/* Teams Plan Horizontal Card */}
        <div className="max-w-4xl mx-auto bg-white rounded-3xl sm:rounded-[36px] p-7 sm:p-9 border border-neutral-200/90 shadow-sm mb-16">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-neutral-100">
            <div>
              <div className="text-sm font-medium text-neutral-500 mb-1">
                <strong className="text-neutral-900 font-semibold text-lg">Teams</strong> Billed {billingCycle === "yearly" ? "Yearly" : "Monthly"}
              </div>
              <p className="text-xs sm:text-sm text-neutral-500">
                For study groups and teams.
              </p>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-bold text-neutral-900">
                {currentPrices.symbol} {teamPrice}
              </span>
              <span className="text-neutral-500 text-xs sm:text-sm">/ month / seat</span>
            </div>
          </div>

          <div className="pt-6">
            <div className="font-semibold text-xs sm:text-sm text-neutral-900 mb-4">
              Everything in Pro +
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5 text-xs sm:text-[13px] text-neutral-700 mb-8">
              <div className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-neutral-900 shrink-0 mt-0.5" />
                <span><strong>Discounts</strong> scale with team size</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-neutral-900 shrink-0 mt-0.5" />
                <span><strong>Centralized team</strong> billing</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-neutral-900 shrink-0 mt-0.5" />
                <span><strong>Add, remove</strong> and set permissions</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-neutral-900 shrink-0 mt-0.5" />
                <span><strong>Shared</strong> spaces</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-neutral-900 shrink-0 mt-0.5" />
                <span><strong>Minimum 3 seats</strong> required</span>
              </div>
            </div>

            <button
              onClick={() => handleSelectPlan("Teams", `${currentPrices.symbol}${teamPrice}`)}
              className="w-full py-3.5 px-6 rounded-full bg-neutral-950 hover:bg-neutral-800 text-white font-semibold text-sm transition-all shadow-md active:scale-[0.98] cursor-pointer"
            >
              Choose Team
            </button>
          </div>
        </div>

        {/* Student Trust Strip */}
        <div className="text-center mb-20">
          <span className="text-xs text-neutral-400 font-medium block mb-8">
            Trusted by over 2 million learners
          </span>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14 opacity-80">
            <StanfordSeal className="h-9 w-auto" />
            <HarvardSeal className="h-9 w-auto" />
            <PrincetonSeal className="h-9 w-auto" />
            <UCLASeal className="h-9 w-auto" />
          </div>
        </div>

        {/* Pricing FAQs */}
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-semibold text-neutral-900 mb-2">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500">
              Can&apos;t find the answer here?{" "}
              <button
                onClick={() =>
                  setModalState({
                    isOpen: true,
                    title: "Contact Support",
                    subtitle: "Our student support team typically replies within 2 hours at support@youlearn.ai",
                  })
                }
                className="underline hover:text-black font-medium"
              >
                Contact us
              </button>
            </p>
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

      {/* Checkout / Upgrade Modal */}
      <ModalDemo
        isOpen={modalState.isOpen}
        onClose={() => setModalState((prev) => ({ ...prev, isOpen: false }))}
        title={modalState.title}
        subtitle={modalState.subtitle}
      />
    </div>
  );
}
