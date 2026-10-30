"use client";

import React, { useState } from "react";
import { X, Sparkles, CheckCircle2, ArrowRight } from "lucide-react";
import { LearnNovaLogo } from "./Icons";

interface ModalDemoProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle: string;
}

export function ModalDemo({ isOpen, onClose, title, subtitle }: ModalDemoProps) {
  const [email, setEmail] = useState("");
  const [joined, setJoined] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setJoined(true);
    }
  };

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

          <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mb-4">
            <Sparkles className="w-6 h-6" />
          </div>

          <h3 className="text-xl font-bold text-neutral-900 mb-2">{title}</h3>
          <p className="text-sm text-neutral-600 mb-6 leading-relaxed">{subtitle}</p>

          {joined ? (
            <div className="w-full bg-emerald-50 rounded-2xl p-5 border border-emerald-200 text-center space-y-2 mb-4 animate-in fade-in">
              <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h4 className="font-semibold text-emerald-950 text-sm">You&apos;re on the priority list!</h4>
              <p className="text-xs text-emerald-800">
                We will email you at <strong>{email}</strong> the moment Pro tier launches with unlimited quotas.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="w-full space-y-3 mb-4">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-3 rounded-2xl border border-neutral-200 text-sm focus:outline-none focus:border-neutral-900 text-neutral-900"
              />
              <button
                type="submit"
                className="w-full py-3 px-6 rounded-full bg-neutral-950 hover:bg-neutral-800 text-white font-medium text-sm transition-all shadow-md active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Notify Me</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          <button
            onClick={onClose}
            className="text-xs text-neutral-500 hover:text-neutral-800 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
