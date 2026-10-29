"use client";

import React from "react";
import { X, Sparkles, CheckCircle2 } from "lucide-react";
import { LearnNovaLogo } from "./Icons";

interface ModalDemoProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle: string;
}

export function ModalDemo({ isOpen, onClose, title, subtitle }: ModalDemoProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-md w-full p-7 shadow-2xl border border-neutral-100 relative transition-all scale-100 animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-neutral-600 transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="mb-4">
            <LearnNovaLogo />
          </div>

          <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-200 flex items-center justify-center text-[#ff6600] mb-4">
            <Sparkles className="w-6 h-6" />
          </div>

          <h3 className="text-xl font-bold text-neutral-900 mb-2">{title}</h3>
          <p className="text-sm text-neutral-600 mb-6 leading-relaxed">{subtitle}</p>

          <div className="w-full bg-neutral-50 rounded-2xl p-4 border border-neutral-100 text-left mb-6 space-y-2.5">
            <div className="flex items-center gap-2.5 text-xs text-neutral-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Full interactive demo mode enabled</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-neutral-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>AI Tutor & quiz generation ready</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-neutral-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Multi-format uploads (PDF, YouTube, Audio)</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full py-3 px-6 rounded-full bg-neutral-950 hover:bg-neutral-800 text-white font-medium text-sm transition-all shadow-md active:scale-[0.98]"
          >
            Explore Interactive Demo
          </button>
        </div>
      </div>
    </div>
  );
}
