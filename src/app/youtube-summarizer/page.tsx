"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { YouTubeSummaryPreviewVideo } from "@/components/YouTubeSummaryPreviewVideo";
import {
  FlaskConical,
  Star,
  AlertCircle,
  BookMarked,
  Glasses
} from "lucide-react";

interface VideoPreset {
  id: string;
  youtubeId: string;
  title: string;
  subtitle?: string;
  thumbnailSrc: string;
  channel: string;
  duration: string;
  url: string;
}
const PRESET_VIDEOS: VideoPreset[] = [
  {
    id: "mit-discrete-time",
    youtubeId: "dQw4w9WgXcQ",
    thumbnailSrc: "/landing-page-video-poster.jpg",
    title: "Discrete-Time Signals and Systems (MIT OpenCourseWare)",
    channel: "MIT OpenCourseWare • Prof. Allan Adams",
    duration: "1:22:45",
    url: "https://youtu.be/dQw4w9WgXcQ"
  },
  {
    id: "tim-urban-procrastination",
    youtubeId: "arj7oStGLkU",
    thumbnailSrc: "/thumbnails/tim-urban.jpg",
    title: "Inside the mind of a procrastinator",
    subtitle: "Tim Urban tackles procrastination humorously.",
    channel: "TED • Tim Urban",
    duration: "14:03",
    url: "https://www.youtube.com/watch?v=arj7oStGLkU"
  },
  {
    id: "mit-algorithms",
    youtubeId: "0JUN9aDxVmI",
    thumbnailSrc: "/thumbnails/jelani-nelson.jpg",
    title: "Advanced Algorithms, Lecture 1",
    subtitle: "Course topics, word RAM, predecessor, etc.",
    channel: "Harvard University • Prof. Jelani Nelson",
    duration: "1:18:22",
    url: "https://www.youtube.com/watch?v=0JUN9aDxVmI"
  },
  {
    id: "mit-brain",
    youtubeId: "ba-HMvDn_vU",
    thumbnailSrc: "/thumbnails/nancy-kanwisher.jpg",
    title: "Introduction to the Human Brain",
    subtitle: "MIT 9.13 The Human Brain, Spring 2019",
    channel: "MIT 9.13 • Prof. Nancy Kanwisher",
    duration: "1:08:45",
    url: "https://www.youtube.com/watch?v=ba-HMvDn_vU"
  }
];

const FAQS = [
  {
    q: "What is the YouTube Video Summarizer?",
    a: "The YouTube Video Summarizer uses multimodal AI to process video audio and transcripts. It extracts the essential points, generates timestamped chapters, builds flashcards, and allows you to chat Socratically with the lecture material."
  },
  {
    q: "Do you have to pay to use this tool?",
    a: "No, you can summarize YouTube videos for free directly on this page without creating an account. If you want to save your notes, generate unlimited flashcards, and sync with your AI workspace, you can sign up for free."
  },
  {
    q: "Is there a limit on video length or the number of YouTube summaries?",
    a: "You can summarize videos of virtually any length, from 5-minute tutorials to 3-hour university lectures. The AI automatically breaks long recordings into manageable chapters and modules."
  },
  {
    q: "How accurate are the summaries?",
    a: "Our summaries are grounded directly in the spoken transcript and closed captions of the video. The AI cites exact timestamps so you can verify any fact, formula, or claim in seconds."
  },
  {
    q: "Can I use YouLearn to summarize other content?",
    a: "Yes! In addition to YouTube videos, you can upload PDFs, research papers, PowerPoint slides, audio recordings, and textbook chapters into your AI workspace."
  },
  {
    q: "Does YouLearn support different languages?",
    a: "Yes. Our AI engine supports videos and transcripts in over 50 languages, including Spanish, French, German, Japanese, Mandarin, Hindi, and Arabic."
  }
];

