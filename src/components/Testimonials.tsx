"use client";

import React from "react";
import { Star } from "lucide-react";

export function Testimonials() {
  const testimonials = [
    {
      quote:
        "I love this tool, like the YouTube video summarizer! I use it to learn concepts ranging from Econ to Quantum Mechanics, and it makes learning so much easier and more effective.",
      author: "Mihir Wadekar",
      role: "Product Engineer, Web3",
      avatar: "/avatars/mihir.webp",
    },
    {
      quote:
        "I definitely plan to experiment with YouLearn in my online course this summer to offer students an additional method of engagement with more complex topics.",
      author: "G. Shaw Jr.",
      role: "Assistant Professor, UNC",
      avatar: "/avatars/g-shaw.webp",
    },
    {
      quote:
        "I wish I had this when I was in school. Turning complex research papers into interactive study guides is incredible.",
      author: "Nasim Uddin",
      role: "Indiehacker, Independent",
      avatar: "/avatars/nasim.webp",
    },
    {
      quote:
        "Youlearn.ai is awesome , just used it to learn from a biotech roundtable discussion! Pinpoints methods and findings in seconds.",
      author: "Rohan Robinson",
      role: "Software Engineer, Independent",
      avatar: "/avatars/rohan.webp",
    },
    {
      quote:
        'This YouLearn site, with features like "Chat with PDF," has become an integral part of our daily workflow. It’s streamlined our process of understanding videos and PDFs.',
      author: "Jason Patel",
      role: "Writer",
      avatar: "/avatars/jason.webp",
    },
    {
      quote:
        "I use YouLearn on a daily basis now. It's streamlined my processes and improved how I learn materials.",
      author: "Kate Doe",
      role: "Content Manager",
      avatar: "/avatars/kate.webp",
    },
  ];

  return (
    <section className="w-full py-16 md:py-24 bg-white overflow-hidden select-none">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 mb-10 text-center">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-neutral-100 text-neutral-700 text-xs font-semibold uppercase tracking-wider mb-3">
          <span>Student &amp; Researcher Reviews</span>
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-[44px] font-semibold text-neutral-900 tracking-[-0.03em]">
          Loved by learners worldwide
        </h2>
      </div>

      {/* Infinite marquee row */}
      <div className="relative w-full overflow-hidden mask-[linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <div className="animate-marquee flex gap-6 sm:gap-7 items-stretch py-4">
          {[...testimonials, ...testimonials].map((item, idx) => (
            <div
              key={idx}
              className="w-[320px] sm:w-[380px] p-6 sm:p-7 rounded-[26px] bg-[#f8f9fa] border border-neutral-200/90 shadow-2xs hover:border-neutral-300 hover:shadow-md transition-all duration-300 flex flex-col justify-between shrink-0"
            >
              <div>
                {/* 5-star rating */}
                <div className="flex items-center gap-1 text-amber-400 mb-4" aria-label="5 stars">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                <p className="text-[14.5px] sm:text-[15.5px] text-neutral-800 font-normal leading-relaxed">
                  &ldquo;{item.quote}&rdquo;
                </p>
              </div>

              <div className="flex items-center gap-3.5 pt-5 mt-6 border-t border-neutral-200/70">
                <img
                  src={item.avatar}
                  alt={item.author}
                  className="w-11 h-11 rounded-full object-cover border border-neutral-200/80 shadow-2xs shrink-0"
                  loading="lazy"
                />
                <div>
                  <h3 className="text-[14px] sm:text-[15px] font-semibold text-neutral-900 leading-snug">
                    {item.author}
                  </h3>
                  <p className="text-xs text-neutral-500 leading-tight mt-0.5 font-normal">
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
