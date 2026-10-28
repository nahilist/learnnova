"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import {
  Link2,
  FileText,
  BookOpen,
  MessageSquare,
  Sparkles,
  Play,
  Clock,
  CheckCircle2,
  ChevronDown,
  ArrowRight,
  Send,
  Layers,
  GraduationCap,
  FlaskConical,
  Compass,
  Star,
  AlertCircle,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  BookMarked,
  Glasses
} from "lucide-react";
import {
  HarvardSeal,
  UCLASeal,
  UPennSeal,
  CornellSeal,
  MichiganStateSeal,
  MITSeal,
  MichiganBlockM
} from "@/components/Icons";
import { summarizeYouTubeVideo } from "@/lib/api";

interface VideoData {
  id: string;
  youtubeId?: string;
  localVideoSrc?: string;
  title: string;
  subtitle?: string;
  thumbnailSrc?: string;
  channel: string;
  duration: string;
  url: string;
  description: string;
  takeaways: string[];
  chapters: {
    time: string;
    title: string;
    content: string;
  }[];
  chatHistory: {
    role: "user" | "assistant";
    content: string;
  }[];
  flashcards: {
    front: string;
    back: string;
  }[];
}

function parseTimeString(timeStr: string): number {
  const parts = timeStr.split(":").map(Number);
  if (parts.length === 3) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  }
  if (parts.length === 2) {
    return parts[0] * 60 + parts[1];
  }
  return 0;
}

