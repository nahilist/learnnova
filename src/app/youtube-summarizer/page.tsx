"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { 
  Video, 
  Sparkles, 
  Play, 
  Clock, 
  CheckCircle2, 
  HelpCircle, 
  ArrowRight, 
  RotateCcw, 
  Layers, 
  Share2, 
  ExternalLink,
  ChevronRight,
  BookOpen,
  MessageSquare,
  Copy,
  Check
} from "lucide-react";

interface SampleVideo {
  id: string;
  youtubeId: string;
  title: string;
  channel: string;
  duration: string;
  url: string;
  summary: string;
  keyTakeaways: string[];
  chapters: {
    time: string;
    title: string;
    summary: string;
  }[];
  quizQuestions: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  }[];
  flashcards: {
    front: string;
    back: string;
  }[];
}

const SAMPLE_VIDEOS: SampleVideo[] = [
  {
    id: "harvard-justice",
    youtubeId: "kBdfcR-8hEY",
    title: "Justice: What's the Right Thing to Do? Episode 01 'The Moral Side of Murder'",
    channel: "Harvard University • Prof. Michael Sandel",
    duration: "54:56",
    url: "https://www.youtube.com/watch?v=kBdfcR-8hEY",
    summary: "Professor Michael Sandel introduces the philosophical foundations of moral reasoning using the classic Trolley Problem. He guides students through the clash between Consequentialist (Utilitarian) ethics and Categorical (Deontological) moral principles.",
    keyTakeaways: [
      "Consequentialist moral reasoning locates morality in the consequences of an act (e.g., Jeremy Bentham's Utilitarianism: maximize the greatest good for the greatest number).",
      "Categorical moral reasoning locates morality in certain fundamental duties and human rights, regardless of outcomes (e.g., Immanuel Kant's deontological ethics).",
      "Moral philosophy is not merely abstract speculation—it forces us to confront our gut instincts and reconcile apparent contradictions when real human lives are at stake."
    ],
    chapters: [
      {
        time: "00:00",
        title: "Introduction to Moral Reasoning",
        summary: "Prof. Sandel welcomes students in Harvard's Sanders Theatre and introduces thought experiments as tools to test our ethical convictions."
      },
      {
        time: "03:15",
        title: "The Runaway Trolley Problem",
        summary: "A trolley brakes fail. Turn the steering wheel to kill 1 worker instead of 5? Most students immediately vote yes, citing saving 5 lives over 1."
      },
      {
        time: "11:40",
        title: "The Fat Man on the Bridge Variation",
        summary: "Pushing a bystander off the bridge to stop the same runaway trolley. Students suddenly object, revealing that numbers alone do not govern moral intuition."
      },
      {
        time: "24:50",
        title: "Utilitarianism vs Categorical Imperatives",
        summary: "Sandel formalizes the two major branches of moral philosophy: Bentham's outcome-focused utility vs Kantian intrinsic duty and rights."
      },
      {
        time: "41:10",
        title: "The Queen v. Dudley and Stephens Case (1884)",
        summary: "Real-world shipwreck cannibalism case: four men adrift, three kill the sick cabin boy to survive. Sandel challenges the class to judge the verdict."
      }
    ],
    quizQuestions: [
      {
        question: "What differentiates consequentialist moral reasoning from categorical moral reasoning?",
        options: [
          "Consequentialism judges actions by their outcomes; categorical reasoning judges actions by intrinsic principles.",
          "Consequentialism is religious, while categorical reasoning is purely legalistic.",
          "Categorical reasoning only applies in medical emergencies.",
          "There is no difference between the two frameworks."
        ],
        correctIndex: 0,
        explanation: "Consequentialist ethics (like Utilitarianism) calculates the net balance of pleasure or pain produced, whereas categorical ethics holds that certain actions are inherently wrong regardless of consequences."
      },
      {
        question: "In the 1884 Queen v. Dudley and Stephens legal case, what was the primary defense argument?",
        options: [
          "Self-defense against an attack",
          "Necessity to preserve the greater number of lives",
          "Divine authorization",
          "Mental insanity due to starvation"
        ],
        correctIndex: 1,
        explanation: "The defense argued that sacrificing one dying cabin boy was necessary to ensure the survival of the remaining crew members."
      },
      {
        question: "Which philosopher is most famously associated with classical Utilitarianism?",
        options: [
          "Immanuel Kant",
          "Jeremy Bentham",
          "Aristotle",
          "Friedrich Nietzsche"
        ],
        correctIndex: 1,
        explanation: "Jeremy Bentham founded classical Utilitarianism, proposing the 'hedonic calculus' to maximize utility."
      }
    ],
    flashcards: [
      {
        front: "Consequentialist Moral Reasoning",
        back: "Locates morality in the consequences of an act, seeking to maximize overall happiness (e.g. Utilitarianism)."
      },
      {
        front: "Categorical Moral Reasoning",
        back: "Locates morality in certain absolute duties and universal rights, regardless of the consequences."
      },
      {
        front: "The Queen v. Dudley and Stephens",
        back: "Famous 1884 English maritime criminal case establishing that necessity cannot justify murder."
      }
    ]
  },
  {
    id: "mit-cs-python",
    youtubeId: "nykOeWgQcHM",
    title: "MIT 6.0001: Introduction to Computer Science and Programming in Python",
    channel: "MIT OpenCourseWare • Prof. Ana Bell",
    duration: "49:22",
    url: "https://www.youtube.com/watch?v=nykOeWgQcHM",
    summary: "MIT Professor Ana Bell covers the fundamentals of computation, algorithms, data types, variable binding, branching logic, and control flow in Python 3.",
    keyTakeaways: [
      "Computation is the automated manipulation of recipes (algorithms) and ingredients (data).",
      "Declarative knowledge statements (facts) differ fundamentally from imperative knowledge (how-to recipes).",
      "Python represents objects with types, values, and memory addresses, with mutable and immutable distinctions."
    ],
    chapters: [
      {
        time: "00:00",
        title: "Course Objectives & Computational Thinking",
        summary: "Introduction to computational thinking as problem formulation rather than mere coding syntax."
      },
      {
        time: "10:15",
        title: "Declarative vs Imperative Knowledge",
        summary: "Why computers need step-by-step mechanical recipes rather than descriptive truth claims."
      },
      {
        time: "22:40",
        title: "Python Types, Variables & Expressions",
        summary: "Integers, floats, booleans, and strings with dynamic variable assignment."
      },
      {
        time: "36:10",
        title: "Control Flow: If, Elif, Else Branching",
        summary: "Making decisions in programs using boolean expressions and indentation blocks."
      }
    ],
    quizQuestions: [
      {
        question: "What is the primary difference between declarative and imperative knowledge?",
        options: [
          "Declarative states what is true; imperative provides a recipe for how to compute it.",
          "Declarative is compiled; imperative is interpreted.",
          "Declarative only works with floating point numbers.",
          "There is no functional distinction in modern computing."
        ],
        correctIndex: 0,
        explanation: "Declarative knowledge asserts facts (e.g. the square root of 25 is 5), while imperative knowledge gives the sequence of steps to find that value."
      }
    ],
    flashcards: [
      {
        front: "Algorithm",
        back: "A finite, step-by-step sequence of well-defined computer instructions to solve a class of problems."
      },
      {
        front: "Control Flow",
        back: "The order in which individual statements, instructions or function calls of an imperative program are executed or evaluated."
      }
    ]
  },
  {
    id: "3blue1brown-calculus",
    youtubeId: "WUvTyaaNkzM",
    title: "The Essence of Calculus, Chapter 1",
    channel: "3Blue1Brown • Grant Sanderson",
    duration: "17:04",
    url: "https://www.youtube.com/watch?v=WUvTyaaNkzM",
    summary: "Grant Sanderson visualizes why calculus was invented: breaking difficult continuous problems into infinitely many tiny, easily solvable pieces.",
    keyTakeaways: [
      "Calculus simplifies complex curved shapes and varying velocities by approximating them as linear segments at infinitesimal scales.",
      "The derivative measures instantaneous rates of change; the integral accumulates infinitesimal products.",
      "Geometry provides intuitive insight that makes algebraic calculus formulas feel natural rather than arbitrary."
    ],
    chapters: [
      {
        time: "00:00",
        title: "Why Calculus Matters",
        summary: "The visual puzzle of calculating the area of a circle using rings."
      },
      {
        time: "05:30",
        title: "Unrolling Concentric Rings",
        summary: "Slicing a circle into infinitely thin rings and straightening them into a triangle of base 2πr and height r."
      },
      {
        time: "11:20",
        title: "Connecting Derivatives and Integrals",
        summary: "How finding the area under a curve is intrinsically connected to the slope of that curve."
      }
    ],
    quizQuestions: [
      {
        question: "How does unrolling concentric rings of a circle prove the area formula A = πr²?",
        options: [
          "It forms a right triangle with base 2πr and height r, whose area is 1/2 * base * height = πr².",
          "It creates a cube with volume πr³.",
          "It converts the circle into a parabola.",
          "It uses imaginary numbers to cancel out radius squared."
        ],
        correctIndex: 0,
        explanation: "The circumference of the outermost ring is 2πr, and unrolling all rings creates a triangle with base 2πr and height r. Area = (1/2)(2πr)(r) = πr²."
      }
    ],
    flashcards: [
      {
        front: "Fundamental Theorem of Calculus",
        back: "The mathematical theorem establishing that differentiation and integration are inverse operations."
      }
    ]
  }
];

