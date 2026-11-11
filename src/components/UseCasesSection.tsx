"use client";

import React from "react";
import Link from "next/link";

export function UseCasesSection() {
  const useCases = [
    {
      id: 1,
      slug: "f0264fa07121",
      title: "The Genetic Code and Translation",
      subtitle: "DNA translates to protein sequences.",
      image: "/genetic.webp",
    },
    {
      id: 2,
      slug: "mit-brain",
      title: "Introduction to the Human Brain",
      subtitle: "MIT 9.13 The Human Brain, Spring 2019",
      image: "/pic.webp",
    },
    {
      id: 3,
      slug: "cs50-ai",
      title: "Teaching CS50 with AI",
      subtitle: "Leveraging Generative AI in Computer Science",
      image: "/ai.webp",
    },
  ];

  return (
    <section id="use-cases" className="w-full max-w-[1240px] mx-auto px-4 sm:px-6 py-16 md:py-20">
      {/* Section Title & Subtitle */}
      <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
        <h2 className="text-3xl sm:text-4xl md:text-[44px] font-semibold text-neutral-900 tracking-[-0.03em] mb-3">
          Built for any use case
        </h2>
        <p className="text-base sm:text-[17px] text-neutral-500 font-normal">
          Click on a learning content below, and start your learning journey ⤵
        </p>
      </div>

      {/* 3 Use Case Cards matching user reference */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-7 lg:gap-8">
        {useCases.map((item) => (
          <Link
            key={item.id}
            href={`/content/${item.slug}`}
            className="group block cursor-pointer"
          >
            {/* Thumbnail Preview Area with rounded corners and aspect ratio */}
            <div className="w-full aspect-[16/10] sm:aspect-[1.62/1] rounded-[22px] overflow-hidden border border-neutral-200/90 shadow-2xs group-hover:shadow-xl group-hover:border-neutral-300 transition-all duration-300 relative bg-neutral-100">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500 ease-out"
                loading="lazy"
              />
            </div>

            {/* Bottom Content Area: Title & Subtitle below the thumbnail */}
            <div className="mt-4 sm:mt-5 text-left">
              <h3 className="text-lg sm:text-[19px] font-semibold text-neutral-900 tracking-[-0.015em] leading-snug group-hover:text-black transition-colors">
                {item.title}
              </h3>
              <p className="text-sm sm:text-[15px] text-neutral-500 font-normal leading-relaxed mt-1">
                {item.subtitle}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
