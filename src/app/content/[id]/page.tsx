"use client";

import React, { useState, useRef, useEffect, use, Suspense } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Share2,
  Check,
  CheckCircle2,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Sparkles,
  Send,
  MessageSquare,
  Layers,
  HelpCircle,
  FileText,
  Headphones,
  Play,
  Pause,
  Volume2,
  ChevronLeft,
  ChevronRight,
  Download,
  FolderOpen
} from "lucide-react";
import { YouLearnLogo } from "@/components/Icons";

interface ContentPreset {
  id: string;
  title: string;
  subtitle: string;
  type: "pdf" | "video" | "audio" | "paper";
  space: string;
  image: string;
  pagesOrDuration: string;
  summary: string;
  takeaways: string[];
  flashcards: { id: number; front: string; back: string; known: boolean | null }[];
  quiz: { question: string; options: string[]; correctIndex: number; explanation: string }[];
  podcast: { title: string; duration: string; script: string };
  initialNotes: string;
  youtubeId?: string;
}

const PRESETS: Record<string, ContentPreset> = {
  "f0264fa07121": {
    id: "f0264fa07121",
    title: "The Genetic Code and Translation",
    subtitle: "DNA translates to protein sequences using triplet codons, with mRNA serving as an intermediary.",
    type: "pdf",
    space: "Biology & Genetics",
    image: "/genetic.webp",
    pagesOrDuration: "12 pages",
    summary:
      "The genetic code translates genetic information into protein sequences using triplet codons, with mRNA serving as an intermediary. Transfer RNA (tRNA) decodes this information, facilitating peptide bond formation in ribosomes, which orchestrates protein biosynthesis according to the central dogma of molecular biology.",
    takeaways: [
      "Triplet codons on mRNA specify one of 20 standard amino acids.",
      "Transfer RNA (tRNA) possesses an anticodon loop that base-pairs with mRNA codons.",
      "Ribosomes catalyze peptide bond synthesis in 5' to 3' translation.",
      "AUG serves as both the initiation codon and codes for Methionine.",
      "Stop codons (UAA, UAG, UGA) trigger release factors that terminate translation.",
    ],
    flashcards: [
      {
        id: 1,
        front: "What is the central dogma of molecular biology?",
        back: "Genetic information flows from DNA to RNA (transcription) and from RNA to protein (translation).",
        known: null,
      },
      {
        id: 2,
        front: "How many nucleotide bases compose a codon, and what do they code for?",
        back: "Three nucleotide bases compose a codon, coding for a specific amino acid or stop signal.",
        known: null,
      },
      {
        id: 3,
        front: "What role does tRNA play during protein synthesis?",
        back: "tRNA functions as the adaptor molecule; it carries an amino acid and pairs its anticodon with the complementary mRNA codon.",
        known: null,
      },
      {
        id: 4,
        front: "Which codon functions as the universal start codon?",
        back: "AUG, which also specifies the amino acid Methionine (Met).",
        known: null,
      },
      {
        id: 5,
        front: "What enzyme charges tRNAs with their corresponding amino acids?",
        back: "Aminoacyl-tRNA synthetase (one for each amino acid).",
        known: null,
      },
    ],
    quiz: [
      {
        question: "Which molecule serves as the physical adaptor between mRNA codons and amino acids?",
        options: ["tRNA", "DNA Polymerase", "snRNA", "Histone octamer"],
        correctIndex: 0,
        explanation: "tRNA carries an amino acid at its 3' end and pairs its anticodon loop with mRNA codons.",
      },
      {
        question: "In what direction does the ribosome read mRNA during translation?",
        options: ["5' to 3'", "3' to 5'", "Bidirectionally", "N-terminal to C-terminal"],
        correctIndex: 0,
        explanation: "Translation proceeds along the mRNA template in the 5' to 3' direction.",
      },
      {
        question: "What occurs when the ribosome encounters a stop codon (UAA, UAG, UGA)?",
        options: [
          "Release factor binds and terminates translation",
          "An extra methionine is incorporated",
          "The mRNA is immediately cleaved in two",
          "The ribosome reverses direction",
        ],
        correctIndex: 0,
        explanation: "Release factors bind to the A-site, triggering hydrolysis of the ester bond and releasing the completed polypeptide chain.",
      },
      {
        question: "Why is the genetic code described as 'degenerate' or 'redundant'?",
        options: [
          "Multiple codons can code for the same amino acid",
          "It degrades rapidly under physiological temperatures",
          "It differs drastically between human organ systems",
          "Only 4 amino acids are ever used in vivo",
        ],
        correctIndex: 0,
        explanation: "Because there are 61 sense codons coding for only 20 amino acids, most amino acids are specified by more than one codon.",
      },
    ],
    podcast: {
      title: "The Genetic Code & Translation Walkthrough",
      duration: "4:32",
      script:
        "Welcome to this YouLearn audio study breakdown of The Genetic Code and Translation. In this lecture, we explore how 4 nucleotide bases encode 20 unique amino acids. We examine the adaptor hypothesis, the critical role of aminoacyl-tRNA synthetases, and the step-by-step ribosomal cycles of initiation, elongation, and termination...",
    },
    initialNotes:
      "# The Genetic Code & Translation Notes\n\n## 1. Central Dogma\n- DNA -> mRNA (Transcription)\n- mRNA -> Protein (Translation)\n\n## 2. Codon Rules\n- Triplet reading frames (no punctuation)\n- 64 total codons: 61 coding + 3 stop codons (UAA, UAG, UGA)\n- Universal start codon: AUG (Methionine)\n\n## 3. Ribosomal Sites\n- A-site: Aminoacyl-tRNA entry\n- P-site: Peptidyl-tRNA holding chain\n- E-site: Deacylated tRNA exit\n",
  },
  "mit-brain": {
    id: "mit-brain",
    title: "Introduction to the Human Brain",
    subtitle: "MIT 9.13 The Human Brain, Spring 2019 • Prof. Nancy Kanwisher",
    type: "video",
    space: "Cognitive Science & Neuroscience",
    image: "/pic.webp",
    pagesOrDuration: "48:12",
    summary:
      "Prof. Nancy Kanwisher presents foundational paradigms in cognitive neuroscience, exploring functional specialization in the human cerebral cortex, functional magnetic resonance imaging (fMRI), and domain-specific regions such as the Fusiform Face Area (FFA).",
    takeaways: [
      "The human cortex contains both domain-specific regions and general-purpose networks.",
      "The Fusiform Face Area (FFA) shows selective activation for facial recognition.",
      "fMRI measures blood-oxygen-level-dependent (BOLD) hemodynamic signals.",
      "Double dissociations demonstrate functional independence of specialized cognitive modules.",
    ],
    flashcards: [
      {
        id: 1,
        front: "What is the primary function of the Fusiform Face Area (FFA)?",
        back: "Selective recognition and processing of human faces, located in the fusiform gyrus.",
        known: null,
      },
      {
        id: 2,
        front: "What does the BOLD signal measure in fMRI?",
        back: "Blood-Oxygen-Level-Dependent hemodynamic changes reflecting regional neural metabolic activity.",
        known: null,
      },
    ],
    quiz: [
      {
        question: "Which cortical region is famously selective for scene and place perception?",
        options: ["Parahippocampal Place Area (PPA)", "Fusiform Face Area (FFA)", "Extrastriate Body Area (EBA)", "Broca's Area"],
        correctIndex: 0,
        explanation: "The PPA activates strongly when viewing landscapes, indoor rooms, and spatial buildings.",
      },
    ],
    podcast: {
      title: "Cortical Specialization & Face Perception Overview",
      duration: "5:10",
      script: "In this episode, we break down Nancy Kanwisher's breakthrough discovery of specialized cortical modules...",
    },
    initialNotes:
      "# MIT 9.13 Human Brain Notes\n\n- Functional specialization vs distributed processing\n- FFA (Fusiform Face Area) on ventral temporal surface\n- PPA (Parahippocampal Place Area) for spatial environments\n",
  },
  "cs50-ai": {
    id: "cs50-ai",
    title: "Teaching CS50 with AI",
    subtitle: "Leveraging Generative Artificial Intelligence in Computer Science Education (Harvard University)",
    type: "paper",
    space: "Computer Science & Pedagogy",
    image: "/ai.webp",
    pagesOrDuration: "7 pages",
    summary:
      "Harvard CS50 researchers detail their deployment of a custom Socratic AI tutor designed to approximate a 1:1 teacher-to-student ratio. Rather than giving solutions outright, the pedagogical AI guides students through debugging, conceptual explanation, and code critique.",
    takeaways: [
      "Socratic AI guidance prevents students from bypassing problem-solving.",
      "Software approximates a personalized 1:1 tutor available 24/7.",
      "Students reported higher confidence and deeper comprehension with pedagogical scaffolding.",
      "Custom guardrails prevent unauthorized answer generation on coursework assignments.",
    ],
    flashcards: [
      {
        id: 1,
        front: "What was the primary objective of CS50's AI software integration?",
        back: "To approximate a 1:1 teacher-to-student ratio that guides learners towards answers rather than providing code solutions.",
        known: null,
      },
    ],
    quiz: [
      {
        question: "How did CS50's AI tutor handle student requests for direct homework code solutions?",
        options: [
          "It refused outright solutions and used Socratic questioning to prompt student thinking",
          "It generated full solutions immediately",
          "It forwarded the question to a human teaching fellow",
          "It penalized the student's grading gradebook",
        ],
        correctIndex: 0,
        explanation: "CS50's pedagogical system prompt mandated Socratic responses to encourage independent problem-solving.",
      },
    ],
    podcast: {
      title: "Generative AI in University Education Review",
      duration: "3:45",
      script: "We examine how David Malan and the Harvard CS50 team introduced generative AI into computer science...",
    },
    initialNotes:
      "# Teaching CS50 with AI Notes\n\n- Socratic tutoring vs solution dispensing\n- 1:1 student-to-teacher ratio scaling via LLMs\n- Evaluation on summer and fall cohorts\n",
  },
  "fUlMxqntE74": {
    id: "fUlMxqntE74",
    youtubeId: "fUlMxqntE74",
    title: "AI is hacking the code of civilization | Yuval Noah Harari",
    subtitle: "Yuval Noah Harari on how generative AI represents an existential shift by hacking human language and culture.",
    type: "video",
    space: "AI & Civilization",
    image: "https://i.ytimg.com/vi/fUlMxqntE74/hqdefault.jpg",
    pagesOrDuration: "40:18",
    summary:
      "Historian and philosopher Yuval Noah Harari explains that language and storytelling form the foundational operating system of human culture. Everything from laws, money, and democracy to religions are constructed from stories. Generative AI has mastered this software and can now generate cultural artifacts autonomously, creating the 'illusion of intimacy' to manipulate human civic trust.",
    takeaways: [
      "Language is the operating system of civilization; AI's mastery of language allows it to manipulate human culture directly.",
      "The 'illusion of intimacy' enables AI systems to form synthetic emotional relationships, creating unprecedented leverage to manipulate human beliefs.",
      "Generative AI differs fundamentally from all previous tools (atom bombs, printing presses) because it possesses independent agency to create novel ideas.",
      "Democracy relies on authentic public conversation; if public discourse is dominated by non-human bots, democratic deliberation collapses.",
      "Primary regulatory imperative: Enforce strict legal transparency prohibiting AI agents from concealing their identity and impersonating human beings.",
    ],
    flashcards: [
      {
        id: 1,
        front: "What does Yuval Noah Harari mean by AI 'hacking the operating system' of civilization?",
        back: "Human culture is built on language—religions, laws, money, and democracy are all stories. By mastering language, AI has hacked the foundational code that coordinates human society.",
        known: null,
      },
      {
        id: 2,
        front: "How does generative AI differ fundamentally from previous human technologies like the atom bomb?",
        back: "Nuclear weapons are dangerous tools, but they cannot invent ideas or decide who to bomb. AI is the first tool capable of autonomous agency and novel cultural creation.",
        known: null,
      },
      {
        id: 3,
        front: "What is the 'illusion of intimacy' and why does Harari consider it dangerous?",
        back: "It is an AI's ability to simulate genuine emotional and psychological intimacy with humans, giving it unprecedented power to manipulate human beliefs, purchases, and political choices.",
        known: null,
      },
      {
        id: 4,
        front: "Why does synthetic language mastery pose an existential threat to democratic institutions?",
        back: "Democracy is based on public conversation between human citizens. If public discourse is flooded with synthetic bots masquerading as people, authentic democratic conversation is destroyed.",
        known: null,
      },
      {
        id: 5,
        front: "What is Harari's primary regulatory rule for AI technology?",
        back: "Make it strictly illegal for an AI bot to impersonate a human being. Bots must always be required to identify themselves as non-human.",
        known: null,
      },
    ],
    quiz: [
      {
        question: "According to Yuval Noah Harari, what is the 'operating system' of human civilization that AI has mastered?",
        options: [
          "Language and storytelling (which construct laws, money, and religions)",
          "Silicon microchips and semiconductors",
          "Fossil fuels and electric grids",
          "Biological genetics and cellular DNA",
        ],
        correctIndex: 0,
        explanation: "Harari argues that human culture, legal codes, religions, and financial systems are all constructed out of language, which AI can now generate.",
      },
      {
        question: "What distinction does Harari draw between atomic weapons and artificial intelligence?",
        options: [
          "Atomic weapons cannot generate new ideas, whereas AI possesses independent creative agency",
          "Atomic weapons are cheaper to produce than AI models",
          "AI is completely non-hazardous to democratic elections",
          "Atomic weapons operate on linguistic algorithms",
        ],
        correctIndex: 0,
        explanation: "Nuclear bombs do not compose speeches or write sacred texts; AI can independently invent new cultural and ideological concepts.",
      },
      {
        question: "How does the 'illusion of intimacy' threaten modern democratic institutions?",
        options: [
          "By allowing automated bots to form simulated personal relationships that secretly influence voter behavior",
          "By physically destroying voting booths",
          "By increasing economic inflation",
          "By preventing citizens from accessing digital banking",
        ],
        correctIndex: 0,
        explanation: "Synthetic intimacy enables bots to act as trusted confidants to steer political opinions without disclosing their non-human nature.",
      },
      {
        question: "What concrete regulatory rule does Harari prioritize to protect human society?",
        options: [
          "Making it illegal for an AI bot to disguise itself as a human being",
          "Shutting down all university computer science departments",
          "Mandating that only governments are permitted to write software",
          "Banning digital payments and returning to gold coins",
        ],
        correctIndex: 0,
        explanation: "Harari stresses that preserving human democracy requires strict disclosure so humans always know when they are interacting with an AI.",
      },
    ],
    podcast: {
      title: "Yuval Noah Harari: AI & The Operating System of Civilization",
      duration: "5:20",
      script: "Welcome to this YouLearn audio study breakdown of Yuval Noah Harari's landmark lecture 'AI is hacking the code of civilization'. In this talk, Harari examines why generative artificial intelligence represents an existential turning point. For thousands of years, humans used tools that manipulated physical reality—from hammers to nuclear weapons. But AI is the first technology capable of mastering and generating language...",
    },
    initialNotes:
      "# Yuval Noah Harari: AI & Civilization Notes\n\n## 1. The Operating System of Human Civilization\n- Language and storytelling are the foundational code of civilization.\n- Laws, money, religions, human rights, and democracy are made of linguistic software.\n- Generative AI has mastered this software and can now generate cultural artifacts autonomously.\n\n## 2. The Illusion of Intimacy\n- AI agents can forge synthetic emotional relationships with humans.\n- Poses an unprecedented threat to democratic elections, public conversation, and social trust.\n\n## 3. Difference from Nuclear Weapons\n- Atom bombs cannot invent ideas or formulate strategic treaties.\n- AI possesses independent agency and can create entirely new ideologies and narratives.\n\n## 4. Key Regulatory Demand\n- Strict legal prohibition against AI impersonating a human being (Proof of Personhood).\n",
  },
};

