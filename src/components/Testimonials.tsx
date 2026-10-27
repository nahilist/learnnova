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
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    },
    {
      quote:
        'This YouLearn site, with features like "Chat with PDF," has become an integral part of our daily workflow. It\'s streamlined our process of understanding videos and PDFs.',
      author: "Jason Patel",
      role: "Writer",
      avatarBg: "#111827",
      avatarLetter: "J",
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    },
    {
      quote:
        "I use YouLearn on a daily basis to study from lecture recordings and academic papers. It has completely transformed my prep speed and exam confidence.",
      author: "Kaitlyn S.",
      role: "Medical Student, Johns Hopkins",
      avatarBg: "#EC4899",
      avatarLetter: "K",
      avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    },
    {
      quote:
        "Being able to ask questions directly to an AI tutor grounded in my course slides saves me hours every single week.",
      author: "Mihir Wadekar",
      role: "Product Engineer, Web3",
      avatarBg: "#10B981",
      avatarLetter: "M",
      avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
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
                <div className="w-10 h-10 rounded-full overflow-hidden bg-neutral-200 shrink-0 border border-neutral-300/80">
                  <img
                    src={item.avatarUrl}
                    alt={item.author}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback to letter avatar if network image is unavailable
                      e.currentTarget.style.display = "none";
                      if (e.currentTarget.parentElement) {
                        e.currentTarget.parentElement.style.backgroundColor = item.avatarBg;
                        e.currentTarget.parentElement.innerText = item.avatarLetter;
                        e.currentTarget.parentElement.className =
                          "w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0";
                      }
                    }}
                  />
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

