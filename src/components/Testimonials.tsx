"use client";

import React from "react";

export function Testimonials() {
  const testimonials = [
    {
      quote:
        "Youlearn.ai is awesome , just used it to learn from a biotech roundtable discussion!",
      author: "Rohan Robinson",
      role: "Software Engineer, Independent",
      avatarBg: "#3B82F6",
      avatarLetter: "R",
    },
    {
      quote:
        'This YouLearn site, with features like "Chat with PDF," has become an integral part of our daily workflow. It\'s streamlined our process of understanding videos and PDFs.',
      author: "Jason Patel",
      role: "Writer",
      avatarBg: "#111827",
      avatarLetter: "J",
    },
    {
      quote:
        "I use YouLearn on a daily basis to study from lecture recordings and academic papers. It has completely transformed my prep speed and exam confidence.",
      author: "Kaitlyn S.",
      role: "Medical Student, Johns Hopkins",
      avatarBg: "#EC4899",
      avatarLetter: "K",
    },
    {
      quote:
        "Being able to ask questions directly to an AI tutor grounded in my course slides saves me hours every single week.",
      author: "Mihir Wadekar",
      role: "Product Engineer, Web3",
      avatarBg: "#10B981",
      avatarLetter: "M",
    },
  ];

  return (
    <section className="w-full py-16 md:py-24 bg-white overflow-hidden">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((item, idx) => (
            <div
              key={idx}
              className="p-7 sm:p-8 rounded-3xl bg-[#f8f9fa] border border-neutral-200/80 shadow-2xs hover:border-neutral-300 hover:shadow-xs transition-all duration-200 flex flex-col justify-between"
            >
              <p className="text-[15px] sm:text-[16px] text-neutral-800 font-normal leading-relaxed mb-8">
                &ldquo;{item.quote}&rdquo;
              </p>

              <div className="flex items-center gap-3 pt-4 border-t border-neutral-200/60">
                <div
                  className="w-10 h-10 rounded-full shrink-0 flex items-center justify-center text-white font-bold text-sm"
                  style={{ backgroundColor: item.avatarBg }}
                  aria-hidden="true"
                >
                  {item.avatarLetter}
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-neutral-900 leading-snug">
                    {item.author}
                  </h3>
                  <p className="text-xs text-neutral-500 leading-tight mt-0.5">
                    {item.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

