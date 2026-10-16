"use client";

import React, { useState } from "react";
import { 
  BookOpen, 
  Layers, 
  Send, 
  Paperclip, 
  Mic, 
  Camera, 
  RotateCcw, 
  ChevronDown, 
  CornerDownRight, 
  X,
  Highlighter,
  Link2,
  Trash2
} from "lucide-react";

export function HeroProductPreview() {
  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [showPopup, setShowPopup] = useState(true);
  const [activeMode, setActiveMode] = useState<"study" | "flashcards">("study");

  const handlePromptClick = (prompt: string) => {
    setSelectedPrompt(prompt);
    if (prompt.includes("hint")) {
      setFeedback("💡 Hint: Think about 'A-P-E' — the letters stand for Aminoacyl, Peptidyl, and Exit!");
    } else if (prompt.includes("Walk me")) {
      setFeedback("📖 Walkthrough: During translation, incoming charged tRNA arrives at the A site, peptide bond forms at the P site, and uncharged tRNA departs through the E site.");
    } else if (prompt.includes("simple")) {
      setFeedback("✨ Simplified: Just remember the acronym APE — Arrival, Protein peptide bond, and Exit!");
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!userAnswer.trim()) {
      setFeedback("💡 Enter 'A, P, and E' or click 'Don't know' to reveal the three ribosome sites.");
      return;
    }
    const clean = userAnswer.toLowerCase();
    if (clean.includes("a") && clean.includes("p") && clean.includes("e")) {
      setFeedback("🎉 Correct! The A (aminoacyl), P (peptidyl), and E (exit) sites.");
    } else {
      setFeedback("Not quite! The correct answer is A (aminoacyl), P (peptidyl), and E (exit).");
    }
  };

  const handleDontKnow = () => {
    setFeedback("Answer: The A (aminoacyl), P (peptidyl), and E (exit) sites. Ribosomes coordinate these 3 sites as elongation factors move the mRNA along.");
  };

  return (
    <section className="w-full max-w-[1240px] mx-auto px-4 sm:px-6 pb-20">
      <div className="w-full bg-[#f8f9fa] rounded-3xl sm:rounded-[36px] border border-neutral-200/90 shadow-xl overflow-hidden p-3 sm:p-5 lg:p-6 transition-all duration-300">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-stretch">
          
          {/* Left Pane: Study Document (Biochemistry Textbook) */}
          <div className="lg:col-span-7 bg-white rounded-2xl sm:rounded-[28px] border border-neutral-200/80 p-5 sm:p-7 flex flex-col justify-between shadow-2xs overflow-hidden text-neutral-800">
            {/* Document Header Bar */}
            <div className="flex items-center justify-between pb-4 border-b border-neutral-100 mb-5 text-xs text-neutral-500 font-mono">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-400"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                <span className="ml-2 font-sans font-medium text-neutral-700">Molecular Biology • Chapter 11</span>
              </div>
              <div className="flex items-center gap-3">
                <button className="hover:text-neutral-900 transition-colors p-1" title="Highlight">
                  <Highlighter className="w-3.5 h-3.5 text-neutral-400 hover:text-amber-500" />
                </button>
                <button className="hover:text-neutral-900 transition-colors p-1" title="Reference Link">
                  <Link2 className="w-3.5 h-3.5 text-neutral-400 hover:text-blue-500" />
                </button>
                <span className="bg-neutral-100 px-2 py-0.5 rounded text-[11px] font-medium text-neutral-600">Page 4 of 24</span>
              </div>
            </div>

            {/* Document Body */}
            <div className="space-y-4 text-xs sm:text-[13.5px] leading-relaxed text-neutral-700 font-sans">
              <h3 className="text-base sm:text-[17px] font-semibold text-neutral-900 tracking-tight">
                Transfer RNAs are adaptors between codons and amino acids
              </h3>

              <p>
                How are the 61 codons that specify amino acids deciphered such that each directs the incorporation of the appropriate, cognate amino acid? The answer is that codons are recognized by adaptor molecules known as <strong className="text-neutral-900 font-semibold">transfer RNAs or tRNAs</strong>. In contrast to mRNAs, tRNAs are non-protein-coding RNAs that directly act as adaptors between mRNA codons and nascent peptide chains.
              </p>

              {/* Highlighted text block with YouLearn green study highlight */}
              <div className="p-3.5 sm:p-4 rounded-xl bg-emerald-50/90 border-l-3 border-emerald-500 text-emerald-950 my-3 font-medium">
                <p>
                  Some tRNAs recognize more than one synonymous codon. This is possible due to a phenomenon known as <span className="underline decoration-emerald-500 font-semibold">wobble</span>, which takes advantage of the fact that synonymous codons often differ from each other at the third (3&apos;) position.
                </p>
              </div>

              {/* Molecular Structure Graphic Simulation */}
              <div className="grid grid-cols-2 gap-3 py-2 bg-neutral-50/70 rounded-xl p-3 border border-neutral-100">
                <div className="flex flex-col items-center justify-center p-2 text-center">
                  <svg viewBox="0 0 100 70" className="w-24 sm:w-28 h-auto">
                    <polygon points="50,15 70,25 70,45 50,55 30,45 30,25" fill="none" stroke="#334155" strokeWidth="1.8" />
                    <circle cx="50" cy="15" r="3" fill="#ef4444" />
                    <circle cx="70" cy="25" r="3" fill="#3b82f6" />
                    <circle cx="70" cy="45" r="3" fill="#10b981" />
                    <circle cx="50" cy="55" r="3" fill="#6366f1" />
                    <circle cx="30" cy="45" r="3" fill="#f59e0b" />
                    <line x1="70" y1="25" x2="88" y2="20" stroke="#334155" strokeWidth="1.5" />
                    <text x="50" y="38" fontSize="8" textAnchor="middle" fill="#64748b" fontWeight="600">tRNA Loop</text>
                  </svg>
                  <span className="text-[11px] font-mono text-neutral-500 mt-1">(A) Inosine Wobble Base</span>
                </div>

                <div className="flex flex-col items-center justify-center p-2 text-center border-l border-neutral-200">
                  <svg viewBox="0 0 100 70" className="w-24 sm:w-28 h-auto">
                    <path d="M20 55 C20 30 35 30 50 15 C65 30 80 30 80 55" fill="none" stroke="#0ea5e9" strokeWidth="2.2" />
                    <line x1="35" y1="42" x2="65" y2="42" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="3 2" />
                    <line x1="38" y1="48" x2="62" y2="48" stroke="#10b981" strokeWidth="1.5" strokeDasharray="3 2" />
                    <circle cx="50" cy="15" r="4" fill="#0284c7" />
                    <text x="50" y="65" fontSize="7.5" textAnchor="middle" fill="#64748b">Anticodon Arm</text>
                  </svg>
                  <span className="text-[11px] font-mono text-neutral-500 mt-1">(B) Codon-Anticodon Pairing</span>
                </div>
              </div>

              <p className="text-neutral-600 text-xs">
                tRNAs are approximately 80 nucleotides in length. They fold into precise L-shaped tertiary structures via Watson-Crick and non-canonical base pairing.
              </p>
            </div>

            {/* Document Footer */}
            <div className="pt-4 mt-4 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-400">
              <span className="font-serif italic text-neutral-600">The Genetic Code &amp; Translation</span>
              <span className="font-mono font-bold text-neutral-800">4</span>
            </div>
          </div>

          {/* Right Pane: AI Tutor & Quiz Assistant */}
          <div className="lg:col-span-5 bg-white rounded-2xl sm:rounded-[28px] border border-neutral-200/80 p-5 sm:p-6 flex flex-col justify-between shadow-2xs relative">
            
            {/* Top Bar: Progress and actions */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-semibold text-neutral-900 bg-neutral-100 px-2.5 py-1 rounded-md">
                    1 of 18
                  </span>
                  <div className="w-28 h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                    <div className="w-1/6 h-full bg-emerald-500 rounded-full"></div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-neutral-400">
                  <button 
                    onClick={() => {
                      setUserAnswer("");
                      setFeedback(null);
                      setSelectedPrompt(null);
                    }}
                    className="p-1.5 hover:text-neutral-700 transition-colors" 
                    title="Reset Question"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={handleDontKnow}
                    className="p-1.5 hover:text-neutral-700 transition-colors"
                    title="Reveal Answer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Active Quiz Question */}
              <div className="mb-4">
                <p className="text-[14.5px] sm:text-[15px] font-medium text-neutral-900 leading-snug">
                  The three sites on the ribosome that bind tRNAs during translation are the <span className="inline-block w-12 border-b-2 border-neutral-400 mx-1"></span>, <span className="inline-block w-12 border-b-2 border-neutral-400 mx-1"></span>, and <span className="inline-block w-12 border-b-2 border-neutral-400 mx-1"></span> sites.
                </p>
              </div>

              {/* Answer Input and Submit Row */}
              <div className="flex items-center gap-2 mb-3">
                <input
                  type="text"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  placeholder="Type your answer..."
                  className="flex-1 bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white transition-all"
                />
                <button
                  onClick={handleDontKnow}
                  className="px-3 py-2 rounded-xl border border-neutral-200 text-xs font-medium text-neutral-600 hover:bg-neutral-50 transition-colors cursor-pointer"
                >
                  Don&apos;t know
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-black text-white text-xs font-medium transition-all shadow-xs active:scale-95 cursor-pointer"
                >
                  Submit
                </button>
              </div>

              {/* Feedback Alert if active */}
              {feedback && (
                <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200/90 text-xs text-neutral-800 animate-in fade-in duration-200 mb-3">
                  {feedback}
                </div>
              )}

              {/* Quick AI Prompts */}
              <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4">
                <button
                  onClick={() => handlePromptClick("hint")}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                    selectedPrompt === "hint"
                      ? "bg-neutral-900 text-white"
                      : "bg-neutral-100/90 hover:bg-neutral-200/80 text-neutral-700"
                  }`}
                >
                  <CornerDownRight className="w-3 h-3" />
                  <span>Give me a hint</span>
                </button>

                <button
                  onClick={() => handlePromptClick("Walk me")}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                    selectedPrompt === "Walk me"
                      ? "bg-neutral-900 text-white"
                      : "bg-neutral-100/90 hover:bg-neutral-200/80 text-neutral-700"
                  }`}
                >
                  <CornerDownRight className="w-3 h-3" />
                  <span>Walk me through it</span>
                </button>

                <button
                  onClick={() => handlePromptClick("simple")}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                    selectedPrompt === "simple"
                      ? "bg-neutral-900 text-white"
                      : "bg-neutral-100/90 hover:bg-neutral-200/80 text-neutral-700"
                  }`}
                >
                  <CornerDownRight className="w-3 h-3" />
                  <span>Keep it simple</span>
                </button>
              </div>
            </div>

            {/* Context Floating Popover Overlay (as shown in reference screenshot) */}
            {showPopup && (
              <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-neutral-200 shadow-xl p-3.5 my-2 animate-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                    Chat instructions
                  </span>
                  <button 
                    onClick={() => setShowPopup(false)}
                    className="text-neutral-400 hover:text-neutral-700 p-0.5"
                    title="Dismiss"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-1 mb-2.5">
                  <button
                    onClick={() => setActiveMode("study")}
                    className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors text-left ${
                      activeMode === "study"
                        ? "bg-red-50 text-red-700 border border-red-200"
                        : "hover:bg-neutral-100 text-neutral-700"
                    }`}
                  >
                    <BookOpen className="w-3.5 h-3.5 text-red-600" />
                    <span>Study Mode</span>
                  </button>

                  <button
                    onClick={() => setActiveMode("flashcards")}
                    className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors text-left ${
                      activeMode === "flashcards"
                        ? "bg-blue-50 text-blue-700 border border-blue-200"
                        : "hover:bg-neutral-100 text-neutral-700"
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5 text-neutral-700" />
                    <span>Flashcards</span>
                  </button>
                </div>

                <div className="bg-neutral-50 rounded-lg p-2 text-[11px] text-neutral-600 border border-neutral-100 font-mono flex items-center justify-between">
                  <span className="truncate">tRNAs are... regions of self-complementarity</span>
                  <span className="text-[10px] text-neutral-400 ml-2">create @flas</span>
                </div>
              </div>
            )}

            {/* Bottom Chat Bar with Model Selector and Actions */}
            <div className="bg-neutral-50 rounded-2xl p-2 sm:p-2.5 border border-neutral-200 mt-2">
              <div className="flex items-center justify-between px-2 pb-2">
                <input
                  type="text"
                  placeholder="Learn anything"
                  className="w-full bg-transparent text-xs sm:text-[13px] text-neutral-800 placeholder-neutral-400 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-neutral-200/60 text-xs">
                {/* Model and Mode Badges */}
                <div className="flex items-center gap-1.5">
                  <div className="flex items-center gap-1 bg-white px-2 py-0.5 rounded-md border border-neutral-200 text-neutral-700 text-[11px] font-medium shadow-2xs">
                    <span>GPT-5</span>
                    <ChevronDown className="w-3 h-3 text-neutral-400" />
                  </div>
                  <div className="bg-white px-1.5 py-0.5 rounded-md border border-neutral-200 text-neutral-500 text-[11px]">
                    @
                  </div>
                  <div className="flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 text-emerald-800 text-[11px] font-medium">
                    <span>Learn+</span>
                    <button className="hover:text-emerald-950">
                      <X className="w-2.5 h-2.5" />
                    </button>
                  </div>
                </div>

                {/* Media and send buttons */}
                <div className="flex items-center gap-1.5 text-neutral-400">
                  <button className="p-1 hover:text-neutral-700 transition-colors" title="Camera">
                    <Camera className="w-3.5 h-3.5" />
                  </button>
                  <button className="p-1 hover:text-neutral-700 transition-colors" title="Attach file">
                    <Paperclip className="w-3.5 h-3.5" />
                  </button>
                  <button className="p-1 hover:text-neutral-700 transition-colors" title="Voice dictation">
                    <Mic className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={handleSubmit}
                    className="w-6 h-6 rounded-full bg-neutral-900 text-white flex items-center justify-center hover:bg-black transition-transform active:scale-90 shadow-2xs ml-0.5"
                    title="Send"
                  >
                    <Send className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