function formatSeconds(secs: number): string {
  if (isNaN(secs)) return "00:00";
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = Math.floor(secs % 60);
  if (h > 0) {
    return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  }
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

const PRESET_VIDEOS: VideoData[] = [
  {
    id: "mit-discrete-time",
    youtubeId: "dQw4w9WgXcQ",
    localVideoSrc: "/7eEoiSCiM7vpz1kuEeEcW5o46o.mp4",
    title: "Discrete-Time Signals and Systems (MIT OpenCourseWare)",
    channel: "MIT OpenCourseWare • Prof. Allan Adams",
    duration: "1:22:45",
    url: "https://youtu.be/dQw4w9WgXcQ",
    description: "MIT OpenCourseWare offers access to hundreds of MIT courses online at ocw.mit.edu. Allan Adams discusses experiments involving electrons passing through apparatus with barriers that challenge classical intuition and discrete time signal systems.",
    takeaways: [
      "MIT OpenCourseWare offers access to hundreds of MIT courses online at ocw.mit.edu.",
      "The lecture begins with the foundational principles of differentiation and wave mechanics in discrete time systems.",
      "Allan Adams introduces the concept of quantum superposition using a double-barrier electron deflection experiment.",
      "Unlike classical particles with predetermined trajectories, quantum states represent a coherent blend of simultaneous outcomes."
    ],
    chapters: [
      {
        time: "00:00",
        title: "Figure 1: Introduction ...",
        content: "Figure 1: Introduction to discrete-time signal systems and foundational principles of differentiation and wave mechanics."
      },
      {
        time: "04:15",
        title: "Dense Structure an...",
        content: "Analyzing dense structural states and energy distributions within bounded physical mediums."
      },
      {
        time: "12:30",
        title: "Hardest problem o...",
        content: "Diving into the primary conceptual barrier: resolving classical intuition vs quantum probabilistic outcomes."
      },
      {
        time: "24:45",
        title: "Understanding Perfect...",
        content: "Mathematical proof of perfect reconstruction criteria, state vector evolution, and measurement invariance."
      },
      {
        time: "36:20",
        title: "1. Faster, Talk Smar...",
        content: "Techniques for rapid analytical derivations, concise problem synthesis, and formula simplification."
      },
      {
        time: "56:38",
        title: "Superposition of states...",
        content: "When sending in white electrons, the expected output is 50% due to the barriers, yet 50% is still white, proving superposition."
      },
      {
        time: "01:15:52",
        title: "Introduction to Formalism...",
        content: "Developing vector intuition and matrix formulation for complex observables in multi-state systems."
      }
    ],
    chatHistory: [
      {
        role: "assistant",
        content: "Welcome to the chat! Ask me anything. I may not always get everything right, but your feedback will help me improve!"
      },
      {
        role: "user",
        content: "What are the two properties of electrons discussed in they measured?"
      },
      {
        role: "assistant",
        content: "I notice you're asking about electron properties, but this video covers topics like discrete time systems and rather than electron properties."
      }
    ],
    flashcards: [
      {
        front: "Quantum Superposition",
        back: "The principle that a physical system exists partly in all theoretically possible states simultaneously until a measurement is made."
      },
      {
        front: "Stern-Gerlach Apparatus",
        back: "An experimental setup demonstrating that the spatial orientation of angular momentum is quantized at microscopic scales."
      },
      {
        front: "Wavefunction Collapse",
        back: "The reduction of a superposition of several eigenstates to a single eigenstate caused by interaction with an external observer or apparatus."
      }
    ]
  },
  {
    id: "tim-urban-procrastination",
    youtubeId: "arj7oStGLkU",
    thumbnailSrc: "/thumbnails/tim-urban.jpg",
    title: "Inside the mind of a procrastinator",
    subtitle: "Tim Urban tackles procrastination humorously.",
    channel: "TED • Tim Urban",
    duration: "14:03",
    url: "https://www.youtube.com/watch?v=arj7oStGLkU",
    description: "Tim Urban tackles procrastination humorously.",
    takeaways: [
      "The procrastinator's brain contains a Rational Decision-Maker and an Instant Gratification Monkey.",
      "The Panic Monster is dormant until a deadline gets terrifyingly close, temporarily driving the Monkey away.",
      "Long-term procrastination without deadlines (like career changes or health) generates persistent guilt and dissatisfaction.",
      "The 'Life Calendar' of 90 years represented as weeks shows that time is finite, prompting proactive action."
    ],
    chapters: [
      {
        time: "02:15",
        title: "The Brain of a Procrastinator",
        content: "Tim illustrates how the Rational Decision-Maker is overpowered by the Instant Gratification Monkey who only cares about what is easy and fun."
      },
      {
        time: "07:40",
        title: "The Panic Monster",
        content: "When deadlines approach, the Panic Monster wakes up, terrifying the monkey and allowing the rational mind to complete the project."
      },
      {
        time: "11:05",
        title: "Procrastination Without Deadlines",
        content: "Why non-deadline procrastination is far more dangerous: dreams and life goals are continually postponed because no panic monster arrives."
      }
    ],
    chatHistory: [
      {
        role: "user",
        content: "Why does Tim say non-deadline procrastination is the most dangerous?"
      },
      {
        role: "assistant",
        content: "Because in non-deadline situations—such as building a business, writing a book, or exercising—the Panic Monster never wakes up. The delay extends indefinitely, causing quiet, long-term regret rather than short-term stress."
      }
    ],
    flashcards: [
      {
        front: "Instant Gratification Monkey",
        back: "The cognitive metaphor representing impulsive desires for immediate pleasure over long-term strategic goals."
      },
      {
        front: "Panic Monster",
        back: "The psychological trigger activated when consequences become imminent, breaking procrastination paralysis."
      }
    ]
  },
  {
    id: "mit-algorithms",
    youtubeId: "0JUN9aDxVmI",
    thumbnailSrc: "/thumbnails/jelani-nelson.jpg",
    title: "Advanced Algorithms, Lecture 1",
    subtitle: "Course topics, word RAM, predecessor, etc.",
    channel: "Harvard University • Prof. Jelani Nelson",
    duration: "1:18:22",
    url: "https://www.youtube.com/watch?v=0JUN9aDxVmI",
    description: "Course topics, word RAM, predecessor, etc.",
    takeaways: [
      "The Word RAM model provides a realistic theoretical architecture assuming O(1) word-level bitwise operations.",
      "Predecessor and successor searches can beat the classical O(log n) comparison barrier using integer structures like Van Emde Boas trees.",
      "Hashing and randomized algorithms provide amortized constant-time lookups with high probability."
    ],
    chapters: [
      {
        time: "00:00",
        title: "Course Overview and Logistics",
        content: "Introduction to algorithmic paradigms: integer data structures, dynamic graphs, randomized sketches, and streaming."
      },
      {
        time: "18:45",
        title: "The Word RAM Model",
        content: "Formalizing computation bounds on modern 64-bit architectures using bit manipulation and constant-time operations."
      },
      {
        time: "42:10",
        title: "Predecessor Problem",
        content: "Given a set S of n integers, quickly find the largest element in S smaller than x."
      }
    ],
    chatHistory: [
      {
        role: "user",
        content: "What is the Predecessor Problem in algorithms?"
      },
      {
        role: "assistant",
        content: "The Predecessor Problem asks to find the largest value in a set that is less than or equal to a query key x. While binary search trees solve this in O(log n) time, integer data structures like y-fast tries can solve it in O(log log U) time."
      }
    ],
    flashcards: [
      {
        front: "Word RAM Model",
        back: "A model of computation where the computer consists of memory words of w bits each, supporting standard operations in O(1) time."
      },
      {
        front: "Van Emde Boas Tree",
        back: "A specialized tree data structure that supports associative array operations on integer keys in O(log log M) time."
      }
    ]
  },
  {
    id: "mit-brain",
    youtubeId: "ba-HMvDn_vU",
    thumbnailSrc: "/thumbnails/nancy-kanwisher.jpg",
    title: "Introduction to the Human Brain",
    subtitle: "MIT 9.13 The Human Brain, Spring 2019",
    channel: "MIT 9.13 • Prof. Nancy Kanwisher",
    duration: "1:08:45",
    url: "https://www.youtube.com/watch?v=ba-HMvDn_vU",
    description: "MIT 9.13 The Human Brain, Spring 2019",
    takeaways: [
      "The human cortex is organized into distinct specialized regions dedicated to specific cognitive functions.",
      "The Fusiform Face Area (FFA) responds selectively to human faces, distinguishing them from other visual categories.",
      "Functional Magnetic Resonance Imaging (fMRI) measures localized blood oxygenation levels (BOLD response) to map neural activity."
    ],
    chapters: [
      {
        time: "00:00",
        title: "The Grand Puzzle of the Human Mind",
        content: "Prof. Kanwisher outlines how 3 pounds of tissue produce conscious experience, visual recognition, and linguistic thought."
      },
      {
        time: "24:10",
        title: "Functional Specialization vs Distributed Processing",
        content: "Historic debate between phrenology, equipotentiality, and modern modular neuroanatomy."
      },
      {
        time: "48:30",
        title: "Discovering the Fusiform Face Area",
        content: "How pioneering fMRI scans proved extreme face-selective responses in the ventral visual stream."
      }
    ],
    chatHistory: [
      {
        role: "user",
        content: "What is the primary function of the Fusiform Face Area (FFA)?"
      },
      {
        role: "assistant",
        content: "The FFA is a specialized region in the ventral temporal cortex that selectively activates when humans recognize and process faces compared to objects or scenes."
      }
    ],
    flashcards: [
      {
        front: "Fusiform Face Area (FFA)",
        back: "A region in the inferior temporal lobe of the human brain specialized for facial recognition."
      },
      {
        front: "BOLD Signal",
        back: "Blood Oxygen Level Dependent signal measured in fMRI to infer localized neural activity based on magnetic hemoglobin properties."
      }
    ]
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
  const [inputUrl, setInputUrl] = useState("https://youtu.be/dQw4w9WgXcQ");
  const [currentVideo, setCurrentVideo] = useState<VideoData>(PRESET_VIDEOS[0]);
  const [activeTab, setActiveTab] = useState<"chat" | "flashcards" | "summary">("chat");
  const [cardIndex, setCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [userQuestion, setUserQuestion] = useState("");
  const [chatMessages, setChatMessages] = useState<{ role: "user" | "assistant"; content: string }[]>(
    PRESET_VIDEOS[0].chatHistory
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  // Video playback state
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(14);
  const [videoDuration, setVideoDuration] = useState(82 * 60 + 45);
  const [isMuted, setIsMuted] = useState(true);
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    setCurrentTime(videoRef.current.currentTime);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setCurrentTime(val);
    if (videoRef.current) {
      videoRef.current.currentTime = val;
    }
  };

  const handleSelectChapter = (index: number, timeStr: string) => {
    setActiveChapterIndex(index);
    const secs = parseTimeString(timeStr);
    if (videoRef.current) {
      videoRef.current.currentTime = secs;
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const handleSelectPreset = (video: VideoData) => {
    setCurrentVideo(video);
    setInputUrl(video.url);
    setChatMessages(video.chatHistory);
    setCardIndex(0);
    setIsFlipped(false);
    setActiveChapterIndex(0);
    setErrorMessage("");
    setActiveTab("chat");
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
      setIsPlaying(true);
    }
    const target = document.getElementById("summarizer-preview");
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleGenerateSummary = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUrl = inputUrl.trim();
    if (!cleanUrl) return;

    // Check if it matches any of the preset URLs
    const matched = PRESET_VIDEOS.find(
      (v) => v.url.toLowerCase() === cleanUrl.toLowerCase() || v.youtubeId === cleanUrl
    );
    if (matched) {
      handleSelectPreset(matched);
      return;
    }

    setIsProcessing(true);
    setErrorMessage("");

    try {
      const result = await summarizeYouTubeVideo(cleanUrl);
      const newVideo: VideoData = {
        id: result.id,
        youtubeId: result.youtubeId,
        title: result.title,
        channel: result.channel,
        duration: result.duration,
        url: result.url,
        description: result.summary,
        takeaways:
          result.keyTakeaways && result.keyTakeaways.length > 0
            ? result.keyTakeaways
            : ["Key takeaways synthesized by AI."],
        chapters:
          result.chapters && result.chapters.length > 0
            ? result.chapters.map((c) => ({ time: c.time, title: c.title, content: c.summary }))
            : [
                {
                  time: "00:00",
                  title: "Overview",
                  content: result.summary || "Summary generated from the video transcript."
                }
              ],
        chatHistory: [
          {
            role: "assistant",
            content: `I've analyzed "${result.title}". Ask me any questions about the concepts, formulas, or key arguments discussed!`
          }
        ],
        flashcards:
          result.flashcards && result.flashcards.length > 0
            ? result.flashcards
            : [
                {
                  front: result.title,
                  back: `Presented by ${result.channel}. Synthesized by AI.`
                }
              ]
      };

      setCurrentVideo(newVideo);
      setChatMessages(newVideo.chatHistory);
      setCardIndex(0);
      setIsFlipped(false);
      setActiveChapterIndex(0);

      const target = document.getElementById("summarizer-preview");
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to process YouTube video.";
      setErrorMessage(msg);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userQuestion.trim()) return;

    const newQuestion = userQuestion.trim();
    setUserQuestion("");
    const updated = [...chatMessages, { role: "user" as const, content: newQuestion }];
    setChatMessages(updated);

    // Provide immediate contextual tutor response matching the video
    setTimeout(() => {
      let reply = `Regarding "${newQuestion}": In this lecture, Prof. Allan Adams emphasizes that the physical and mathematical state transformations preserve coherence unless explicitly measured.`;
      
      const qLower = newQuestion.toLowerCase();
      if (qLower.includes("electron") || qLower.includes("quantum") || qLower.includes("superposition")) {
        reply = "In this section, Prof. Allan Adams explains that quantum states exist as linear combinations of basis vectors, meaning measurement does not reveal a pre-existing classical value but collapses the superposition into an observed eigenstate.";
      } else if (qLower.includes("discrete") || qLower.includes("system") || qLower.includes("signal")) {
        reply = "Discrete-time systems operate on discrete sequences indexed by integers n. Linear time-invariant (LTI) properties, impulse responses, and convolutional representations form the core mathematical backbone.";
      } else if (qLower.includes("summary") || qLower.includes("main point") || qLower.includes("takeaway")) {
        reply = `Here are the top 3 takeaways from "${currentVideo.title}":\n1. State evolution is governed by linear transformation rules.\n2. Non-intuitive experimental outcomes require formalizing states beyond classical intuition.\n3. Exact reconstruction is possible when sampling satisfies boundary constraints.`;
      }

      setChatMessages([
        ...updated,
        {
          role: "assistant",
          content: reply
        }
      ]);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-white text-neutral-900 flex flex-col font-sans selection:bg-neutral-900 selection:text-white relative overflow-x-hidden">
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
                disabled={isProcessing}
                style={{ backgroundColor: "#8e8e93", color: "#ffffff" }}
                className="w-full sm:w-auto h-[52px] px-7 rounded-full font-medium text-[15px] transition-all whitespace-nowrap hover:opacity-90 active:scale-[0.98] cursor-pointer shrink-0 disabled:opacity-60 flex items-center justify-center gap-2 shadow-2xs"
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <span>Generate Summary</span>
                )}
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
          <div className="bg-white rounded-t-[28px] sm:rounded-t-[36px] rounded-b-2xl sm:rounded-b-3xl border border-neutral-200/90 shadow-[0_24px_70px_-15px_rgba(0,0,0,0.08)] overflow-hidden">
            {/* Top Workspace Bar */}
            <div className="px-5 py-3 sm:px-6 sm:py-3.5 bg-[#fafafa] border-b border-neutral-200/80 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5" aria-hidden="true">
                  <span className="w-2.5 h-2.5 rounded-full bg-neutral-300"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-neutral-300"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-neutral-300"></span>
                </div>
                <span className="text-neutral-300 hidden sm:inline">|</span>
                <span className="font-semibold text-xs sm:text-sm text-neutral-900 tracking-tight flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>YouLearn Studio</span>
                </span>
                <span className="text-neutral-300">|</span>
                <span className="text-xs text-neutral-500 font-normal truncate max-w-[180px] sm:max-w-xs md:max-w-md">
                  {currentVideo.title}
                </span>
              </div>

              {/* Tabs: Chat, Flashcards, Summary */}
              <div className="inline-flex items-center p-1 rounded-full bg-neutral-200/70 text-xs font-medium">
                <button
                  type="button"
                  onClick={() => setActiveTab("chat")}
                  className={`px-4 py-1.5 rounded-full transition-all cursor-pointer ${
                    activeTab === "chat"
                      ? "bg-white text-neutral-900 shadow-2xs font-semibold"
                      : "text-neutral-600 hover:text-neutral-900"
                  }`}
                >
                  Chat
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("flashcards")}
                  className={`px-4 py-1.5 rounded-full transition-all cursor-pointer ${
                    activeTab === "flashcards"
                      ? "bg-white text-neutral-900 shadow-2xs font-semibold"
                      : "text-neutral-600 hover:text-neutral-900"
                  }`}
                >
                  Flashcards
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("summary")}
                  className={`px-4 py-1.5 rounded-full transition-all cursor-pointer ${
                    activeTab === "summary"
                      ? "bg-white text-neutral-900 shadow-2xs font-semibold"
                      : "text-neutral-600 hover:text-neutral-900"
                  }`}
                >
                  Summary
                </button>
              </div>
            </div>

            {/* 3-Column Studio Workspace matching screenshot */}
            <div className="studio-grid w-full min-h-[560px] divide-y md:divide-y-0 md:divide-x divide-neutral-200/80">
              
              {/* Left Column: Chapters / Outline */}
              <div className="w-full bg-[#fbfbfb] p-3.5 sm:p-4 flex flex-col justify-between overflow-hidden">
                <div>
                  <div className="flex items-center justify-between mb-3 px-1">
                    <span className="text-[11px] font-semibold tracking-wider uppercase text-neutral-400">
                      Chapters &amp; Sections
                    </span>
                    <span className="text-[10px] text-neutral-400 font-mono bg-neutral-100 px-2 py-0.5 rounded-full">
                      {currentVideo.chapters.length} parts
                    </span>
                  </div>

                  <div className="space-y-1.5 overflow-y-auto max-h-[460px] pr-0.5 scrollbar-thin">
                    {currentVideo.chapters.map((ch, idx) => {
                      const isActive = activeChapterIndex === idx;
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleSelectChapter(idx, ch.time)}
                          className={`w-full text-left p-2.5 rounded-xl border text-xs transition-all cursor-pointer flex items-center justify-between gap-2 ${
                            isActive
                              ? "bg-white border-blue-200/90 text-neutral-900 shadow-xs font-semibold ring-1 ring-blue-100"
                              : "bg-white/70 hover:bg-white border-neutral-200/70 text-neutral-600 hover:text-neutral-900"
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <span
                              className={`w-2 h-2 rounded-full shrink-0 ${
                                isActive ? "bg-blue-600" : "bg-neutral-300"
                              }`}
                            />
                            <span className="truncate text-[12.5px]" title={ch.title}>
                              {ch.title}
                            </span>
                          </div>
                          <span className="text-[10.5px] font-mono text-neutral-400 shrink-0">
                            {ch.time}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-3 mt-4 border-t border-neutral-200/70 text-[11px] text-neutral-500 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>Transcript Sync</span>
                  </span>
                  <span className="text-emerald-600 font-semibold font-mono text-[10px] uppercase">
                    Live
                  </span>
                </div>
              </div>

              {/* Center Column: Video Player Area */}
              <div className="w-full bg-black flex flex-col justify-between relative group overflow-hidden">
                <div className="relative w-full aspect-video min-h-[340px] md:h-full md:min-h-[480px] flex items-center justify-center bg-black">
                  {currentVideo.localVideoSrc ? (
                    <video
                      ref={videoRef}
                      src={currentVideo.localVideoSrc}
                      playsInline
                      autoPlay
                      loop
                      muted={isMuted}
                      onTimeUpdate={handleTimeUpdate}
                      onLoadedMetadata={() => {
                        if (videoRef.current) {
                          setVideoDuration(videoRef.current.duration);
                        }
                      }}
                      onClick={togglePlay}
                      className="w-full h-full object-cover cursor-pointer"
                    />
                  ) : currentVideo.youtubeId ? (
                    <iframe
                      src={`https://www.youtube-nocookie.com/embed/${currentVideo.youtubeId}?rel=0&autoplay=1`}
                      title={currentVideo.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full border-0"
                    />
                  ) : (
                    <div className="text-center text-white/70 p-6">
                      <Play className="w-12 h-12 mx-auto mb-2 text-white/50" />
                      <p className="text-xs">{currentVideo.url}</p>
                    </div>
                  )}

                  {/* Play Overlay if paused */}
                  {currentVideo.localVideoSrc && !isPlaying && (
                    <div
                      onClick={togglePlay}
                      className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center cursor-pointer transition-opacity"
                    >
                      <div className="w-16 h-16 rounded-full bg-white/95 text-neutral-900 flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-all">
                        <Play className="w-6 h-6 fill-neutral-900 ml-1" />
                      </div>
                    </div>
                  )}

                  {/* Unmute prompt banner if playing muted */}
                  {currentVideo.localVideoSrc && isMuted && isPlaying && (
                    <button
                      type="button"
                      onClick={toggleMute}
                      className="absolute top-3 right-3 px-3 py-1.5 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md text-white text-xs font-medium border border-white/20 flex items-center gap-1.5 transition-all cursor-pointer z-10"
                    >
                      <VolumeX className="w-3.5 h-3.5 text-amber-300" />
                      <span>Click to Unmute</span>
                    </button>
                  )}

                  {/* Video Floating Controls for local video */}
                  {currentVideo.localVideoSrc && (
                    <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/85 via-black/40 to-transparent text-white transition-opacity duration-200">
                      {/* Progress Scrubber */}
                      <div className="relative mb-2 w-full flex items-center">
                        <input
                          type="range"
                          min={0}
                          max={videoDuration || 100}
                          step={0.1}
                          value={currentTime}
                          onChange={handleSeek}
                          className="w-full h-1 bg-white/30 rounded-lg appearance-none cursor-pointer accent-white"
                        />
                      </div>

                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={togglePlay}
                            className="p-1 hover:text-white text-white/90 transition-colors cursor-pointer"
                            title={isPlaying ? "Pause" : "Play"}
                          >
                            {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white" />}
                          </button>

                          <button
                            type="button"
                            onClick={toggleMute}
                            className="p-1 hover:text-white text-white/90 transition-colors cursor-pointer"
                            title={isMuted ? "Unmute" : "Mute"}
                          >
                            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                          </button>

                          <span className="text-[11px] font-mono text-white/80">
                            {formatSeconds(currentTime)} / {currentVideo.duration}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="px-1.5 py-0.5 rounded bg-white/20 text-[10px] font-mono tracking-wider">
                            HD
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              if (videoRef.current) {
                                if (document.fullscreenElement) {
                                  document.exitFullscreen();
                                } else {
                                  videoRef.current.requestFullscreen();
                                }
                              }
                            }}
                            className="p-1 hover:text-white text-white/90 cursor-pointer"
                            title="Fullscreen"
                          >
                            <Maximize className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: AI Assistant (Chat / Flashcards / Summary) */}
              <div className="w-full bg-white flex flex-col justify-between h-full overflow-hidden">
                {/* Mode 1: Chat (Default matching screenshot) */}
                {activeTab === "chat" && (
                  <div className="flex flex-col h-full justify-between">
                    {/* Chat Messages Stream */}
                    <div className="p-4 space-y-3.5 overflow-y-auto max-h-[460px] scrollbar-thin flex-1">
                      {chatMessages.map((msg, idx) => (
                        <div
                          key={idx}
                          className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-[90%] rounded-2xl p-3.5 text-xs sm:text-[13px] leading-relaxed ${
                              msg.role === "user"
                                ? "bg-neutral-900 text-white rounded-br-xs"
                                : "bg-neutral-100 text-neutral-800 rounded-bl-xs border border-neutral-200/60"
                            }`}
                          >
                            {msg.content}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Chat Input & Suggestion Chips */}
                    <div className="p-3 border-t border-neutral-200/80 bg-neutral-50/70 space-y-2">
                      {/* Suggestion Chips */}
                      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[11px]">
                        <button
                          type="button"
                          onClick={() => {
                            setUserQuestion("Summarize the main takeaways of this lecture");
                          }}
                          className="px-2.5 py-1 rounded-full bg-white hover:bg-neutral-100 border border-neutral-200 text-neutral-600 whitespace-nowrap cursor-pointer transition-colors"
                        >
                          Summarize takeaways
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setUserQuestion("What is discrete time and signal processing?");
                          }}
                          className="px-2.5 py-1 rounded-full bg-white hover:bg-neutral-100 border border-neutral-200 text-neutral-600 whitespace-nowrap cursor-pointer transition-colors"
                        >
                          What is discrete time?
                        </button>
                      </div>

                      {/* Input form */}
                      <form onSubmit={handleSendMessage} className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-white border border-neutral-300 focus-within:ring-2 focus-within:ring-neutral-400">
                        <input
                          type="text"
                          placeholder="Ask anything about this video..."
                          value={userQuestion}
                          onChange={(e) => setUserQuestion(e.target.value)}
                          className="w-full text-xs sm:text-[13px] text-neutral-900 placeholder:text-neutral-400 bg-transparent focus:outline-none"
                        />
                        <button
                          type="submit"
                          className="p-1.5 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white cursor-pointer transition-all shrink-0"
                          title="Send message"
                        >
                          <Send className="w-3.5 h-3.5" />
                        </button>
                      </form>
                    </div>
                  </div>
                )}

                {/* Mode 2: Flashcards */}
                {activeTab === "flashcards" && (
                  <div className="p-5 flex flex-col items-center justify-center h-full space-y-4">
                    <span className="text-[11px] text-neutral-400 font-medium">
                      Card {cardIndex + 1} of {currentVideo.flashcards.length}
                    </span>

                    <div
                      onClick={() => setIsFlipped(!isFlipped)}
                      className="w-full h-[220px] rounded-2xl bg-neutral-900 text-white p-5 flex flex-col justify-between cursor-pointer shadow-lg hover:scale-[1.01] transition-all select-none text-center"
                    >
                      <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-semibold">
                        {isFlipped ? "Answer" : "Question (Click to flip)"}
                      </span>
                      <p className="text-sm font-semibold px-2 leading-relaxed">
                        {isFlipped
                          ? currentVideo.flashcards[cardIndex].back
                          : currentVideo.flashcards[cardIndex].front}
                      </p>
                      <span className="text-[10px] text-neutral-400 font-medium">
                        {isFlipped ? "Tap to view question" : "Tap to reveal answer"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                      <button
                        onClick={() => {
                          setCardIndex((prev) => (prev > 0 ? prev - 1 : currentVideo.flashcards.length - 1));
                          setIsFlipped(false);
                        }}
                        className="px-3.5 py-1.5 rounded-full border border-neutral-200 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 cursor-pointer"
                      >
                        Prev
                      </button>
                      <button
                        onClick={() => {
                          setCardIndex((prev) => (prev < currentVideo.flashcards.length - 1 ? prev + 1 : 0));
                          setIsFlipped(false);
                        }}
                        className="px-4 py-1.5 rounded-full bg-neutral-900 text-white text-xs font-semibold hover:bg-neutral-800 cursor-pointer"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}

                {/* Mode 3: Summary */}
                {activeTab === "summary" && (
                  <div className="p-5 space-y-5 overflow-y-auto max-h-[540px] scrollbar-thin">
                    <div>
                      <h4 className="font-semibold text-neutral-900 text-sm mb-2.5">
                        Overview &amp; Key Takeaways
                      </h4>
                      <ul className="space-y-2">
                        {currentVideo.takeaways.map((point, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-xs text-neutral-600 leading-relaxed">
                            <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 shrink-0 mt-1.5" />
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-3 border-t border-neutral-100 space-y-2.5">
                      <h5 className="font-semibold text-xs text-neutral-900 uppercase tracking-wider text-neutral-400">
                        Detailed Sections
                      </h5>
                      {currentVideo.chapters.map((ch, idx) => (
                        <div key={idx} className="p-3 rounded-xl bg-neutral-50 border border-neutral-200/70 space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="px-1.5 py-0.5 rounded bg-neutral-200 text-neutral-800 text-[10px] font-mono font-semibold">
                              {ch.time}
                            </span>
                            <span className="font-medium text-xs text-neutral-900 truncate">
                              {ch.title}
                            </span>
                          </div>
                          <p className="text-[11.5px] text-neutral-600 leading-relaxed font-normal">
                            {ch.content}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
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
                <div className="w-full aspect-[16/10] rounded-[22px] sm:rounded-[24px] overflow-hidden bg-neutral-100 mb-3.5 shadow-2xs group-hover:opacity-95 transition-all">
                  <img
                    src={vid.thumbnailSrc || `https://img.youtube.com/vi/${vid.youtubeId}/maxresdefault.jpg`}
                    alt={vid.title}
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                  />
                </div>

                <div>
                  <h3 className="font-semibold text-[17px] sm:text-[18px] text-[#111111] tracking-tight group-hover:text-blue-600 transition-colors leading-snug">
                    {vid.title}
                  </h3>
                  <p className="text-[14px] text-[#71717a] mt-1 font-normal leading-relaxed">
                    {vid.subtitle || vid.description}
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
