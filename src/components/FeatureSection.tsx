"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { 
  MessageSquare, 
  Upload, 
  Sparkles, 
  Mic, 
  Play, 
  Menu, 
  FileText, 
  Video, 
  FileSpreadsheet, 
  Headphones 
} from "lucide-react";

const YOUTUBE_SUMMARY_VIDEO =
  "https://learnnova.s3.us-east-1.amazonaws.com/yoytube_summary.mp4";

export function FeatureSection() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTab, setActiveTab] = useState<"chat" | "flashcards">("chat");
  const [activeSubTab, setActiveSubTab] = useState<"transcript" | "chapters">("transcript");
  const videoRef = useRef<HTMLVideoElement>(null);

  const toggleVideoPlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  return (
    <section id="features" className="w-full max-w-[1240px] mx-auto px-4 sm:px-6 py-16 md:py-24">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-neutral-900 tracking-[-0.03em] mb-4">
          Save hours, learn smarter.
        </h2>
        <p className="text-base sm:text-lg md:text-[19px] text-neutral-500 font-normal">
          From key takeaways to specific questions, we&apos;ve got you covered.
        </p>
      </div>

      {/* Flagship Feature Card: Summary, quizzes, podcast, and more */}
      <div className="w-full bg-[#f3f4f6] rounded-3xl sm:rounded-[36px] border border-neutral-200/90 p-6 sm:p-9 lg:p-11 mb-8 shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          
          {/* Left Text Box */}
          <div className="lg:col-span-4 space-y-4">
            <div className="w-10 h-10 rounded-2xl bg-white border border-neutral-200 flex items-center justify-center text-neutral-900 shadow-2xs">
              <MessageSquare className="w-5 h-5 fill-neutral-900" />
            </div>

            <h3 className="text-2xl sm:text-[26px] font-semibold text-neutral-900 tracking-[-0.02em] leading-snug">
              Summary, quizzes, podcast, and more
            </h3>

            <p className="text-neutral-600 text-[15px] sm:text-base leading-relaxed">
              Understand the key points, test your knowledge, get answers with references, and listen to an AI tutor.
            </p>

            <div className="pt-2">
              <Link
                href="/youtube-summarizer"
                className="inline-flex items-center gap-2 text-sm font-medium text-neutral-900 hover:text-black underline underline-offset-4 cursor-pointer"
              >
                <span>Learn more about video summaries</span>
                <span>→</span>
              </Link>
            </div>
          </div>

          {/* Right: Embedded Video Player + AI Notes Interface */}
          <div className="lg:col-span-8 bg-[#18181b] rounded-2xl sm:rounded-[26px] border border-neutral-800 shadow-2xl overflow-hidden text-white">
            
            {/* Player Top Bar */}
            <div className="bg-[#121214] px-4 py-3 flex items-center justify-between border-b border-neutral-800 text-xs text-neutral-300">
              <div className="flex items-center gap-3">
                <Menu className="w-4 h-4 text-neutral-400" />
                <div className="flex items-center gap-1.5 font-semibold text-white">
                  <span className="w-3.5 h-3.5 rounded-sm bg-white flex items-center justify-center text-[8px] text-black font-bold">LN</span>
                  <span className="truncate max-w-[240px] sm:max-w-md font-sans text-[13px]">
                    Discrete-Time Systems &amp; Signal Processing (MIT 8.04)
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] text-neutral-400 font-mono hidden sm:inline">MIT OpenCourseWare</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 min-h-[360px]">
              {/* Video Screen Area */}
              <div className="md:col-span-7 relative flex flex-col justify-between bg-black p-4 sm:p-5">
                {/* Product walkthrough video */}
                <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black flex flex-col items-center justify-center border border-neutral-800/80 group">
                  <video
                    ref={videoRef}
                    playsInline
                    loop
                    muted
                    preload="none"
                    onClick={toggleVideoPlay}
                    className="w-full h-full object-cover cursor-pointer"
                  >
                    <source src={YOUTUBE_SUMMARY_VIDEO} type="video/mp4" />
                    <source src="/yoytube_summary.mp4" type="video/mp4" />
                  </video>

                  {/* Play / Pause button overlay */}
                  {!isPlaying && (
                    <button
                      onClick={toggleVideoPlay}
                      className="absolute inset-0 m-auto w-14 h-14 rounded-full bg-white/30 backdrop-blur-md hover:bg-white/40 border border-white/50 flex items-center justify-center text-white transition-transform active:scale-90 z-20 cursor-pointer shadow-xl"
                      aria-label="Play video"
                    >
                      <Play className="w-6 h-6 fill-white ml-0.5" />
                    </button>
                  )}

                  <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[11px] text-neutral-400 font-mono z-10 pointer-events-none">
                    <span>{isPlaying ? "04:12" : "00:00"} / 1:22:45</span>
                    <span className="bg-red-600 text-white px-1.5 py-0.5 rounded text-[9px] font-bold">HD</span>
                  </div>
                </div>

                {/* Video Sub-controls (Chapters / Transcripts / Auto Scroll) */}
                <div className="mt-3">
                  <div className="flex items-center justify-between pb-2 text-xs">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setActiveSubTab("transcript")}
                        className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer ${
                          activeSubTab === "transcript" ? "bg-neutral-800 text-white" : "text-neutral-400 hover:text-neutral-200"
                        }`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                        <span>Transcripts</span>
                      </button>

                      <button
                        onClick={() => setActiveSubTab("chapters")}
                        className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer ${
                          activeSubTab === "chapters" ? "bg-neutral-800 text-white" : "text-neutral-400 hover:text-neutral-200"
                        }`}
                      >
                        <span>Chapters</span>
                      </button>
                    </div>

                    <span className="text-[10px] text-neutral-400 flex items-center gap-1 font-mono">
                      <span>Auto Scroll</span>
                      <span className="text-emerald-400">ON</span>
                    </span>
                  </div>

                  {/* Live Transcript / Chapters text */}
                  {activeSubTab === "transcript" ? (
                    <div className="p-3 bg-neutral-900/90 rounded-xl border border-neutral-800 text-xs text-neutral-300 leading-relaxed font-sans">
                      <p>
                        &quot;...pivotal figure in utilitarianism, argued that morality should focus on maximizing utility, defined as the balance of pleasure over pain and happiness over suffering. His principle encapsulates the idea of promoting the greatest good for the greatest number...&quot;
                      </p>
                    </div>
                  ) : (
                    <div className="p-3 bg-neutral-900/90 rounded-xl border border-neutral-800 text-xs text-neutral-300 space-y-1.5">
                      <div className="flex justify-between py-0.5 text-neutral-200 font-medium">
                        <span>01. The Trolley Problem Case</span>
                        <span className="text-neutral-400 font-mono">00:00</span>
                      </div>
                      <div className="flex justify-between py-0.5 text-neutral-400">
                        <span>02. Consequentialist Ethics</span>
                        <span className="text-neutral-500 font-mono">14:30</span>
                      </div>
                      <div className="flex justify-between py-0.5 text-neutral-400">
                        <span>03. Jeremy Bentham &amp; Utilitarianism</span>
                        <span className="text-neutral-500 font-mono">32:15</span>
                      </div>
                    </div>
                  )}
                </div>

              </div>

              {/* Right Side: AI Assistant Chat & Summary Panel */}
              <div className="md:col-span-5 bg-[#141416] p-4 sm:p-5 border-t md:border-t-0 md:border-l border-neutral-800 flex flex-col justify-between">
                <div>
                  {/* Tab Selector */}
                  <div className="flex items-center gap-2 mb-4 bg-neutral-900 p-1 rounded-xl border border-neutral-800 text-xs">
                    <button
                      onClick={() => setActiveTab("chat")}
                      className={`flex-1 py-1.5 rounded-lg font-medium text-center transition-all cursor-pointer ${
                        activeTab === "chat" ? "bg-neutral-800 text-white shadow-xs" : "text-neutral-400 hover:text-white"
                      }`}
                    >
                      ● Chat
                    </button>
                    <button
                      onClick={() => setActiveTab("flashcards")}
                      className={`flex-1 py-1.5 rounded-lg font-medium text-center transition-all cursor-pointer ${
                        activeTab === "flashcards" ? "bg-neutral-800 text-white shadow-xs" : "text-neutral-400 hover:text-white"
                      }`}
                    >
                      Flashcards
                    </button>
                  </div>

                  {activeTab === "chat" ? (
                    <div className="space-y-3.5 text-xs">
                      <div>
                        <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider block mb-1">
                          Lecture Overview
                        </span>
                        <p className="text-neutral-300 leading-relaxed">
                          This episode introduces utilitarianism and consequentialist moral reasoning.
                        </p>
                      </div>

                      <div className="space-y-1.5">
                        <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider block">
                          Key Dilemmas
                        </span>
                        <ul className="space-y-1 text-neutral-300">
                          <li className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                            <span>• Trolley #1 (Switch track)</span>
                          </li>
                          <li className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                            <span>• Trolley #2 (Bridge bystander)</span>
                          </li>
                          <li className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                            <span>• Doctor #1 (Transplant 5)</span>
                          </li>
                        </ul>
                      </div>

                      <div className="pt-1">
                        <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider block mb-1">
                          Core Debate
                        </span>
                        <p className="text-emerald-400 font-medium">
                          • Consequentialist vs Categorical Moral Reasoning
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3 text-xs">
                      <div className="bg-neutral-900 p-3 rounded-xl border border-neutral-800 space-y-2">
                        <span className="text-[10px] text-neutral-400 uppercase font-mono">Card 1 of 6</span>
                        <p className="font-semibold text-white">What is the central premise of Utilitarianism?</p>
                        <p className="text-neutral-400 text-[11px] border-t border-neutral-800 pt-1.5">
                          Actions are right in proportion as they tend to promote happiness; wrong as they tend to produce reverse of happiness.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-neutral-800 mt-4">
                  <div className="flex items-center gap-2 bg-neutral-900 rounded-xl px-3 py-2 text-xs text-neutral-400">
                    <span className="flex-1">Ask questions about this lecture...</span>
                    <button className="text-white hover:text-emerald-400 transition-colors">
                      ↵
                    </button>
                  </div>
                </div>

              </div>

            </div>
          </div>

        </div>
      </div>

      {/* 3 Grid Sub-cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Upload any content */}
        <Link 
          href="/app"
          className="bg-[#f3f4f6] rounded-3xl sm:rounded-[32px] border border-neutral-200/90 p-7 sm:p-8 flex flex-col justify-between hover:border-neutral-300 transition-all hover:shadow-md cursor-pointer group"
        >
          <div>
            <div className="w-10 h-10 rounded-2xl bg-white border border-neutral-200 flex items-center justify-center text-neutral-900 mb-6 shadow-2xs group-hover:scale-110 transition-transform">
              <Upload className="w-5 h-5" />
            </div>

            <h3 className="text-xl sm:text-[22px] font-semibold text-neutral-900 tracking-tight mb-3">
              Upload any content
            </h3>

            <p className="text-neutral-600 text-sm leading-relaxed mb-6">
              From PDFs and YouTube videos to slides and even recorded lectures, learn everything your way.
            </p>
          </div>

          <div className="flex flex-wrap gap-1.5 pt-2">
            <span className="px-2.5 py-1 rounded-md bg-white border border-neutral-200 text-xs font-medium text-neutral-700 flex items-center gap-1">
              <FileText className="w-3 h-3 text-red-500" /> PDF
            </span>
            <span className="px-2.5 py-1 rounded-md bg-white border border-neutral-200 text-xs font-medium text-neutral-700 flex items-center gap-1">
              <Video className="w-3 h-3 text-red-600" /> YouTube
            </span>
            <span className="px-2.5 py-1 rounded-md bg-white border border-neutral-200 text-xs font-medium text-neutral-700 flex items-center gap-1">
              <Headphones className="w-3 h-3 text-purple-600" /> Audio
            </span>
            <span className="px-2.5 py-1 rounded-md bg-white border border-neutral-200 text-xs font-medium text-neutral-700 flex items-center gap-1">
              <FileSpreadsheet className="w-3 h-3 text-amber-500" /> Slides
            </span>
          </div>
        </Link>

        {/* Card 2: Test your knowledge */}
        <Link 
          href="/app"
          className="bg-[#f3f4f6] rounded-3xl sm:rounded-[32px] border border-neutral-200/90 p-7 sm:p-8 flex flex-col justify-between hover:border-neutral-300 transition-all hover:shadow-md cursor-pointer group"
        >
          <div>
            <div className="w-10 h-10 rounded-2xl bg-white border border-neutral-200 flex items-center justify-center text-neutral-900 mb-6 shadow-2xs group-hover:scale-110 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>

            <h3 className="text-xl sm:text-[22px] font-semibold text-neutral-900 tracking-tight mb-3">
              Test your knowledge
            </h3>

            <p className="text-neutral-600 text-sm leading-relaxed mb-6">
              Create personalized exams, get answer breakdowns, and track your progress.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-3 border border-neutral-200/90 shadow-2xs">
            <div className="flex items-center justify-between text-xs text-neutral-600 mb-1.5">
              <span className="font-medium text-neutral-900">Personalized Exam</span>
              <span className="text-emerald-600 font-semibold">94% Mastery</span>
            </div>
            <div className="w-full h-1.5 bg-neutral-100 rounded-full overflow-hidden">
              <div className="w-[94%] h-full bg-emerald-500 rounded-full"></div>
            </div>
          </div>
        </Link>

        {/* Card 3: Talk with an AI Tutor */}
        <Link 
          href="/app"
          className="bg-[#f3f4f6] rounded-3xl sm:rounded-[32px] border border-neutral-200/90 p-7 sm:p-8 flex flex-col justify-between hover:border-neutral-300 transition-all hover:shadow-md cursor-pointer group"
        >
          <div>
            <div className="w-10 h-10 rounded-2xl bg-white border border-neutral-200 flex items-center justify-center text-neutral-900 mb-6 shadow-2xs group-hover:scale-110 transition-transform">
              <Mic className="w-5 h-5" />
            </div>

            <h3 className="text-xl sm:text-[22px] font-semibold text-neutral-900 tracking-tight mb-3">
              Talk with an AI Tutor
            </h3>

            <p className="text-neutral-600 text-sm leading-relaxed mb-6">
              Talk to an AI tutor to simplify ideas and receive guidance on the content.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-3 border border-neutral-200/90 shadow-2xs flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
              <Mic className="w-3.5 h-3.5" />
            </div>
            <div className="text-xs">
              <div className="font-medium text-neutral-800">Voice Assistant Ready</div>
              <div className="text-neutral-400 text-[11px]">&quot;Explain utilitarianism simply&quot;</div>
            </div>
          </div>
        </Link>

      </div>
    </section>
  );
}