export default function YouTubeSummarizerPage() {
  const [inputUrl, setInputUrl] = useState(PRESET_VIDEOS[0].url);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const scrollToPreview = () => {
    document.getElementById("summarizer-preview")?.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  };

  const handleSelectPreset = (video: VideoPreset) => {
    setInputUrl(video.url);
    setErrorMessage("");
    scrollToPreview();
  };

  const handleGenerateSummary = (event: React.FormEvent) => {
    event.preventDefault();
    const cleanUrl = inputUrl.trim();

    if (!/^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\//i.test(cleanUrl)) {
      setErrorMessage("Enter a valid YouTube URL.");
      return;
    }

    setErrorMessage("");
    scrollToPreview();
  };

  return (
    <div className="min-h-screen bg-white text-neutral-900 flex flex-col font-sans selection:bg-neutral-900 selection:text-white relative overflow-x-clip">
      {/* Top Ambient Glow matching screenshot */}
      <div
        className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 w-[980px] max-w-[95vw] h-[480px] -z-10 select-none overflow-hidden"
        aria-hidden="true"
      >
        <div className="w-full h-full bg-[radial-gradient(ellipse_at_top,_rgba(147,197,253,0.32)_0%,_rgba(191,219,254,0.18)_40%,_transparent_72%)] blur-2xl" />
      </div>

      {/* Top Navbar */}
      <Navbar onOpenDemo={() => {}} />

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <section className="pt-12 sm:pt-16 pb-6 px-4 max-w-[1000px] mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl md:text-[58px] lg:text-[62px] font-semibold text-[#111111] tracking-[-0.03em] leading-[1.12] max-w-4xl mx-auto mb-4 sm:mb-5">
            YouTube Video Summarizer
          </h1>

          <p className="text-base sm:text-lg md:text-[18px] text-[#71717a] font-normal leading-relaxed max-w-2xl mx-auto mb-8 sm:mb-9">
            Get YouTube transcript and use AI to summarize YouTube videos for free with YouLearn&apos;s YouTube summary tool.
          </p>

          {/* URL Input Form matching screenshot */}
          <form onSubmit={handleGenerateSummary} className="w-full max-w-[760px] mx-auto mb-10 sm:mb-14 px-4">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full">
              <input
                type="text"
                placeholder="https://youtu.be/dQw4w9WgXcQ"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                style={{ backgroundColor: "#f3f4f6", color: "#111111" }}
                className="w-full sm:w-[380px] md:w-[420px] h-[52px] px-6 rounded-full border border-transparent text-[15px] placeholder:text-[#8e8e93] focus:bg-white focus:border-neutral-300 focus:outline-none focus:ring-2 focus:ring-neutral-200 transition-all text-center sm:text-left shadow-2xs shrink-0"
              />
              <button
                type="submit"
                style={{ backgroundColor: "#8e8e93", color: "#ffffff" }}
                className="w-full sm:w-auto h-[52px] px-7 rounded-full font-medium text-[15px] transition-all whitespace-nowrap hover:opacity-90 active:scale-[0.98] cursor-pointer shrink-0 flex items-center justify-center gap-2 shadow-2xs"
              >
                <span>Generate Summary</span>
              </button>
            </div>

            {/* Error Message if any */}
            {errorMessage && (
              <div
                role="alert"
                className="mt-4 inline-flex items-center gap-2 p-3 px-5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium animate-in fade-in"
              >
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{errorMessage}</span>
              </div>
            )}
          </form>
        </section>

        {/* Interactive Summarizer Preview Card (Live Split Studio Viewer) */}
        <section id="summarizer-preview" className="max-w-[1240px] mx-auto px-4 sm:px-6 pt-2 pb-16">
          <YouTubeSummaryPreviewVideo />

        </section>

        {/* Section 1: "Try summarizing a YouTube link below" (Matching Screenshot 1) */}
        <section className="pt-16 sm:pt-20 pb-12 px-4 max-w-[1240px] mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-[42px] font-semibold text-[#111111] tracking-[-0.03em] mb-3">
              Try summarizing a YouTube link below
            </h2>
            <p className="text-[15px] sm:text-base text-[#71717a] font-normal">
              Click on a YouTube video below, and start summarizing it ⤵
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-7">
            {PRESET_VIDEOS.slice(1, 4).map((vid) => (
              <div
                key={vid.id}
                onClick={() => handleSelectPreset(vid)}
                className="group cursor-pointer flex flex-col"
              >
                <div className="relative w-full aspect-[16/10] rounded-[22px] sm:rounded-[24px] overflow-hidden bg-neutral-100 mb-3.5 shadow-2xs group-hover:opacity-95 transition-all">
                  <Image
                    src={vid.thumbnailSrc}
                    alt={vid.title}
                    fill
                    sizes="(max-width: 767px) 100vw, 33vw"
                    className="object-cover group-hover:scale-102 transition-transform duration-300"
                  />
                </div>

                <div>
                  <h3 className="font-semibold text-[17px] sm:text-[18px] text-[#111111] tracking-tight group-hover:text-blue-600 transition-colors leading-snug">
                    {vid.title}
                  </h3>
                  <p className="text-[14px] text-[#71717a] mt-1 font-normal leading-relaxed">
                    {vid.subtitle}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 2: "Save Time and Learn More Effortlessly" (Matching Screenshot 2) */}
        <section className="py-10 px-4 max-w-[1240px] mx-auto">
          <div className="w-full rounded-[30px] sm:rounded-[36px] bg-[#f8f9fa] border border-neutral-200/60 py-16 sm:py-20 px-6 sm:px-12 text-center">
            <h2 className="text-3xl sm:text-4xl md:text-[44px] font-semibold text-[#111111] tracking-[-0.03em] mb-3">
              Save Time and Learn More Effortlessly
            </h2>
            <p className="text-[15px] sm:text-[16px] text-[#71717a] font-normal mb-7 max-w-xl mx-auto">
              Summarize YouTube videos with YouLearn AI.
            </p>
            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="inline-flex items-center justify-center px-7 py-3 rounded-full bg-[#111111] hover:bg-neutral-800 text-white font-medium text-[15px] transition-all active:scale-[0.98] cursor-pointer shadow-2xs"
              >
                Start Summarizing
              </button>
            </div>
          </div>
        </section>

        {/* Section 3: "Built for Different Use Cases" (Matching Screenshot 3 & 4) */}
        <section className="py-14 sm:py-18 px-4 max-w-[1240px] mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-[42px] font-semibold text-[#111111] tracking-[-0.03em] mb-3">
              Built for Different Use Cases
            </h2>
            <p className="text-[15px] sm:text-base text-[#71717a] font-normal">
              Made for students, researchers, and lifelong learners
            </p>
          </div>

          <div className="space-y-4 sm:space-y-4.5 max-w-[860px] mx-auto">
            {/* For Students */}
            <div className="p-7 sm:p-8 rounded-[24px] sm:rounded-[28px] bg-white border border-neutral-200/80 shadow-2xs">
              <div className="w-7 h-7 flex items-center justify-center text-[#111111] mb-3.5">
                <BookMarked className="w-5 h-5 fill-[#111111] stroke-[#111111]" />
              </div>
              <h3 className="font-semibold text-lg sm:text-[19px] text-[#111111] mb-1.5 tracking-tight">
                For Students
              </h3>
              <p className="text-[14px] sm:text-[15px] text-[#71717a] leading-relaxed font-normal">
                Summarize lectures, tutorials, and other studies from YouTube videos to stay ahead.
              </p>
            </div>

            {/* For Researchers */}
            <div className="p-7 sm:p-8 rounded-[24px] sm:rounded-[28px] bg-white border border-neutral-200/80 shadow-2xs">
              <div className="w-7 h-7 flex items-center justify-center text-[#111111] mb-3.5">
                <FlaskConical className="w-5 h-5 stroke-[2.3]" />
              </div>
              <h3 className="font-semibold text-lg sm:text-[19px] text-[#111111] mb-1.5 tracking-tight">
                For Researchers
              </h3>
              <p className="text-[14px] sm:text-[15px] text-[#71717a] leading-relaxed font-normal">
                Use YouLearn AI&apos;s summary tool to explore and understand long, complex topics from YouTube videos.
              </p>
            </div>

            {/* For Lifelong Learners */}
            <div className="p-7 sm:p-8 rounded-[24px] sm:rounded-[28px] bg-white border border-neutral-200/80 shadow-2xs">
              <div className="w-7 h-7 flex items-center justify-center text-[#111111] mb-3.5">
                <Glasses className="w-5 h-5 stroke-[2.3]" />
              </div>
              <h3 className="font-semibold text-lg sm:text-[19px] text-[#111111] mb-1.5 tracking-tight">
                For Lifelong Learners
              </h3>
              <p className="text-[14px] sm:text-[15px] text-[#71717a] leading-relaxed font-normal">
                Quickly get the key points of influential figures, creators, artists, ceo&apos;s with the YouTube summarizer.
              </p>
            </div>
          </div>
        </section>

        {/* Section 4: "What people are saying" (Matching Screenshot 4 bottom) */}
        <section className="py-16 sm:py-20 px-4 max-w-[1240px] mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-14">
            <h2 className="text-3xl sm:text-4xl md:text-[42px] font-semibold text-[#111111] tracking-[-0.03em]">
              What people are saying
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-[1200px] mx-auto">
            {/* Card 1 */}
            <div className="p-7 sm:p-8 rounded-[24px] sm:rounded-[28px] bg-white border border-neutral-200/80 shadow-2xs flex flex-col justify-between space-y-5">
              <div className="space-y-3.5">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm sm:text-[14.5px] text-[#111111] leading-relaxed font-normal">
                  &ldquo;YouLearn AI&apos;s ChatGPT-based summarizer has completely transformed my lesson planning. I can quickly extract core ideas from educational videos, giving me more time to focus on teaching my students.&rdquo;
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-sm text-[#111111]">Emma Roberts</h4>
                <p className="text-xs text-[#71717a] font-normal">Elementary School Teacher</p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="p-7 sm:p-8 rounded-[24px] sm:rounded-[28px] bg-white border border-neutral-200/80 shadow-2xs flex flex-col justify-between space-y-5">
              <div className="space-y-3.5">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm sm:text-[14.5px] text-[#111111] leading-relaxed font-normal">
                  &ldquo;As a startup founder, time is my most valuable asset. YouLearn AI&apos;s efficient YouTube transcript summaries help me stay ahead of market trends without hours of watching videos.&rdquo;
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-sm text-[#111111]">Mark Donovan</h4>
                <p className="text-xs text-[#71717a] font-normal">Entrepreneur &amp; CEO</p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="p-7 sm:p-8 rounded-[24px] sm:rounded-[28px] bg-white border border-neutral-200/80 shadow-2xs flex flex-col justify-between space-y-5">
              <div className="space-y-3.5">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm sm:text-[14.5px] text-[#111111] leading-relaxed font-normal">
                  &ldquo;I rely on YouLearn AI to turn technical lectures and conference webinars into concise notes. The AI-generated summaries pinpoint experimental methods and cited publications, saving me precious time.&rdquo;
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-sm text-[#111111]">Dr. Aris Thorne</h4>
                <p className="text-xs text-[#71717a] font-normal">Senior Biotech Researcher</p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 5: "FAQs" (Matching Screenshot 5) */}
        <section className="py-16 sm:py-20 px-4 max-w-[900px] mx-auto">
          <div className="text-center mb-10 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-[42px] font-semibold text-[#111111] tracking-[-0.03em]">
              FAQs
            </h2>
          </div>

          <div className="rounded-[28px] sm:rounded-[32px] bg-[#f8f9fa] border border-neutral-200/70 p-6 sm:p-10 divide-y divide-neutral-200/70">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div key={idx} className="py-4.5 first:pt-0 last:pb-0">
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full flex items-center text-left gap-4 font-normal text-[15px] sm:text-[16px] text-[#111111] hover:text-neutral-600 transition-colors cursor-pointer group"
                  >
                    <span className="text-xl font-light text-neutral-400 group-hover:text-neutral-700 w-4 shrink-0 select-none transition-colors">
                      {isOpen ? "−" : "+"}
                    </span>
                    <span className="font-medium text-[15px] sm:text-[16px] text-[#111111] group-hover:text-neutral-700 transition-colors">
                      {faq.q}
                    </span>
                  </button>
                  {isOpen && (
                    <div className="pl-8 pt-2 pb-2 text-[14px] text-[#71717a] leading-relaxed font-normal animate-in fade-in duration-200">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer onOpenDemo={() => {}} />
    </div>
  );
}
