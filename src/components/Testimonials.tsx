"use client";

import React from "react";
import { Star } from "lucide-react";

export function Testimonials() {
  const testimonials = [
    {
      id: 1,
      quote:
        "LearnNova.ai is awesome , just used it to learn from a biotech roundtable discussion!",
      name: "Rohan Robinson",
      role: "Software Engineer, Independent",
      avatarInitials: "RR",
      avatarBg: "bg-blue-600",
    },
    {
      id: 2,
      quote:
        'This LearnNova site, with features like "Chat with PDF," has become an integral part of our daily workflow. It\'s streamlined our process of understanding videos and PDFs.',
      name: "Jason Patel",
      role: "Writer",
      avatarInitials: "JP",
      avatarBg: "bg-emerald-600",
    },
    {
      id: 3,
      quote:
        "I love this tool, like the YouTube video summarizer! I use it to learn concepts ranging from Econ to Quantum Mechanics, and it makes learning so much easier and more effective.",
      name: "Mihir Wadekar",
      role: "Product Engineer, Web3",
      avatarInitials: "MW",
      avatarBg: "bg-purple-600",
    },
    {
      id: 4,
      quote:
        "I definitely plan to experiment with LearnNova in my online course this summer to offer students an additional method of engagement with more complex topics.",
      name: "G. Shaw Jr.",
      role: "Assistant Professor, UNC",
      avatarInitials: "GS",
      avatarBg: "bg-amber-600",
    },
    {
      id: 5,
      quote:
        "I use LearnNova on a daily basis now. It's streamlined our research and greatly improved how I learn complex materials.",
      name: "Kate Doe",
      role: "Content Manager",
      avatarInitials: "KD",
      avatarBg: "bg-pink-600",
    },
    {
      id: 6,
      quote:
        "LearnNova turns 80-page slide decks into high-yield quizzes and flashcards in seconds. It saved me dozens of hours studying for board exams.",
      name: "Marcus Vance",
      role: "Medical Student",
      avatarInitials: "MV",
      avatarBg: "bg-indigo-600",
    },
  ];

  return (
    <section className="w-full py-16 md:py-24 overflow-hidden">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 mb-8 text-center sm:text-left flex items-center justify-between">
        <div>
          <span className="text-xs uppercase tracking-wider text-neutral-400 font-semibold block mb-1">
            Community Love
          </span>
          <h2 className="text-2xl sm:text-3xl font-semibold text-neutral-900 tracking-tight">
            Loved by learners and educators
          </h2>
        </div>
      </div>

      {/* Marquee Row */}
      <div className="relative w-full overflow-hidden">
        {/* Left & Right gradient fade masks */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 sm:w-28 bg-linear-to-r from-white to-transparent z-10" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 sm:w-28 bg-linear-to-l from-white to-transparent z-10" />

        <div className="animate-marquee flex gap-6 py-4">
          {[...testimonials, ...testimonials].map((item, index) => (
            <div
              key={`${item.id}-${index}`}
              className="w-[340px] sm:w-[380px] shrink-0 bg-[#f8f9fa] rounded-3xl p-7 border border-neutral-200/80 flex flex-col justify-between shadow-2xs hover:border-neutral-300 hover:shadow-md transition-all duration-200"
            >
              <div className="mb-6">
                <div className="flex items-center gap-1 text-amber-400 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <p className="text-[14.5px] sm:text-[15px] text-neutral-700 leading-relaxed font-normal">
                  &ldquo;{item.quote}&rdquo;
                </p>
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-neutral-200/60">
                <div
                  className={`w-9 h-9 rounded-full ${item.avatarBg} text-white flex items-center justify-center text-xs font-semibold shrink-0 shadow-xs`}
                >
                  {item.avatarInitials}
                </div>
                <div className="overflow-hidden">
                  <h4 className="text-sm font-semibold text-neutral-900 truncate">
                    {item.name}
                  </h4>
                  <p className="text-xs text-neutral-500 truncate">{item.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