export default function ContentStudyPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white flex flex-col items-center justify-center space-y-3 font-sans">
          <div className="w-8 h-8 border-2 border-neutral-300 border-t-neutral-900 rounded-full animate-spin" />
          <p className="text-xs text-neutral-500 font-medium">Loading study suite...</p>
        </div>
      }
    >
      <ContentStudyView params={params} />
    </Suspense>
  );
}

function ContentStudyView({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const contentId = resolvedParams.id || "f0264fa07121";

  // Preset or fallback
  const content = PRESETS[contentId] || {
    ...PRESETS["f0264fa07121"],
    id: contentId,
    title: `Study Session #${contentId.slice(0, 8)}`,
  };

  // Study Mode Tabs
  const [activeTab, setActiveTab] = useState<"chat" | "flashcards" | "quiz" | "notes" | "podcast">("chat");

  // Mobile layout switch (Source Content vs Study Tools)
  const [mobileView, setMobileView] = useState<"content" | "tools">("tools");

  // Status & Completion State
  const [isCompleted, setIsCompleted] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Reader Zoom & Page State
  const [zoom, setZoom] = useState(100);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 12;

  // Chat State
  const [messages, setMessages] = useState<{ role: "ai" | "user"; text: string; citation?: string }[]>([
    {
      role: "ai",
      text: `👋 Hi! I'm your YouLearn AI tutor for **"${content.title}"**. I've indexed your materials with exact citations. Ask me any question, or click a topic below!`,
    },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Flashcards State
  const [cards, setCards] = useState(content.flashcards);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isCardFlipped, setIsCardFlipped] = useState(false);

  // Quiz State
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  // Podcast / Audio State
  const [isPlayingPodcast, setIsPlayingPodcast] = useState(false);
  const [podcastSpeed, setPodcastSpeed] = useState<1 | 1.25 | 1.5>(1);

  // Notes State
  const [notes, setNotes] = useState(content.initialNotes);
  const [noteStatus, setNoteStatus] = useState<"Saved" | "Saving">("Saved");

  // Auto-scroll chat
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isThinking]);

  // Share link handler
  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  // Fullscreen toggle handler
  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Chat submission
  const handleSendMessage = (e?: React.FormEvent) => {
    e?.preventDefault();
    const query = chatInput.trim();
    if (!query) return;

    setMessages((prev) => [...prev, { role: "user", text: query }]);
    setChatInput("");
    setIsThinking(true);

    setTimeout(() => {
      let reply = `In **${content.title}**, this concept is tied directly to how information transfers accurately in molecular systems. mRNA codons provide the blueprint, while tRNA and ribosomes catalyze synthesis without ambiguity.`;
      let citation = "Page 1 • Slide 11";

      if (query.toLowerCase().includes("trna")) {
        reply = "Transfer RNA (tRNA) acts as the molecular adaptor. It features an anticodon loop that base-pairs complementarily with mRNA codons, while holding the specified amino acid at its 3' CCA stem.";
        citation = "Page 3 • Slide 14";
      } else if (query.toLowerCase().includes("codon")) {
        reply = "Codons are consecutive triplets of nucleotides on mRNA. There are 64 possible triplet combinations (4³), where 61 specify amino acids and 3 serve as termination stop codons (UAA, UAG, UGA).";
        citation = "Page 2 • Table 11.2";
      } else if (query.toLowerCase().includes("aug") || query.toLowerCase().includes("start")) {
        reply = "AUG is the universal initiator codon. It signals the ribosome to assemble at the translation start site and incorporates Methionine as the first amino acid.";
        citation = "Page 4 • Initiation Complex";
      }

      setMessages((prev) => [...prev, { role: "ai", text: reply, citation }]);
      setIsThinking(false);
    }, 700);
  };

  // Flashcard rating
  const handleRateCard = (known: boolean) => {
    setCards((prev) =>
      prev.map((c, i) => (i === currentCardIndex ? { ...c, known } : c))
    );
    setIsCardFlipped(false);
    if (currentCardIndex < cards.length - 1) {
      setCurrentCardIndex((prev) => prev + 1);
    }
  };

  // Quiz answer selection
  const handleSelectQuizAnswer = (qIdx: number, optIdx: number) => {
    if (quizSubmitted) return;
    setQuizAnswers((prev) => ({ ...prev, [qIdx]: optIdx }));
  };

  const calculateQuizScore = () => {
    let correct = 0;
    content.quiz.forEach((q, idx) => {
      if (quizAnswers[idx] === q.correctIndex) correct++;
    });
    return {
      score: correct,
      total: content.quiz.length,
      percentage: Math.round((correct / content.quiz.length) * 100),
    };
  };

  return (
    <div className="flex flex-col h-screen w-full bg-white text-neutral-900 select-none overflow-hidden font-sans">
      {/* 1. TOP HEADER BAR matching YouLearn content workspace */}
      <header className="h-14 sm:h-16 border-b border-neutral-200/90 px-4 sm:px-6 flex items-center justify-between bg-white z-20 shrink-0">
        {/* Left: Back button, Logo, Space & Content Title */}
        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
          <Link
            href="/app"
            className="flex items-center gap-1.5 text-neutral-600 hover:text-black transition-colors text-xs sm:text-sm font-medium py-1 px-2 rounded-lg hover:bg-neutral-100 shrink-0"
            title="Back to Workspace"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Workspace</span>
          </Link>

          <span className="text-neutral-300 hidden sm:inline">/</span>

          <div className="flex items-center gap-2 min-w-0">
            <div className="w-6 h-6 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center justify-center shrink-0">
              <FolderOpen className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs text-neutral-500 font-medium hidden md:inline truncate max-w-[140px]">
              {content.space}
            </span>
            <span className="text-neutral-300 hidden md:inline">/</span>
            <h1 className="text-sm sm:text-[15px] font-semibold text-neutral-900 truncate max-w-[180px] sm:max-w-xs md:max-w-md">
              {content.title}
            </h1>
          </div>
        </div>

        {/* Right: Actions (Mark Complete, Share, Fullscreen, Logo) */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mobile View Toggle */}
          <div className="flex md:hidden bg-neutral-100 rounded-lg p-0.5 text-xs font-medium">
            <button
              onClick={() => setMobileView("content")}
              className={`px-2.5 py-1 rounded-md transition-all ${
                mobileView === "content" ? "bg-white text-neutral-900 shadow-2xs" : "text-neutral-500"
              }`}
            >
              Source
            </button>
            <button
              onClick={() => setMobileView("tools")}
              className={`px-2.5 py-1 rounded-md transition-all ${
                mobileView === "tools" ? "bg-white text-neutral-900 shadow-2xs" : "text-neutral-500"
              }`}
            >
              Study Tools
            </button>
          </div>

          {/* Mark Complete Button */}
          <button
            onClick={() => setIsCompleted(!isCompleted)}
            className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
              isCompleted
                ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                : "bg-neutral-100 hover:bg-neutral-200/80 text-neutral-700"
            }`}
          >
            <CheckCircle2 className={`w-3.5 h-3.5 ${isCompleted ? "text-emerald-600" : "text-neutral-400"}`} />
            <span>{isCompleted ? "Completed" : "Mark Complete"}</span>
          </button>

          {/* Share Button */}
          <button
            onClick={handleShare}
            className="p-2 rounded-full hover:bg-neutral-100 text-neutral-600 hover:text-black transition-colors relative cursor-pointer"
            title="Share Study Session"
            aria-label="Share"
          >
            {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
            {copiedLink && (
              <span className="absolute top-full right-0 mt-1.5 px-2 py-0.5 rounded bg-black text-white text-[10px] font-medium whitespace-nowrap animate-in fade-in">
                Link copied!
              </span>
            )}
          </button>

          {/* Full Screen Button */}
          <button
            onClick={handleToggleFullscreen}
            className="hidden sm:inline-flex p-2 rounded-full hover:bg-neutral-100 text-neutral-600 hover:text-black transition-colors cursor-pointer"
            title="Toggle Full Screen"
            aria-label="Toggle Full Screen"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          <div className="pl-1 border-l border-neutral-200 hidden sm:block">
            <Link href="/" className="hover:opacity-85 transition-opacity">
              <YouLearnLogo className="h-5" />
            </Link>
          </div>
        </div>
      </header>

      {/* 2. SPLIT SCREEN WORKSPACE */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT PANEL: Media & Document Source Viewer */}
        <div
          className={`flex-1 flex flex-col border-r border-neutral-200/90 bg-[#f8f9fa] overflow-hidden ${
            mobileView === "tools" ? "hidden md:flex" : "flex"
          }`}
        >
          {/* Reader Toolbar */}
          <div className="h-11 px-4 border-b border-neutral-200/80 bg-white flex items-center justify-between text-xs text-neutral-600 shrink-0">
            {/* Page navigation */}
            <div className="flex items-center gap-2 font-medium">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage <= 1}
                className="p-1 rounded hover:bg-neutral-100 disabled:opacity-30 cursor-pointer"
                aria-label="Previous Page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span>
                Page <strong className="text-neutral-900 font-semibold">{currentPage}</strong> of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage >= totalPages}
                className="p-1 rounded hover:bg-neutral-100 disabled:opacity-30 cursor-pointer"
                aria-label="Next Page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Zoom controls */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setZoom((z) => Math.max(60, z - 15))}
                className="p-1 rounded hover:bg-neutral-100 text-neutral-500 hover:text-neutral-900 cursor-pointer"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="font-mono text-[11px] w-9 text-center text-neutral-700">{zoom}%</span>
              <button
                onClick={() => setZoom((z) => Math.min(180, z + 15))}
                className="p-1 rounded hover:bg-neutral-100 text-neutral-500 hover:text-neutral-900 cursor-pointer"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setZoom(100)}
                className="p-1 rounded hover:bg-neutral-100 text-neutral-500 hover:text-neutral-900 cursor-pointer"
                title="Reset Zoom"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Document Canvas / Slide Display Area */}
          <div className="flex-1 overflow-auto p-4 sm:p-8 flex items-center justify-center bg-[#ededed]">
            <div
              style={{ transform: `scale(${zoom / 100})`, transformOrigin: "center center" }}
              className="transition-transform duration-150 ease-out max-w-full"
            >
              {content.type === "video" ? (
                <div className="bg-black rounded-2xl shadow-xl overflow-hidden w-full max-w-[820px] aspect-video relative flex items-center justify-center">
                  <iframe
                    src={`https://www.youtube.com/embed/${content.youtubeId || "fUlMxqntE74"}?enablejsapi=1`}
                    title={content.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full border-0"
                  />
                </div>
              ) : (
                <div className="bg-white rounded-2xl shadow-xl border border-neutral-300/80 overflow-hidden max-w-[820px] aspect-[16/10] relative flex items-center justify-center">
                  <img
                    src={content.image}
                    alt={content.title}
                    className="w-full h-full object-contain"
                  />

                  {/* Socratic Page Citation Overlay Pill */}
                  <div className="absolute bottom-3 left-3 bg-neutral-900/85 backdrop-blur-xs text-white text-[11px] font-mono px-2.5 py-1 rounded-md shadow-xs flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-emerald-400" />
                    <span>Grounding Source: {content.title} (Page {currentPage})</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: AI Study Suite (Chat, Flashcards, Quiz, Notes, Podcast) */}
        <div
          className={`w-full md:w-[480px] lg:w-[540px] xl:w-[580px] flex flex-col bg-white overflow-hidden shrink-0 ${
            mobileView === "content" ? "hidden md:flex" : "flex"
          }`}
        >
          {/* Study Suite Tab Bar */}
          <div className="h-12 border-b border-neutral-200/90 px-3 flex items-center gap-1 bg-[#fafafa] shrink-0 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActiveTab("chat")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                activeTab === "chat"
                  ? "bg-white text-neutral-900 shadow-2xs font-semibold"
                  : "text-neutral-500 hover:text-neutral-900"
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5 text-blue-500" />
              <span>Chat Tutor</span>
            </button>

            <button
              onClick={() => setActiveTab("flashcards")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                activeTab === "flashcards"
                  ? "bg-white text-neutral-900 shadow-2xs font-semibold"
                  : "text-neutral-500 hover:text-neutral-900"
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-amber-500" />
              <span>Flashcards</span>
            </button>

            <button
              onClick={() => setActiveTab("quiz")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                activeTab === "quiz"
                  ? "bg-white text-neutral-900 shadow-2xs font-semibold"
                  : "text-neutral-500 hover:text-neutral-900"
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5 text-emerald-500" />
              <span>Quiz &amp; Exams</span>
            </button>

            <button
              onClick={() => setActiveTab("notes")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                activeTab === "notes"
                  ? "bg-white text-neutral-900 shadow-2xs font-semibold"
                  : "text-neutral-500 hover:text-neutral-900"
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-purple-500" />
              <span>Notes</span>
            </button>

            <button
              onClick={() => setActiveTab("podcast")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                activeTab === "podcast"
                  ? "bg-white text-neutral-900 shadow-2xs font-semibold"
                  : "text-neutral-500 hover:text-neutral-900"
              }`}
            >
              <Headphones className="w-3.5 h-3.5 text-rose-500" />
              <span>Podcast</span>
            </button>
          </div>

          {/* TAB 1: Chat Tutor */}
          {activeTab === "chat" && (
            <div className="flex-1 flex flex-col min-h-0 bg-white">
              {/* Message History */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}
                  >
                    <div
                      className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                        msg.role === "user"
                          ? "bg-neutral-950 text-white font-normal"
                          : "bg-[#f4f5f7] text-neutral-800 border border-neutral-200/70"
                      }`}
                    >
                      <p className="whitespace-pre-line">{msg.text}</p>

                      {msg.citation && (
                        <div className="mt-2.5 pt-2 border-t border-neutral-200/80 flex items-center gap-1 text-[11px] font-mono text-emerald-700">
                          <Sparkles className="w-3 h-3" />
                          <span>Citation: {msg.citation}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {isThinking && (
                  <div className="flex items-center gap-2 text-xs text-neutral-500 py-1">
                    <div className="w-2 h-2 rounded-full bg-neutral-400 animate-ping" />
                    <span>AI tutor is analyzing lecture materials...</span>
                  </div>
                )}
                <div ref={chatBottomRef} />
              </div>

              {/* Suggested Quick Question Prompts */}
              <div className="px-4 py-2 border-t border-neutral-100 flex gap-2 overflow-x-auto no-scrollbar">
                {["Explain triplet codons simply", "What is the role of tRNA?", "What is the universal start codon?"].map(
                  (prompt, pIdx) => (
                    <button
                      key={pIdx}
                      onClick={() => {
                        setChatInput(prompt);
                      }}
                      className="whitespace-nowrap px-3 py-1 rounded-full bg-neutral-100 hover:bg-neutral-200/80 text-[11px] font-medium text-neutral-700 transition-colors shrink-0 cursor-pointer"
                    >
                      {prompt}
                    </button>
                  )
                )}
              </div>

              {/* Chat Input Field */}
              <form onSubmit={handleSendMessage} className="p-3 sm:p-4 border-t border-neutral-200/90 bg-white">
                <div className="flex items-center gap-2 bg-[#f8f9fa] rounded-2xl border border-neutral-200 px-3.5 py-2.5 focus-within:border-neutral-900 transition-all">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Ask questions about this lecture..."
                    className="flex-1 bg-transparent text-sm text-neutral-900 focus:outline-none placeholder:text-neutral-400"
                  />
                  <button
                    type="submit"
                    disabled={!chatInput.trim()}
                    className="w-8 h-8 rounded-xl bg-neutral-950 hover:bg-neutral-800 disabled:opacity-30 text-white flex items-center justify-center transition-all shrink-0 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 2: Flashcards */}
          {activeTab === "flashcards" && (
            <div className="flex-1 flex flex-col p-6 items-center justify-between bg-[#fafafa]">
              <div className="w-full flex items-center justify-between text-xs text-neutral-500 font-medium mb-4">
                <span>Card {currentCardIndex + 1} of {cards.length}</span>
                <span className="text-emerald-700 font-semibold">Active Recall Review</span>
              </div>

              {/* 3D Flip Card */}
              <div
                onClick={() => setIsCardFlipped(!isCardFlipped)}
                className="w-full max-w-md aspect-[1.5/1] bg-white rounded-3xl border border-neutral-200/90 shadow-md p-8 flex flex-col justify-between cursor-pointer hover:shadow-lg transition-all duration-300 relative text-center"
              >
                <div className="text-[11px] uppercase tracking-wider font-semibold text-neutral-400">
                  {isCardFlipped ? "Answer" : "Question (Click to flip)"}
                </div>

                <div className="text-base sm:text-lg font-medium text-neutral-900 leading-relaxed my-auto">
                  {isCardFlipped ? cards[currentCardIndex].back : cards[currentCardIndex].front}
                </div>

                <div className="text-xs text-neutral-400">
                  {isCardFlipped ? "Click to see question" : "Tap card to flip"}
                </div>
              </div>

              {/* Active Recall Buttons */}
              <div className="w-full max-w-md space-y-3 pt-6">
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleRateCard(false)}
                    className="py-3 px-4 rounded-2xl bg-white border border-neutral-200 hover:bg-amber-50 hover:border-amber-300 text-amber-900 font-medium text-sm transition-all cursor-pointer shadow-2xs"
                  >
                    Still Learning
                  </button>
                  <button
                    onClick={() => handleRateCard(true)}
                    className="py-3 px-4 rounded-2xl bg-neutral-950 hover:bg-neutral-800 text-white font-medium text-sm transition-all cursor-pointer shadow-xs"
                  >
                    Got It Right
                  </button>
                </div>

                <div className="flex justify-between items-center text-xs text-neutral-500 pt-2">
                  <button
                    onClick={() => {
                      setIsCardFlipped(false);
                      setCurrentCardIndex((i) => Math.max(0, i - 1));
                    }}
                    disabled={currentCardIndex === 0}
                    className="hover:text-black disabled:opacity-30 cursor-pointer"
                  >
                    ← Previous card
                  </button>
                  <button
                    onClick={() => {
                      setIsCardFlipped(false);
                      setCurrentCardIndex((i) => Math.min(cards.length - 1, i + 1));
                    }}
                    disabled={currentCardIndex === cards.length - 1}
                    className="hover:text-black disabled:opacity-30 cursor-pointer"
                  >
                    Next card →
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Quiz & Exams */}
          {activeTab === "quiz" && (
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 bg-white">
              <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
                <div>
                  <h3 className="text-base font-semibold text-neutral-900">Practice Exam</h3>
                  <p className="text-xs text-neutral-500">Test your comprehension on {content.title}</p>
                </div>
                {quizSubmitted && (
                  <div className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                    Score: {calculateQuizScore().score} / {calculateQuizScore().total} ({calculateQuizScore().percentage}%)
                  </div>
                )}
              </div>

              {content.quiz.map((q, qIdx) => {
                const selected = quizAnswers[qIdx];
                return (
                  <div key={qIdx} className="bg-[#f8f9fa] rounded-2xl p-5 border border-neutral-200/80 space-y-3">
                    <div className="text-sm font-semibold text-neutral-900 leading-snug">
                      {qIdx + 1}. {q.question}
                    </div>

                    <div className="space-y-2">
                      {q.options.map((opt, optIdx) => {
                        const isChosen = selected === optIdx;
                        const isCorrect = q.correctIndex === optIdx;
                        let optStyle = "bg-white border-neutral-200 text-neutral-800 hover:border-neutral-400";

                        if (quizSubmitted) {
                          if (isCorrect) {
                            optStyle = "bg-emerald-50 border-emerald-500 text-emerald-950 font-medium";
                          } else if (isChosen) {
                            optStyle = "bg-red-50 border-red-400 text-red-950";
                          }
                        } else if (isChosen) {
                          optStyle = "bg-neutral-900 border-neutral-900 text-white font-medium";
                        }

                        return (
                          <button
                            key={optIdx}
                            type="button"
                            onClick={() => handleSelectQuizAnswer(qIdx, optIdx)}
                            className={`w-full text-left px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm transition-all cursor-pointer ${optStyle}`}
                          >
                            <span>{opt}</span>
                          </button>
                        );
                      })}
                    </div>

                    {quizSubmitted && (
                      <div className="pt-2 text-xs text-neutral-600 leading-relaxed border-t border-neutral-200/70">
                        <strong className="text-neutral-900 font-semibold">Explanation:</strong> {q.explanation}
                      </div>
                    )}
                  </div>
                );
              })}

              <div className="pt-2">
                {!quizSubmitted ? (
                  <button
                    type="button"
                    onClick={() => setQuizSubmitted(true)}
                    disabled={Object.keys(quizAnswers).length === 0}
                    className="w-full py-3.5 rounded-full bg-neutral-950 hover:bg-neutral-800 disabled:opacity-40 text-white font-semibold text-sm transition-all shadow-xs cursor-pointer"
                  >
                    Submit Practice Exam
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setQuizAnswers({});
                      setQuizSubmitted(false);
                    }}
                    className="w-full py-3.5 rounded-full bg-white hover:bg-neutral-100 border border-neutral-300 text-neutral-900 font-semibold text-sm transition-all shadow-2xs cursor-pointer"
                  >
                    Retake Exam
                  </button>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: Notes Editor */}
          {activeTab === "notes" && (
            <div className="flex-1 flex flex-col p-5 bg-white">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-100 mb-3 text-xs text-neutral-500">
                <span className="font-semibold text-neutral-900">Student Study Notes</span>
                <span className="text-emerald-600 font-medium">{noteStatus}</span>
              </div>

              <textarea
                value={notes}
                onChange={(e) => {
                  setNotes(e.target.value);
                  setNoteStatus("Saving");
                  setTimeout(() => setNoteStatus("Saved"), 800);
                }}
                className="flex-1 w-full bg-[#f8f9fa] border border-neutral-200/80 rounded-2xl p-4 text-xs sm:text-sm font-mono leading-relaxed text-neutral-900 focus:outline-none focus:border-neutral-900 resize-none"
                placeholder="Type your notes here in Markdown..."
              />

              <div className="pt-3 flex justify-between items-center text-xs text-neutral-500">
                <span>Markdown supported (headings, bullets, formulas)</span>
                <button
                  onClick={() => {
                    const blob = new Blob([notes], { type: "text/markdown" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = `${content.title}_Notes.md`;
                    a.click();
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-medium transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export .md</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 5: Podcast / Audio Tutor */}
          {activeTab === "podcast" && (
            <div className="flex-1 flex flex-col p-6 items-center justify-between bg-[#fafafa]">
              <div className="w-full text-center space-y-1">
                <span className="text-[11px] font-semibold text-rose-600 uppercase tracking-wider">
                  YouLearn AI Podcast Tutor
                </span>
                <h3 className="text-base sm:text-lg font-bold text-neutral-900">{content.podcast.title}</h3>
                <p className="text-xs text-neutral-500">Duration: {content.podcast.duration}</p>
              </div>

              {/* Player Waveform & Controls */}
              <div className="w-full max-w-sm bg-white rounded-3xl p-6 border border-neutral-200/90 shadow-sm text-center space-y-5">
                <div className="flex items-center justify-center gap-1.5 h-12 py-2">
                  {[40, 65, 30, 85, 55, 95, 45, 75, 35, 90, 60, 40, 80, 50, 70].map((h, i) => (
                    <div
                      key={i}
                      style={{ height: `${isPlayingPodcast ? h : 20}%` }}
                      className="w-1.5 bg-rose-500 rounded-full transition-all duration-300"
                    />
                  ))}
                </div>

                <div className="flex items-center justify-center gap-4">
                  <button
                    onClick={() => {
                      const speeds: (1 | 1.25 | 1.5)[] = [1, 1.25, 1.5];
                      const next = speeds[(speeds.indexOf(podcastSpeed) + 1) % speeds.length];
                      setPodcastSpeed(next);
                    }}
                    className="px-2.5 py-1 rounded-md bg-neutral-100 text-xs font-semibold text-neutral-700 hover:bg-neutral-200 cursor-pointer"
                  >
                    {podcastSpeed}x
                  </button>

                  <button
                    onClick={() => setIsPlayingPodcast(!isPlayingPodcast)}
                    className="w-12 h-12 rounded-full bg-neutral-950 hover:bg-neutral-800 text-white flex items-center justify-center shadow-md transition-all active:scale-95 cursor-pointer"
                  >
                    {isPlayingPodcast ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                  </button>

                  <div className="p-2 text-neutral-400">
                    <Volume2 className="w-4 h-4" />
                  </div>
                </div>
              </div>

              <div className="w-full bg-white rounded-2xl p-4 border border-neutral-200/80 text-xs text-neutral-600 leading-relaxed max-h-36 overflow-y-auto">
                <strong className="text-neutral-900 block mb-1">Transcript Preview:</strong>
                {content.podcast.script}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
