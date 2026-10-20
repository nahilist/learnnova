"use client";

import React from "react";
import { CheckCircle2, ShieldCheck, Zap, BookOpen, Layers } from "lucide-react";

export function Testimonials() {
  const pillars = [
    {
      icon: ShieldCheck,
      badge: "Grounded In Source",
      title: "Verifiable Page Citations",
      desc: "Never wonder where an answer came from. LearnNova AI quotes exact page numbers and paragraphs from your uploaded textbook or lecture slides so you can verify facts instantly.",
    },
    {
      icon: Layers,
      badge: "Active Recall",
      title: "Spaced Repetition Flashcards",
      desc: "Turn dense 80-page slide decks into high-yield flashcard decks. Flip cards, mark what you know, and reinforce weak spots before exam day.",
    },
    {
      icon: BookOpen,
      badge: "Exam Simulation",
      title: "Server-Graded Practice Quizzes",
      desc: "Generate conceptual practice exams tailored to your syllabus. Scores and detailed rationales are calculated server-side to simulate real exam conditions.",
    },
    {
      icon: Zap,
      badge: "Ultra-Fast AI",
      title: "Immediate Tutoring Feedback",
      desc: "Powered by Groq's high-speed inference, get answers in sub-seconds. Break down formulas, request step-by-step math derivations, or ask for analogies.",
    },
  ];

  return (
    <section className="w-full py-16 md:py-24 bg-white overflow-hidden border-t border-neutral-100">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-wider text-neutral-400 font-semibold block mb-2">
            The LearnNova Learning Framework
          </span>
          <h2 className="text-3xl sm:text-4xl font-semibold text-neutral-900 tracking-tight">
            Built for deep comprehension, not just surface summaries
          </h2>
          <p className="text-sm sm:text-base text-neutral-500 mt-3 leading-relaxed">
            Passive reading leads to quick forgetting. LearnNova uses proven active recall and Socratic testing methodologies.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="p-7 rounded-3xl bg-[#fafafa] border border-neutral-200/80 shadow-2xs hover:border-neutral-300 transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-9 h-9 rounded-xl bg-neutral-900 text-white flex items-center justify-center">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      {pillar.badge}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                    {pillar.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-neutral-200/60 flex items-center gap-2 text-xs text-neutral-500 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Available on Free Starter Tier</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
