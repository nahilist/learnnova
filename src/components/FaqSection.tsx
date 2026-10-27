"use client";

import React, { useState } from "react";
import { Plus, X } from "lucide-react";

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "What is YouLearn?",
      answer:
        "YouLearn is an AI tutor personalized to each student. It turns your learning materials into notes, interactive chats, quizzes, flashcards, podcasts, and personalized practice tests.",
    },
    {
      question: "How does YouLearn help me study for exams?",
      answer:
        "YouLearn helps you study for exams by turning dense class materials into clear notes, quizzes, and practice tests, so you can understand faster, review smarter, and remember more.",
    },
    {
      question: "What kinds of materials can I use with YouLearn?",
      answer:
        "You can upload PDFs, lecture slides, YouTube videos, recorded lectures, photos, and text to create study tools from the materials you already use.",
    },
    {
      question: "Can I ask questions and chat with my materials?",
      answer:
        "Yes. YouLearn includes an AI tutor that understands your materials and helps explain confusing topics, answer questions, and guide your studying.",
    },
    {
      question: "Does YouLearn make quizzes, flashcards, and practice tests?",
      answer:
        "Yes. YouLearn generates quizzes, flashcards, and personalized tests from your materials so you can actively practice and prepare for exams.",
    },
    {
      question: "Is YouLearn free to use?",
      answer:
        "Yes. YouLearn offers free access to get started, with paid plans for higher limits and more advanced features.",
    },
  ];

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="w-full max-w-[1040px] mx-auto px-4 sm:px-6 py-16 md:py-24">
      {/* Title */}
      <div className="text-center mb-10 sm:mb-12">
        <h2 className="text-3xl sm:text-4xl md:text-[46px] font-semibold text-neutral-900 tracking-[-0.03em]">
          FAQs
        </h2>
      </div>

      {/* Accordion Container Box */}
      <div className="bg-[#f3f4f6] rounded-3xl sm:rounded-[36px] border border-neutral-200/90 p-5 sm:p-8 md:p-10 shadow-xs">
        <div className="divide-y divide-neutral-200/90">
          {faqs.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={index} className="py-5 sm:py-6 first:pt-2 last:pb-2">
                <button
                  onClick={() => toggle(index)}
                  className="w-full flex items-start sm:items-center justify-between text-left gap-4 group cursor-pointer focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center gap-4 sm:gap-5 flex-1">
                    <span className="w-5 h-5 flex items-center justify-center text-neutral-400 group-hover:text-neutral-700 transition-colors shrink-0 mt-0.5 sm:mt-0">
                      {isOpen ? (
                        <X className="w-4 h-4 text-neutral-600 transition-transform duration-200" />
                      ) : (
                        <Plus className="w-4 h-4 text-neutral-400 transition-transform duration-200" />
                      )}
                    </span>
                    <span className="text-base sm:text-[17.5px] font-medium text-neutral-900 group-hover:text-black transition-colors leading-snug">
                      {item.question}
                    </span>
                  </div>
                </button>

                {isOpen && (
                  <div className="pl-9 sm:pl-10 pr-2 pt-3.5 sm:pt-4 text-neutral-600 text-sm sm:text-[15px] leading-relaxed animate-in fade-in slide-in-from-top-1 duration-200 font-normal">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