export default function YouTubeSummarizerPage() {
  const [inputUrl, setInputUrl] = useState("");
  const [selectedVideo, setSelectedVideo] = useState<SampleVideo>(SAMPLE_VIDEOS[0]);
  const [activeTab, setActiveTab] = useState<"summary" | "chapters" | "quiz" | "flashcards">("summary");
  const [selectedChapterIndex, setSelectedChapterIndex] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [cardFlipped, setCardFlipped] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);

  const handleSelectSample = (video: SampleVideo) => {
    setSelectedVideo(video);
    setInputUrl(video.url);
    setSelectedChapterIndex(0);
    setQuizAnswers({});
    setActiveCardIndex(0);
    setCardFlipped(false);
  };

  const handleSummarizeCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputUrl.trim()) return;

    setIsProcessing(true);
    setTimeout(() => {
      // Find if matches sample or create dynamic mock
      const matched = SAMPLE_VIDEOS.find(
        (v) => v.url.toLowerCase() === inputUrl.toLowerCase() || inputUrl.includes(v.youtubeId)
      );

      if (matched) {
        setSelectedVideo(matched);
      } else {
        // Build simulated custom video summary
        setSelectedVideo({
          id: "custom-" + Date.now(),
          youtubeId: "custom",
          title: "Custom YouTube Lecture Summary",
          channel: "Educational Stream • YouLearn AI Processor",
          duration: "32:15",
          url: inputUrl,
          summary: "YouLearn processed this video stream, extracted speech transcripts, and synthesized conceptual frameworks and review materials.",
          keyTakeaways: [
            "Core conceptual framework explained with clear step-by-step methodologies.",
            "Key definitions and operational constraints highlighted for exam preparation.",
            "Actionable takeaways mapped to active recall study flashcards."
          ],
          chapters: [
            {
              time: "00:00",
              title: "Introduction & Theoretical Background",
              summary: "Overview of initial assumptions, definitions, and problem space."
            },
            {
              time: "08:15",
              title: "Detailed Case Analysis & Evidence",
              summary: "Deductive walkthrough of practical applications and counter-arguments."
            },
            {
              time: "21:30",
              title: "Synthesis & Exam Recommendations",
              summary: "High-yield takeaways and frequently tested examination patterns."
            }
          ],
          quizQuestions: [
            {
              question: "What is the primary thesis established in this lecture?",
              options: [
                "Systematic active application outperforms passive observation.",
                "Theoretical definitions can be ignored in practical execution.",
                "Historical models are no longer valid under modern metrics.",
                "Only computational solutions should be prioritized."
              ],
              correctIndex: 0,
              explanation: "The lecture repeatedly emphasizes active engagement and empirical testing over passive review."
            }
          ],
          flashcards: [
            {
              front: "Primary Lecture Thesis",
              back: "Active recall and iterative application establish robust neural retention."
            }
          ]
        });
      }

      setIsProcessing(false);
      setSelectedChapterIndex(0);
      setQuizAnswers({});
      setActiveCardIndex(0);
    }, 800);
  };

  const handleAnswerQuiz = (questionIdx: number, optionIdx: number) => {
    setQuizAnswers({ ...quizAnswers, [questionIdx]: optionIdx });
  };

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-white text-neutral-900 flex flex-col font-sans selection:bg-neutral-900 selection:text-white">
      {/* Top Navbar */}
      <Navbar onOpenDemo={() => {}} />

      {/* Main Content */}
      <main className="flex-1 pb-24">
        {/* Hero Section */}
        <section className="pt-12 pb-8 px-6 max-w-[920px] mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-50 text-red-700 text-xs font-semibold mb-4 border border-red-100">
            <Video className="w-4 h-4 text-red-600" />
            <span>YouTube Video Summarizer</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-neutral-950 mb-3 leading-tight">
            Turn YouTube lectures into concise notes, chapters, and quizzes
          </h1>

          <p className="text-neutral-500 text-base sm:text-lg max-w-[620px] mx-auto leading-relaxed">
            Paste any educational YouTube URL. YouLearn extracts the key frameworks, builds timestamped chapters, and creates interactive flashcards.
          </p>

          {/* URL Input Form */}
          <form onSubmit={handleSummarizeCustom} className="mt-8 max-w-[720px] mx-auto">
            <div className="flex flex-col sm:flex-row items-center gap-2.5 p-1.5 rounded-2xl sm:rounded-full bg-white border border-neutral-300 shadow-lg shadow-neutral-100 focus-within:ring-2 focus-within:ring-neutral-900 transition-all">
              <div className="flex items-center gap-2.5 pl-4 w-full">
                <Video className="w-5 h-5 text-red-500 shrink-0" />
                <input
                  type="url"
                  required
                  placeholder="Paste YouTube link (e.g. https://www.youtube.com/watch?v=...)"
                  value={inputUrl}
                  onChange={(e) => setInputUrl(e.target.value)}
                  className="w-full py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full sm:w-auto px-6 py-3 bg-neutral-950 hover:bg-neutral-800 text-white rounded-xl sm:rounded-full font-semibold text-sm transition-all whitespace-nowrap shadow-sm disabled:opacity-60 active:scale-98 cursor-pointer flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>Summarize Video</span>
                  </>
                )}
              </button>
            </div>

            {/* Quick Sample Chips */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs">
              <span className="text-neutral-400 font-medium">Try a sample:</span>
              {SAMPLE_VIDEOS.map((vid) => (
                <button
                  key={vid.id}
                  type="button"
                  onClick={() => handleSelectSample(vid)}
                  className={`px-3 py-1 rounded-full border transition-all cursor-pointer font-medium ${
                    selectedVideo.id === vid.id
                      ? "bg-neutral-900 text-white border-neutral-900 shadow-xs"
                      : "bg-neutral-50 text-neutral-600 border-neutral-200 hover:bg-neutral-100"
                  }`}
                >
                  {vid.title.split(":")[0]}
                </button>
              ))}
            </div>
          </form>
        </section>

        {/* Video Summarizer Output Dashboard */}
        <section className="max-w-[1100px] mx-auto px-6 mt-8">
          <div className="bg-white rounded-3xl border border-neutral-200/80 shadow-xl overflow-hidden">
            {/* Top Bar with Video Info & Actions */}
            <div className="p-6 bg-neutral-50/80 border-b border-neutral-200/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs text-neutral-500 font-medium">
                  <span className="px-2.5 py-0.5 rounded-full bg-red-100 text-red-700 font-semibold">
                    YouTube
                  </span>
                  <span>•</span>
                  <span>{selectedVideo.channel}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {selectedVideo.duration}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-neutral-950">
                  {selectedVideo.title}
                </h2>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={handleCopyLink}
                  className="px-3.5 py-2 rounded-xl bg-white border border-neutral-200 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
                >
                  {copiedUrl ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedUrl ? "Copied" : "Share"}</span>
                </button>

                <Link
                  href="/app"
                  className="px-4 py-2 rounded-xl bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Open in Workspace</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Main Two-Pane Split: Left Video / Right Generated Tabs */}
            <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[560px]">
              {/* Left Column (5 Cols): Video Player & Key Stats */}
              <div className="lg:col-span-5 p-6 border-b lg:border-b-0 lg:border-r border-neutral-200/80 bg-neutral-50/30 flex flex-col justify-between">
                <div>
                  {/* YouTube Embed Player */}
                  <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black shadow-md border border-neutral-200">
                    {selectedVideo.youtubeId !== "custom" ? (
                      <iframe
                        src={`https://www.youtube-nocookie.com/embed/${selectedVideo.youtubeId}`}
                        title={selectedVideo.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full border-0"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-neutral-400 p-6 text-center">
                        <Play className="w-12 h-12 text-white/50 mb-2" />
                        <span className="text-xs text-white font-medium">Custom Video Ingestion</span>
                        <span className="text-[11px] text-neutral-500 mt-1 truncate max-w-[240px]">{selectedVideo.url}</span>
                      </div>
                    )}
                  </div>

                  {/* Quick stats grid */}
                  <div className="mt-5 grid grid-cols-3 gap-3 text-center">
                    <div className="p-3 rounded-xl bg-white border border-neutral-200/80">
                      <span className="text-[11px] text-neutral-400 block font-medium">Duration</span>
                      <span className="text-sm font-bold text-neutral-900">{selectedVideo.duration}</span>
                    </div>
                    <div className="p-3 rounded-xl bg-white border border-neutral-200/80">
                      <span className="text-[11px] text-neutral-400 block font-medium">Chapters</span>
                      <span className="text-sm font-bold text-neutral-900">{selectedVideo.chapters.length} Modules</span>
                    </div>
                    <div className="p-3 rounded-xl bg-white border border-neutral-200/80">
                      <span className="text-[11px] text-neutral-400 block font-medium">Questions</span>
                      <span className="text-sm font-bold text-neutral-900">{selectedVideo.quizQuestions.length} AI Quizzes</span>
                    </div>
                  </div>

                  {/* Ask Tutor Prompt Box */}
                  <div className="mt-5 p-4 rounded-2xl bg-blue-50/70 border border-blue-100 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-blue-950">
                      <MessageSquare className="w-4 h-4 text-blue-600" />
                      <span>Chat with this video in YouLearn</span>
                    </div>
                    <p className="text-xs text-blue-800 leading-relaxed">
                      Ask your AI tutor questions like: &ldquo;Explain the difference between Bentham and Kant like I&apos;m 12&rdquo; or &ldquo;Give me an exam problem based on chapter 3.&rdquo;
                    </p>
                    <Link
                      href="/app"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 hover:text-blue-900 pt-1"
                    >
                      <span>Start interactive chat session</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-neutral-200/60 text-[11px] text-neutral-400">
                  Processed with YouLearn Multimodal Audio &amp; Video Engine
                </div>
              </div>

              {/* Right Column (7 Cols): Summary, Chapters, Quiz & Flashcards */}
              <div className="lg:col-span-7 flex flex-col">
                {/* Tabs Header */}
                <div className="flex items-center border-b border-neutral-200/80 px-6 pt-3 bg-white overflow-x-auto scrollbar-none">
                  <button
                    onClick={() => setActiveTab("summary")}
                    className={`pb-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                      activeTab === "summary"
                        ? "border-neutral-950 text-neutral-950"
                        : "border-transparent text-neutral-400 hover:text-neutral-700"
                    }`}
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>Summary &amp; Key Takeaways</span>
                  </button>

                  <button
                    onClick={() => setActiveTab("chapters")}
                    className={`pb-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                      activeTab === "chapters"
                        ? "border-neutral-950 text-neutral-950"
                        : "border-transparent text-neutral-400 hover:text-neutral-700"
                    }`}
                  >
                    <Clock className="w-4 h-4" />
                    <span>Timestamped Chapters</span>
                  </button>

                  <button
                    onClick={() => setActiveTab("quiz")}
                    className={`pb-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                      activeTab === "quiz"
                        ? "border-neutral-950 text-neutral-950"
                        : "border-transparent text-neutral-400 hover:text-neutral-700"
                    }`}
                  >
                    <HelpCircle className="w-4 h-4" />
                    <span>Practice Quiz</span>
                  </button>

                  <button
                    onClick={() => setActiveTab("flashcards")}
                    className={`pb-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                      activeTab === "flashcards"
                        ? "border-neutral-950 text-neutral-950"
                        : "border-transparent text-neutral-400 hover:text-neutral-700"
                    }`}
                  >
                    <Layers className="w-4 h-4" />
                    <span>Flashcards</span>
                  </button>
                </div>

                {/* Tab 1: Summary */}
                {activeTab === "summary" && (
                  <div className="p-6 sm:p-8 space-y-6 overflow-y-auto">
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
                        Executive Overview
                      </h3>
                      <p className="text-sm sm:text-base text-neutral-700 leading-relaxed font-normal bg-neutral-50/70 p-4 rounded-2xl border border-neutral-100">
                        {selectedVideo.summary}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3">
                        Core Takeaways &amp; Exam Insights
                      </h3>
                      <ul className="space-y-3">
                        {selectedVideo.keyTakeaways.map((point, idx) => (
                          <li key={idx} className="flex items-start gap-3 text-sm text-neutral-700 leading-relaxed">
                            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-4 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                      <span className="text-xs text-neutral-500 font-medium">
                        Want to test your retention on this material?
                      </span>
                      <button
                        onClick={() => setActiveTab("quiz")}
                        className="px-4 py-2 rounded-full bg-neutral-900 text-white text-xs font-semibold hover:bg-neutral-800 transition-colors shadow-2xs"
                      >
                        Start 3-Question Practice Quiz →
                      </button>
                    </div>
                  </div>
                )}

                {/* Tab 2: Timestamped Chapters */}
                {activeTab === "chapters" && (
                  <div className="p-6 sm:p-8 space-y-4 overflow-y-auto">
                    <p className="text-xs text-neutral-500">
                      Click any chapter to review the professor&apos;s exact discussion point and formulas:
                    </p>

                    <div className="space-y-2.5">
                      {selectedVideo.chapters.map((ch, idx) => (
                        <div
                          key={idx}
                          onClick={() => setSelectedChapterIndex(idx)}
                          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                            selectedChapterIndex === idx
                              ? "bg-neutral-900 text-white border-neutral-900 shadow-sm"
                              : "bg-neutral-50/80 text-neutral-800 border-neutral-200/70 hover:bg-neutral-100"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1.5">
                            <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded-md ${
                              selectedChapterIndex === idx
                                ? "bg-white/20 text-white"
                                : "bg-neutral-200 text-neutral-800"
                            }`}>
                              {ch.time}
                            </span>
                            <span className="text-xs font-semibold opacity-70">
                              Part {idx + 1}
                            </span>
                          </div>

                          <h4 className="text-sm font-bold mb-1">
                            {ch.title}
                          </h4>

                          <p className={`text-xs leading-relaxed ${
                            selectedChapterIndex === idx ? "text-neutral-300" : "text-neutral-500"
                          }`}>
                            {ch.summary}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tab 3: Interactive Practice Quiz */}
                {activeTab === "quiz" && (
                  <div className="p-6 sm:p-8 space-y-6 overflow-y-auto">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-neutral-900">
                        Concept Mastery Quiz
                      </h3>
                      <button
                        onClick={() => setQuizAnswers({})}
                        className="text-xs text-neutral-500 hover:text-neutral-900 flex items-center gap-1 font-medium"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Reset Quiz</span>
                      </button>
                    </div>

                    <div className="space-y-6">
                      {selectedVideo.quizQuestions.map((q, qIdx) => {
                        const userAnswer = quizAnswers[qIdx];
                        const isAnswered = userAnswer !== undefined;
                        const isCorrect = userAnswer === q.correctIndex;

                        return (
                          <div key={qIdx} className="p-4 sm:p-5 rounded-2xl bg-neutral-50 border border-neutral-200/80 space-y-3">
                            <div className="flex items-start gap-2.5">
                              <span className="w-5 h-5 rounded-full bg-neutral-200 text-neutral-700 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                                {qIdx + 1}
                              </span>
                              <h4 className="text-sm font-bold text-neutral-950 leading-snug">
                                {q.question}
                              </h4>
                            </div>

                            <div className="space-y-2 pt-1 pl-7">
                              {q.options.map((opt, optIdx) => {
                                const isSelected = userAnswer === optIdx;
                                let btnStyle = "bg-white border-neutral-200 text-neutral-700 hover:border-neutral-400";

                                if (isAnswered) {
                                  if (optIdx === q.correctIndex) {
                                    btnStyle = "bg-emerald-50 border-emerald-500 text-emerald-900 font-semibold";
                                  } else if (isSelected) {
                                    btnStyle = "bg-rose-50 border-rose-500 text-rose-900 font-semibold";
                                  } else {
                                    btnStyle = "bg-white border-neutral-100 text-neutral-400 opacity-60";
                                  }
                                }

                                return (
                                  <button
                                    key={optIdx}
                                    onClick={() => !isAnswered && handleAnswerQuiz(qIdx, optIdx)}
                                    disabled={isAnswered}
                                    className={`w-full text-left p-3 rounded-xl border text-xs sm:text-sm transition-all flex items-center justify-between ${btnStyle}`}
                                  >
                                    <span>{opt}</span>
                                    {isAnswered && optIdx === q.correctIndex && (
                                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 ml-2" />
                                    )}
                                  </button>
                                );
                              })}
                            </div>

                            {isAnswered && (
                              <div className={`mt-3 p-3 rounded-xl text-xs leading-relaxed pl-7 ${
                                isCorrect ? "bg-emerald-100/60 text-emerald-950" : "bg-rose-100/60 text-rose-950"
                              }`}>
                                <span className="font-bold block mb-0.5">
                                  {isCorrect ? "Correct! Excellent recall." : "Explanation:"}
                                </span>
                                {q.explanation}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Tab 4: Flashcards */}
                {activeTab === "flashcards" && (
                  <div className="p-6 sm:p-8 flex flex-col items-center justify-center flex-1 space-y-6">
                    <div className="text-center">
                      <span className="text-xs text-neutral-400 font-medium">
                        Card {activeCardIndex + 1} of {selectedVideo.flashcards.length}
                      </span>
                      <h4 className="text-base font-bold text-neutral-900 mt-1">
                        Active Recall Flipcard
                      </h4>
                    </div>

                    {/* 3D Flip Card */}
                    <div
                      onClick={() => setCardFlipped(!cardFlipped)}
                      className="w-full max-w-[420px] h-[220px] rounded-3xl bg-neutral-900 text-white p-6 flex flex-col justify-between cursor-pointer shadow-xl transition-all duration-300 hover:scale-[1.02] select-none text-center"
                    >
                      <div className="text-[11px] uppercase tracking-wider text-neutral-400 font-semibold">
                        {cardFlipped ? "Answer" : "Question / Concept (Click to flip)"}
                      </div>

                      <div className="text-base sm:text-lg font-bold px-4 leading-snug">
                        {cardFlipped 
                          ? selectedVideo.flashcards[activeCardIndex].back 
                          : selectedVideo.flashcards[activeCardIndex].front
                        }
                      </div>

                      <div className="text-[11px] text-neutral-400 font-medium">
                        {cardFlipped ? "Tap card to see question" : "Tap card to reveal definition"}
                      </div>
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => {
                          setActiveCardIndex((prev) => (prev > 0 ? prev - 1 : selectedVideo.flashcards.length - 1));
                          setCardFlipped(false);
                        }}
                        className="px-4 py-2 rounded-full border border-neutral-200 text-xs font-semibold text-neutral-700 hover:bg-neutral-100"
                      >
                        Previous Card
                      </button>

                      <button
                        onClick={() => {
                          setActiveCardIndex((prev) => (prev < selectedVideo.flashcards.length - 1 ? prev + 1 : 0));
                          setCardFlipped(false);
                        }}
                        className="px-5 py-2 rounded-full bg-neutral-900 text-white text-xs font-semibold hover:bg-neutral-800"
                      >
                        Next Card
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Value Proposition Callouts */}
        <section className="max-w-[1100px] mx-auto px-6 mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-200/70 space-y-2">
            <div className="w-9 h-9 rounded-xl bg-red-100 text-red-600 flex items-center justify-center font-bold">
              1
            </div>
            <h3 className="text-base font-bold text-neutral-900">Zero Video Fatigue</h3>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Skip endless filler intros and tangents. Jump directly to the formula derivations and key principles.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-200/70 space-y-2">
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
              2
            </div>
            <h3 className="text-base font-bold text-neutral-900">Socratic Chat Mode</h3>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Ask follow-up questions to understand difficult terms without having to search through Reddit or Google.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-200/70 space-y-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
              3
            </div>
            <h3 className="text-base font-bold text-neutral-900">Automatic Spaced Repetition</h3>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Export generated flashcards directly into your YouLearn workspace to review them before midterms and finals.
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer onOpenDemo={() => {}} />
    </div>
  );
}
