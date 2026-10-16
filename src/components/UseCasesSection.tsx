"use client";

import React, { useState } from "react";
import { ArrowUpRight, Play } from "lucide-react";

interface UseCasesSectionProps {
  onOpenDemo: (title: string, subtitle: string) => void;
}

export function UseCasesSection({ onOpenDemo }: UseCasesSectionProps) {
  const [activeItem, setActiveItem] = useState<number | null>(null);

  const useCases = [
    {
      id: 1,
      title: "The Genetic Code and Translation",
      subtitle: "DNA translates to protein sequences.",
      tag: "Biology Course",
      renderThumbnail: () => (
        <div className="w-full h-48 bg-linear-to-br from-emerald-50 via-teal-50/50 to-neutral-50 p-4 flex flex-col justify-between border-b border-neutral-200/80 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-neutral-500 font-mono">
            <span className="bg-white/80 px-2 py-0.5 rounded shadow-2xs">PDF Document</span>
            <span className="text-emerald-700 font-bold text-lg">11</span>
          </div>

          <div className="relative z-10">
            <div className="text-[15px] font-bold text-neutral-900 leading-tight font-serif mb-1">
              The Genetic Code &amp; Translation
            </div>
            <div className="text-[11px] text-neutral-600 line-clamp-2">
              <span className="font-semibold text-emerald-800">Goal:</span> To understand how mRNA is translated into protein. At the heart of the central dogma is...
            </div>
          </div>

          {/* Graphical decorative ribbon */}
          <svg className="absolute -right-4 -bottom-6 w-32 h-32 opacity-20 text-emerald-700" viewBox="0 0 100 100" fill="currentColor">
            <path d="M10 50 Q 30 20, 50 50 T 90 50" stroke="currentColor" strokeWidth="8" fill="none" />
            <path d="M10 50 Q 30 80, 50 50 T 90 50" stroke="currentColor" strokeWidth="4" fill="none" />
          </svg>
        </div>
      ),
    },
    {
      id: 2,
      title: "Introduction to the Human Brain",
      subtitle: "MIT 9.13 The Human Brain, Spring 2019",
      tag: "MIT OpenCourseWare",
      renderThumbnail: () => (
        <div className="w-full h-48 bg-linear-to-br from-neutral-800 to-neutral-950 p-4 flex flex-col justify-between border-b border-neutral-200/80 relative overflow-hidden group">
          <div className="flex items-center justify-between text-xs text-neutral-400 font-mono">
            <span className="bg-neutral-900/80 text-neutral-300 px-2 py-0.5 rounded">Video Lecture</span>
            <span className="text-red-400 font-mono text-[11px]">MIT 9.13</span>
          </div>

          {/* Professor Figure Graphics */}
          <div className="flex items-center justify-center py-2 relative z-10">
            <div className="w-20 h-20 rounded-full bg-neutral-700 border-2 border-neutral-500 flex items-center justify-center text-white font-semibold text-xl shadow-lg relative">
              <span className="font-serif">NK</span>
              <div className="absolute inset-0 m-auto w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white">
                <Play className="w-3.5 h-3.5 fill-white ml-0.5" />
              </div>
            </div>
          </div>

          <div className="relative z-10 text-center">
            <span className="text-xs text-neutral-300 font-medium">Prof. Nancy Kanwisher • Neuroscience</span>
          </div>
        </div>
      ),
    },
    {
      id: 3,
      title: "Teaching CS50 with AI",
      subtitle: "Leveraging Generative AI in Computer Science",
      tag: "Harvard Research Paper",
      renderThumbnail: () => (
        <div className="w-full h-48 bg-white p-4 flex flex-col justify-between border-b border-neutral-200/80 relative overflow-hidden font-serif">
          <div className="flex items-center justify-between text-[10px] text-neutral-500 uppercase font-sans tracking-wider">
            <span>ACM SIGCSE 2024</span>
            <span className="text-red-700 font-bold">HARVARD</span>
          </div>

          <div className="space-y-1.5 my-auto">
            <div className="text-[12px] font-bold text-neutral-900 leading-tight">
              Leveraging Generative Artificial Intelligence in Computer Science Education
            </div>
            <div className="text-[9.5px] text-neutral-600 font-sans line-clamp-3 leading-relaxed">
              <strong>ABSTRACT:</strong> In Summer 2023, we developed and integrated a suite of AI-based software tools into CS50 at Harvard University...
            </div>
          </div>

          <div className="text-[9px] text-neutral-400 font-sans flex items-center justify-between">
            <span>David J. Malan et al.</span>
            <span>7 pages</span>
          </div>
        </div>
      ),
    },
  ];

  return (
    <section className="w-full max-w-[1240px] mx-auto px-4 sm:px-6 py-12 md:py-16">
      {/* Section Title */}
      <div className="text-center max-w-xl mx-auto mb-10 sm:mb-12">
        <h2 className="text-3xl sm:text-4xl md:text-[44px] font-semibold text-neutral-900 tracking-[-0.03em] mb-3">
          Built for any use case
        </h2>
        <p className="text-base sm:text-[17px] text-neutral-500 font-normal">
          Click on a learning content below, and start your learning journey ⤵
        </p>
      </div>

      {/* 3 Use Case Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-7">
        {useCases.map((item) => (
          <div
            key={item.id}
            onClick={() => {
              setActiveItem(item.id);
              onOpenDemo(item.title, `Explore the interactive study notes, quizzes, and AI tutor for ${item.title}.`);
            }}
            className={`group bg-white rounded-3xl border overflow-hidden shadow-xs hover:shadow-xl hover:border-neutral-300 transition-all duration-300 flex flex-col justify-between cursor-pointer ${
              activeItem === item.id ? "ring-2 ring-neutral-900 border-transparent" : "border-neutral-200/90"
            }`}
          >
            {/* Thumbnail Preview Area */}
            {item.renderThumbnail()}

            {/* Bottom Content Area */}
            <div className="p-6">
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="text-lg sm:text-[19px] font-semibold text-neutral-900 tracking-tight leading-snug group-hover:text-black transition-colors">
                  {item.title}
                </h3>
                <div className="w-7 h-7 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-500 group-hover:bg-neutral-900 group-hover:text-white transition-all shrink-0">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </div>
              </div>

              <p className="text-neutral-500 text-sm leading-relaxed">
                {item.subtitle}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
