"use client";

import React from "react";
import { FileText, Video, Mic, Sparkles, BookOpen, Layers } from "lucide-react";

export function TrustedBy() {
  const formats = [
    { icon: FileText, label: "PDF Slides & Textbooks", desc: "Page-by-page citation extraction" },
    { icon: Video, label: "YouTube Lectures", desc: "Transcript timestamps & chapters" },
    { icon: Layers, label: "Active Recall Flashcards", desc: "Interactive 3D flip with spaced review" },
    { icon: BookOpen, label: "Practice Exams", desc: "Server-graded multiple choice questions" },
    { icon: Mic, label: "Lecture Transcripts", desc: "Audio notes summarized in seconds" },
  ];

  return (
    <section className="w-full max-w-[1240px] mx-auto px-6 py-12 md:py-16 text-center select-none overflow-hidden border-y border-neutral-100 bg-neutral-50/50">
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-200/60 text-[11px] font-semibold text-neutral-600 uppercase tracking-wider mb-3">
        <Sparkles className="w-3 h-3 text-neutral-800" />
        <span>Supported Formats & Study Engines</span>
      </div>

      <h2 className="text-xl sm:text-[22px] md:text-[24px] font-semibold text-neutral-900 mb-8 tracking-tight max-w-2xl mx-auto">
        Designed for rigorous study, active recall, and source-grounded mastery
      </h2>

      {/* Grid of supported learning workflows */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {formats.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-white border border-neutral-200/80 shadow-2xs text-left hover:border-neutral-300 transition-all duration-200 flex flex-col justify-between"
            >
              <div className="w-8 h-8 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-800 mb-3">
                <Icon className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-neutral-900 leading-snug">{item.label}</p>
                <p className="text-[11px] text-neutral-500 mt-1 leading-normal">{item.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
