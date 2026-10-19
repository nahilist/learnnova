"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Upload, 
  Link as LinkIcon, 
  Mic, 
  Search, 
  Plus, 
  BookOpen, 
  Sparkles, 
  Send, 
  ChevronRight, 
  FileText, 
  Video, 
  X,
  ArrowLeft,
  Compass,
  Play,
  Pause,
  Volume2,
  Check,
  Award,
  LogOut,
} from "lucide-react";
import { LearnNovaLogo } from "@/components/Icons";
import { authClient } from "@/lib/auth/client";
import {
  createDocument,
  createSpace,
  DEFAULT_DOCUMENTS,
  initializeUserWorkspace,
  uploadToStorage,
  type DocumentItem,
  type SpaceItem,
} from "@/lib/workspace";
import {
  askChatTutor,
  generateStudyFlashcards,
  generateStudyQuiz,
  summarizeYouTubeVideo,
  processPdfDocument,
} from "@/lib/api";


interface Flashcard {
  id: number;
  front: string;
  back: string;
  known: boolean | null;
}

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export default function AppWorkspacePage() {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const user = session?.user;
  const [activeTab, setActiveTab] = useState<"dashboard" | "study">("dashboard");
  const [studyTool, setStudyTool] = useState<"reader" | "flashcards" | "quiz" | "podcast">("reader");
  const [selectedDoc, setSelectedDoc] = useState<DocumentItem>(DEFAULT_DOCUMENTS[0]);

  const [chatMessages, setChatMessages] = useState<Array<{ sender: "user" | "ai"; text: string }>>([
    {
      sender: "ai",
      text: "👋 Hi! I'm your LearnNova AI tutor. I've analyzed your document. What would you like to explore? You can ask me to explain concepts, generate practice quizzes, or create flashcards.",
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploadType, setUploadType] = useState<"file" | "paste" | "record">("file");
  const [pasteUrl, setPasteUrl] = useState("");
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [isWorkspaceLoading, setIsWorkspaceLoading] = useState(false);
  const [isSavingContent, setIsSavingContent] = useState(false);
  const [workspaceError, setWorkspaceError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Dynamic Flashcards State
  const [flashcards, setFlashcards] = useState<Flashcard[]>([
    {
      id: 1,
      front: "Core Subject Overview",
      back: DEFAULT_DOCUMENTS[0].summaryText,
      known: null,
    },
    {
      id: 2,
      front: "Active Recall Principle",
      back: "Testing retrieval of concepts from memory produces dramatically higher exam retention than passive reading.",
      known: null,
    },
  ]);
  const [isFlashcardsLoading, setIsFlashcardsLoading] = useState(false);
  const [cardIndex, setCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Dynamic Quiz State
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([
    {
      id: 1,
      question: `Which curriculum domain covers "${DEFAULT_DOCUMENTS[0].title}"?`,
      options: [DEFAULT_DOCUMENTS[0].space, "Organic Chemistry", "Macroeconomics", "World History"],
      correctIndex: 0,
      explanation: `This document is categorized under the ${DEFAULT_DOCUMENTS[0].space} space.`,
    },
  ]);
  const [isQuizLoading, setIsQuizLoading] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  // Podcast State
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [audioSpeed, setAudioSpeed] = useState<"1x" | "1.5x" | "2x">("1x");

  const [spaces, setSpaces] = useState<SpaceItem[]>([]);
  const [recentDocs, setRecentDocs] = useState<DocumentItem[]>([]);

  useEffect(() => {
    let isActive = true;
    if (!user) {
      return;
    }

    const loadData = async () => {
      setIsWorkspaceLoading(true);
      try {
        const data = await initializeUserWorkspace({
          id: user.id,
          email: user.email,
          name: user.name,
        });
        if (!isActive) return;
        setSpaces(data.spaces);
        setRecentDocs(data.documents);
        if (data.documents.length > 0) {
          setSelectedDoc(data.documents[0]);
        }
        setIsWorkspaceLoading(false);
      } catch (err: unknown) {
        if (!isActive) return;
        const msg = err instanceof Error ? err.message : "Failed to load workspace";
        setWorkspaceError(`Workspace error: ${msg}`);
        setIsWorkspaceLoading(false);
      }
    };

    loadData();
    return () => {
      isActive = false;
    };
  }, [user]);

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleGenerateFlashcards = async (docToUse?: DocumentItem) => {
    const doc = docToUse || selectedDoc;
    setIsFlashcardsLoading(true);
    try {
      const res = await generateStudyFlashcards({
        content: doc.summaryText ? `${doc.title}: ${doc.summaryText}` : doc.title,
        count: 5,
      });
      if (res.flashcards && res.flashcards.length > 0) {
        setFlashcards(res.flashcards.map((f) => ({ ...f, known: null })));
        setCardIndex(0);
        setIsFlipped(false);
      }
    } catch (err: unknown) {
      console.error("Failed to generate flashcards from backend:", err);
    } finally {
      setIsFlashcardsLoading(false);
    }
  };

  const handleGenerateQuiz = async (docToUse?: DocumentItem) => {
    const doc = docToUse || selectedDoc;
    setIsQuizLoading(true);
    try {
      const res = await generateStudyQuiz({
        content: doc.summaryText ? `${doc.title}: ${doc.summaryText}` : doc.title,
        count: 4,
      });
      if (res.questions && res.questions.length > 0) {
        setQuizQuestions(res.questions);
        setSelectedAnswers({});
        setQuizSubmitted(false);
      }
    } catch (err: unknown) {
      console.error("Failed to generate quiz from backend:", err);
    } finally {
      setIsQuizLoading(false);
    }
  };

  const handleOpenDoc = (doc: DocumentItem) => {
    setSelectedDoc(doc);
    setActiveTab("study");
    setStudyTool("reader");
    setChatMessages([
      {
        sender: "ai",
        text: `Loaded "${doc.title}". I'm ready to quiz you, summarize key insights, or break down difficult concepts step by step!`,
      },
    ]);
    handleGenerateFlashcards(doc);
    handleGenerateQuiz(doc);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedFileName(file.name);
    }
  };

  const handleProcessUpload = async () => {
    if (!user) {
      setWorkspaceError("Your session expired. Please sign in again.");
      return;
    }

    setIsSavingContent(true);
    setWorkspaceError("");

    try {
      let title = uploadedFileName || (pasteUrl ? "YouTube Video Lecture" : "New Classroom Audio Recording");
      let summaryText = "AI generated study notes and practice flashcards are ready for review.";
      let pagesOrDuration = "1 page";
      let docType: "pdf" | "youtube" | "recording" = "pdf";
      let pregeneratedCards: Flashcard[] = [];
      let pregeneratedQuestions: QuizQuestion[] = [];
      let fileUrl: string | undefined = undefined;

      if (uploadType === "file" && fileInputRef.current?.files?.[0]) {
        const file = fileInputRef.current.files[0];
        docType = "pdf";
        try {
          const uploadRes = await uploadToStorage(file);
          fileUrl = uploadRes.url;
        } catch (uploadErr) {
          console.warn("Neon storage upload skipped:", uploadErr);
        }
        if (file.name.toLowerCase().endsWith(".pdf")) {
          const pdfData = await processPdfDocument(file);
          title = pdfData.title || file.name;
          pagesOrDuration = `${pdfData.pageCount} pages`;
          summaryText = pdfData.summary;
          if (pdfData.flashcards?.length) {
            pregeneratedCards = pdfData.flashcards.map((f) => ({ ...f, known: null }));
          }
          if (pdfData.quizQuestions?.length) {
            pregeneratedQuestions = pdfData.quizQuestions;
          }
        } else {
          title = file.name;
          summaryText = `Uploaded document: ${file.name}.`;
        }
      } else if (uploadType === "paste" && pasteUrl.trim()) {
        const url = pasteUrl.trim();
        if (url.includes("youtube.com") || url.includes("youtu.be")) {
          docType = "youtube";
          const ytData = await summarizeYouTubeVideo(url);
          title = ytData.title;
          pagesOrDuration = ytData.duration || "Video";
          summaryText = ytData.summary;
          if (ytData.flashcards?.length) {
            pregeneratedCards = ytData.flashcards.map((f) => ({ ...f, known: null }));
          }
          if (ytData.quizQuestions?.length) {
            pregeneratedQuestions = ytData.quizQuestions;
          }
        } else {
          docType = "youtube";
          title = "Web Resource";
          summaryText = `Content processed from ${url}.`;
        }
      } else if (uploadType === "record") {
        docType = "recording";
        title = "Live Classroom Recording";
        pagesOrDuration = "18 mins";
        summaryText = "Audio lecture transcription parsed into active study notes.";
      }

      const newDoc: DocumentItem = {
        id: `doc-${Date.now()}`,
        title,
        type: docType,
        space: spaces[0]?.title || "Machine Learning & AI",
        date: "Just now",
        pagesOrDuration,
        summaryText,
        fileUrl,
      };

      await createDocument(user.id, newDoc);
      setRecentDocs((prev) => [newDoc, ...prev.filter((d) => d.id !== newDoc.id)]);
      setSelectedDoc(newDoc);
      if (pregeneratedCards.length > 0) {
        setFlashcards(pregeneratedCards);
        setCardIndex(0);
        setIsFlipped(false);
      } else {
        handleGenerateFlashcards(newDoc);
      }
      if (pregeneratedQuestions.length > 0) {
        setQuizQuestions(pregeneratedQuestions);
        setSelectedAnswers({});
        setQuizSubmitted(false);
      } else {
        handleGenerateQuiz(newDoc);
      }

      setChatMessages([
        {
          sender: "ai",
          text: `🎉 Loaded "${newDoc.title}". I've extracted the core concepts, generated flashcards and practice questions. What would you like to review first?`,
        },
      ]);
      setUploadModalOpen(false);
      setActiveTab("study");
      setUploadedFileName("");
      setPasteUrl("");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to process upload.";
      setWorkspaceError(`Processing failed: ${msg}`);
    } finally {
      setIsSavingContent(false);
    }
  };

  const handleCreateSpace = async () => {
    const newName = prompt("Enter new space name (e.g. Organic Chemistry):")?.trim();
    if (!user || !newName) return;

    const newSpace: SpaceItem = {
      id: `space-${Date.now()}`,
      title: newName,
      count: 0,
      bgGradient: "from-blue-700 via-indigo-800 to-slate-900",
      description: "Custom user study collection.",
    };

    try {
      setWorkspaceError("");
      await createSpace(user.id, newSpace);
      setSpaces((prev) => [...prev, newSpace]);
    } catch {
      setWorkspaceError("The space could not be created. Please try again.");
    }
  };

  const handleSignOut = async () => {
    await authClient.signOut();
    router.replace("/signin");
  };

  const handleSendMessage = async (e?: React.FormEvent, customPrompt?: string) => {
    if (e) e.preventDefault();
    const userText = (customPrompt || inputMessage).trim();
    if (!userText) return;

    setChatMessages((prev) => [...prev, { sender: "user", text: userText }]);
    setInputMessage("");
    setIsAiThinking(true);

    try {
      const res = await askChatTutor({
        message: userText,
        context: selectedDoc.summaryText
          ? `Document Title: "${selectedDoc.title}" (${selectedDoc.space})\nSummary & Content: ${selectedDoc.summaryText}`
          : selectedDoc.title,
        history: chatMessages.slice(-6),
      });

      setChatMessages((prev) => [
        ...prev,
        { sender: "ai", text: res.reply || "Analyzed your question based on the study material." },
      ]);
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Could not connect to AI service.";
      setChatMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: `⚠️ AI Tutor notice: ${errorMsg}\nPlease ensure the FastAPI backend is running on port 8000.`,
        },
      ]);
    } finally {
      setIsAiThinking(false);
    }
  };

  const togglePodcastAudio = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setIsAudioPlaying(!isAudioPlaying);
      return;
    }

    if (isAudioPlaying) {
      window.speechSynthesis.cancel();
      setIsAudioPlaying(false);
    } else {
      window.speechSynthesis.cancel();
      const narrationText = `Welcome to LearnNova Audio Review. Today we are breaking down: ${selectedDoc.title}. Summary: ${selectedDoc.summaryText}. Pay special attention to these core takeaways for upcoming examinations.`;
      const utterance = new SpeechSynthesisUtterance(narrationText);
      utterance.rate = audioSpeed === "2x" ? 1.6 : audioSpeed === "1.5x" ? 1.3 : 1.0;
      utterance.onend = () => setIsAudioPlaying(false);
      utterance.onerror = () => setIsAudioPlaying(false);
      window.speechSynthesis.speak(utterance);
      setIsAudioPlaying(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfcfc] text-neutral-900 flex flex-col md:flex-row selection:bg-neutral-200">
      
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r border-neutral-200/80 p-4 flex flex-col justify-between shrink-0">
        <div>
          {/* Logo & workspace title */}
          <div className="flex items-center justify-between pb-6 mb-4 border-b border-neutral-100">
            <Link href="/" className="hover:opacity-80 transition-opacity">
              <LearnNovaLogo />
            </Link>
          </div>

          {/* Quick Add Button */}
          <button
            onClick={() => {
              setUploadType("file");
              setUploadModalOpen(true);
            }}
            className="w-full py-2.5 px-3.5 mb-5 rounded-2xl bg-neutral-900 hover:bg-black text-white text-xs font-medium flex items-center justify-center gap-2 shadow-xs transition-all active:scale-[0.98] cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Content</span>
          </button>

          {/* Navigation Links */}
          <nav className="space-y-1 text-xs font-medium text-neutral-600">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left transition-colors cursor-pointer ${
                activeTab === "dashboard"
                  ? "bg-neutral-100 text-neutral-900 font-semibold"
                  : "hover:bg-neutral-50 hover:text-neutral-900"
              }`}
            >
              <Compass className="w-4 h-4 text-neutral-500" />
              <span>Explore &amp; Spaces</span>
            </button>

            <button
              onClick={() => {
                setActiveTab("study");
              }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left transition-colors cursor-pointer ${
                activeTab === "study"
                  ? "bg-neutral-100 text-neutral-900 font-semibold"
                  : "hover:bg-neutral-50 hover:text-neutral-900"
              }`}
            >
              <BookOpen className="w-4 h-4 text-neutral-500" />
              <span>Study Workspace</span>
            </button>

            <Link
              href="/pricing"
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left hover:bg-neutral-50 hover:text-neutral-900 transition-colors"
            >
              <Sparkles className="w-4 h-4 text-neutral-400" />
              <span>Pricing &amp; Plans</span>
            </Link>
          </nav>

          {/* Spaces header */}
          <div className="pt-6 mt-6 border-t border-neutral-100">
            <div className="flex items-center justify-between text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-2 px-3">
              <span>My Spaces</span>
              <button
                onClick={handleCreateSpace}
                className="hover:text-black cursor-pointer"
                title="Create Space"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-0.5 text-xs text-neutral-700">
              {spaces.map((space) => (
                <button
                  key={space.id}
                  onClick={() => {
                    if (recentDocs[0]) handleOpenDoc(recentDocs[0]);
                  }}
                  className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg hover:bg-neutral-50 text-left truncate cursor-pointer"
                >
                  <span className="truncate">{space.title}</span>
                  <span className="text-[10px] text-neutral-400 font-mono ml-2">{space.count}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Upgrade Banner */}
        <div className="pt-4 mt-6 border-t border-neutral-100">
          <Link
            href="/pricing"
            className="block p-3 rounded-2xl bg-neutral-950 text-white text-xs hover:shadow-md transition-all group"
          >
            <div className="flex items-center justify-between font-semibold mb-1">
              <span>Unlimited Plan</span>
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <p className="text-[11px] text-neutral-400 mb-2">
              Unlimited uploads, video lessons &amp; audio podcasts.
            </p>
            <span className="inline-block text-[10px] font-semibold text-emerald-400 group-hover:underline">
              Upgrade now →
            </span>
          </Link>
          <button
            type="button"
            onClick={handleSignOut}
            className="mt-3 w-full flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-950"
          >
            <LogOut className="h-3.5 w-3.5" />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        {activeTab === "dashboard" ? (
          /* Dashboard Home View */
          <div className="max-w-5xl mx-auto px-6 py-10">
            {/* Header Greeting */}
            <div className="mb-10 text-center sm:text-left">
              <h1 className="text-3xl sm:text-4xl font-semibold text-neutral-900 tracking-tight mb-2">
                What do you want to learn?
              </h1>
              <p className="text-sm text-neutral-500">
                Upload lectures, PDFs, or paste links to generate notes and chat with your AI tutor.
              </p>
            </div>

            {workspaceError && (
              <div
                role="alert"
                className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
              >
                {workspaceError}
              </div>
            )}

            {isWorkspaceLoading && (
              <div className="mb-6 flex items-center gap-2 text-sm text-neutral-500" aria-live="polite">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-neutral-200 border-t-neutral-900" />
                Loading your workspace...
              </div>
            )}

            {/* 3 Upload Action Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
              {/* Card 1: Upload */}
              <div
                onClick={() => {
                  setUploadType("file");
                  setUploadModalOpen(true);
                }}
                className="bg-white rounded-3xl p-6 border border-neutral-200/90 hover:border-neutral-300 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div className="w-10 h-10 rounded-2xl bg-neutral-100 group-hover:bg-neutral-900 group-hover:text-white flex items-center justify-center text-neutral-800 transition-colors mb-4">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-base text-neutral-900 mb-1">Upload</h3>
                  <p className="text-xs text-neutral-500">PDF, audio, video, slides</p>
                </div>
              </div>

              {/* Card 2: Paste */}
              <div
                onClick={() => {
                  setUploadType("paste");
                  setUploadModalOpen(true);
                }}
                className="bg-white rounded-3xl p-6 border border-neutral-200/90 hover:border-neutral-300 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div className="w-10 h-10 rounded-2xl bg-neutral-100 group-hover:bg-neutral-900 group-hover:text-white flex items-center justify-center text-neutral-800 transition-colors mb-4">
                  <LinkIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-base text-neutral-900 mb-1">Paste</h3>
                  <p className="text-xs text-neutral-500">YouTube, website, text</p>
                </div>
              </div>

              {/* Card 3: Record */}
              <div
                onClick={() => {
                  setUploadType("record");
                  setUploadModalOpen(true);
                }}
                className="bg-white rounded-3xl p-6 border border-neutral-200/90 hover:border-neutral-300 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div className="w-10 h-10 rounded-2xl bg-neutral-100 group-hover:bg-neutral-900 group-hover:text-white flex items-center justify-center text-neutral-800 transition-colors mb-4">
                  <Mic className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-base text-neutral-900 mb-1">Record</h3>
                  <p className="text-xs text-neutral-500">Record class, video call</p>
                </div>
              </div>
            </div>

            {/* Quick Search Bar */}
            <div className="bg-white rounded-2xl border border-neutral-200/90 p-2 sm:p-2.5 shadow-xs flex items-center gap-3 mb-12">
              <Search className="w-4 h-4 text-neutral-400 ml-2" />
              <input
                type="text"
                placeholder="Ask your AI tutor anything or search library..."
                className="flex-1 bg-transparent text-sm text-neutral-800 placeholder-neutral-400 focus:outline-none"
              />
              <button
                onClick={() => {
                  if (recentDocs[0]) handleOpenDoc(recentDocs[0]);
                }}
                className="px-4 py-2 rounded-xl bg-neutral-900 hover:bg-black text-white text-xs font-medium cursor-pointer"
              >
                Ask Tutor
              </button>
            </div>

            {/* Spaces Grid */}
            <div className="mb-12">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-neutral-900">My Spaces</h2>
                <button
                  onClick={() => alert("Viewing all 3 course spaces")}
                  className="text-xs text-neutral-500 hover:text-black font-medium"
                >
                  View all
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {spaces.map((space) => (
                  <div
                    key={space.id}
                    onClick={() => {
                      if (recentDocs[0]) handleOpenDoc(recentDocs[0]);
                    }}
                    className="bg-white rounded-3xl border border-neutral-200/80 overflow-hidden shadow-2xs hover:shadow-md transition-all cursor-pointer group"
                  >
                    <div className={`h-24 bg-linear-to-r ${space.bgGradient} p-4 flex items-end`}>
                      <span className="text-xs font-semibold text-white/90 bg-black/30 px-2 py-0.5 rounded-md backdrop-blur-xs">
                        {space.count} items
                      </span>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-sm text-neutral-900 mb-1 group-hover:text-black transition-colors">
                        {space.title}
                      </h3>
                      <p className="text-[11px] text-neutral-500 line-clamp-2">
                        {space.description}
                      </p>
                    </div>
                  </div>
                ))}
                {!isWorkspaceLoading && spaces.length === 0 && (
                  <div className="sm:col-span-3 rounded-3xl border border-dashed border-neutral-300 bg-white p-8 text-center text-sm text-neutral-500">
                    Create your first space with the + button in the sidebar.
                  </div>
                )}
              </div>
            </div>

            {/* Recents List */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-neutral-900">Recent Materials</h2>
              </div>

              <div className="bg-white rounded-3xl border border-neutral-200/80 divide-y divide-neutral-100 shadow-2xs overflow-hidden">
                {recentDocs.map((doc) => (
                  <div
                    key={doc.id}
                    onClick={() => handleOpenDoc(doc)}
                    className="p-4 sm:p-5 flex items-center justify-between hover:bg-neutral-50 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-9 h-9 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-700 shrink-0 group-hover:scale-105 transition-transform">
                        {doc.type === "pdf" ? (
                          <FileText className="w-4 h-4 text-red-500" />
                        ) : doc.type === "recording" ? (
                          <Mic className="w-4 h-4 text-emerald-500" />
                        ) : (
                          <Video className="w-4 h-4 text-red-600" />
                        )}
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-neutral-900 group-hover:underline">
                          {doc.title}
                        </h4>
                        <span className="text-xs text-neutral-400">
                          {doc.space} • {doc.pagesOrDuration}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-neutral-400">
                      <span>{doc.date}</span>
                      <ChevronRight className="w-4 h-4 text-neutral-300 group-hover:text-neutral-900 group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </div>
                ))}
                {!isWorkspaceLoading && recentDocs.length === 0 && (
                  <div className="p-8 text-center text-sm text-neutral-500">
                    Add your first learning material to start studying.
                  </div>
                )}
              </div>
            </div>

          </div>
        ) : (
          /* Active Multi-Mode Study Workspace */
          <div className="h-full flex flex-col lg:flex-row">
            
            {/* Left Study Area */}
            <div className="flex-1 bg-white p-6 sm:p-8 border-b lg:border-b-0 lg:border-r border-neutral-200 flex flex-col justify-between overflow-y-auto">
              <div>
                {/* Workspace Top Toolbar */}
                <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-neutral-100 mb-6">
                  <button
                    onClick={() => setActiveTab("dashboard")}
                    className="flex items-center gap-2 text-xs font-semibold text-neutral-600 hover:text-black cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Spaces</span>
                  </button>

                  {/* 4 Study Mode Switchers */}
                  <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-xl text-xs font-medium">
                    <button
                      onClick={() => setStudyTool("reader")}
                      className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                        studyTool === "reader" ? "bg-white text-neutral-950 font-semibold shadow-xs" : "text-neutral-500 hover:text-black"
                      }`}
                    >
                      📖 Notes &amp; Reader
                    </button>
                    <button
                      onClick={() => setStudyTool("flashcards")}
                      className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                        studyTool === "flashcards" ? "bg-white text-neutral-950 font-semibold shadow-xs" : "text-neutral-500 hover:text-black"
                      }`}
                    >
                      🗂 Flashcards
                    </button>
                    <button
                      onClick={() => setStudyTool("quiz")}
                      className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                        studyTool === "quiz" ? "bg-white text-neutral-950 font-semibold shadow-xs" : "text-neutral-500 hover:text-black"
                      }`}
                    >
                      📝 Practice Exam
                    </button>
                    <button
                      onClick={() => setStudyTool("podcast")}
                      className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                        studyTool === "podcast" ? "bg-white text-neutral-950 font-semibold shadow-xs" : "text-neutral-500 hover:text-black"
                      }`}
                    >
                      🎙 AI Podcast
                    </button>
                  </div>
                </div>

                {/* Mode 1: Document Reader View */}
                {studyTool === "reader" && (
                  <div className="max-w-2xl mx-auto space-y-5 animate-in fade-in duration-200">
                    <div className="flex items-center justify-between text-xs text-neutral-500 font-mono">
                      <span className="inline-block text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                        Active Study Material • {selectedDoc.space}
                      </span>
                      <span>{selectedDoc.pagesOrDuration}</span>
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-serif font-bold text-neutral-900 leading-tight">
                      {selectedDoc.title}
                    </h2>

                    <div className="text-sm sm:text-[15px] text-neutral-700 leading-relaxed font-sans space-y-3">
                      <p className="whitespace-pre-line">{selectedDoc.summaryText}</p>
                    </div>

                    <div className="p-4 sm:p-5 bg-emerald-50/90 border-l-4 border-emerald-500 rounded-r-2xl text-xs sm:text-sm text-emerald-950 font-medium my-4 space-y-1.5">
                      <div className="font-bold text-emerald-900 flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-emerald-700" />
                        <span>High-Yield Study Focus:</span>
                      </div>
                      <p className="leading-relaxed">
                        LearnNova AI has processed this material into active recall cards and practice exam questions. Test yourself frequently to reinforce conceptual memory.
                      </p>
                    </div>

                    {/* Quick prompts */}
                    <div className="pt-6 border-t border-neutral-100 flex flex-wrap gap-2 text-xs">
                      <button
                        onClick={() => {
                          handleSendMessage(undefined, `Generate 3 practice exam questions based on "${selectedDoc.title}"`);
                        }}
                        className="px-3.5 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-medium cursor-pointer flex items-center gap-1.5"
                      >
                        💡 Generate 3-question quiz
                      </button>
                      <button
                        onClick={() => {
                          handleSendMessage(undefined, `Summarize the core concepts and exam formulas for "${selectedDoc.title}"`);
                        }}
                        className="px-3.5 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-medium cursor-pointer flex items-center gap-1.5"
                      >
                        📝 Summarize key takeaways
                      </button>
                      <button
                        onClick={() => {
                          setStudyTool("flashcards");
                          handleGenerateFlashcards();
                        }}
                        className="px-3.5 py-2 rounded-xl bg-neutral-900 hover:bg-black text-white font-medium cursor-pointer flex items-center gap-1.5"
                      >
                        🗂 Generate Fresh Flashcards
                      </button>
                    </div>
                  </div>
                )}

                {/* Mode 2: Flashcards View */}
                {studyTool === "flashcards" && (
                  <div className="max-w-xl mx-auto py-4 animate-in fade-in duration-200">
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-neutral-500 mb-4 font-mono">
                      <span>Card {flashcards.length > 0 ? cardIndex + 1 : 0} of {flashcards.length}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-emerald-600 font-semibold">
                          Mastery: {flashcards.length > 0 ? Math.round((flashcards.filter((f) => f.known === true).length / flashcards.length) * 100) : 0}%
                        </span>
                        <button
                          onClick={() => handleGenerateFlashcards()}
                          disabled={isFlashcardsLoading}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-[11px] font-sans font-medium text-neutral-800 cursor-pointer disabled:opacity-50"
                        >
                          <Sparkles className={`w-3 h-3 text-amber-500 ${isFlashcardsLoading ? "animate-spin" : ""}`} />
                          <span>{isFlashcardsLoading ? "Generating..." : "Generate Cards"}</span>
                        </button>
                      </div>
                    </div>

                    {isFlashcardsLoading ? (
                      <div className="w-full h-64 rounded-3xl border border-neutral-200 bg-neutral-50 flex flex-col items-center justify-center p-8 text-neutral-500">
                        <div className="w-6 h-6 border-2 border-neutral-300 border-t-neutral-900 rounded-full animate-spin mb-3" />
                        <p className="text-xs font-medium">Generating AI flashcards for {selectedDoc.title}...</p>
                      </div>
                    ) : flashcards.length > 0 && flashcards[cardIndex] ? (
                      <>
                        {/* 3D Flip Card */}
                        <div
                          onClick={() => setIsFlipped(!isFlipped)}
                          className="w-full h-64 sm:h-72 bg-neutral-50 hover:bg-neutral-100/70 rounded-3xl border border-neutral-200 p-8 flex flex-col justify-between text-center shadow-xs cursor-pointer select-none transition-all duration-200 relative"
                        >
                          <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                            {isFlipped ? "Answer" : "Question (Click to flip)"}
                          </span>

                          <div className="text-base sm:text-lg font-medium text-neutral-900 leading-snug px-4">
                            {isFlipped ? flashcards[cardIndex].back : flashcards[cardIndex].front}
                          </div>

                          <span className="text-[11px] text-neutral-400">
                            {isFlipped ? "Click to return to question" : "Click anywhere to reveal answer"}
                          </span>
                        </div>

                        {/* Action buttons: Don't know / Got it */}
                        <div className="flex items-center justify-center gap-4 mt-6">
                          <button
                            onClick={() => {
                              const updated = [...flashcards];
                              updated[cardIndex].known = false;
                              setFlashcards(updated);
                              setIsFlipped(false);
                              if (cardIndex < flashcards.length - 1) setCardIndex(cardIndex + 1);
                            }}
                            className="px-6 py-2.5 rounded-full border border-neutral-300 text-xs font-semibold text-neutral-700 hover:bg-neutral-100 cursor-pointer"
                          >
                            Still Learning
                          </button>
                          <button
                            onClick={() => {
                              const updated = [...flashcards];
                              updated[cardIndex].known = true;
                              setFlashcards(updated);
                              setIsFlipped(false);
                              if (cardIndex < flashcards.length - 1) setCardIndex(cardIndex + 1);
                            }}
                            className="px-6 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs cursor-pointer flex items-center gap-1.5"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Got It!</span>
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="w-full h-64 rounded-3xl border border-dashed border-neutral-300 bg-neutral-50 flex flex-col items-center justify-center p-8 text-neutral-500">
                        <p className="text-xs mb-3">No flashcards yet for this document.</p>
                        <button
                          onClick={() => handleGenerateFlashcards()}
                          className="px-4 py-2 rounded-xl bg-neutral-900 text-white text-xs font-semibold hover:bg-black cursor-pointer"
                        >
                          Generate AI Flashcards
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Mode 3: Practice Exam Quiz View */}
                {studyTool === "quiz" && (
                  <div className="max-w-2xl mx-auto space-y-6 py-2 animate-in fade-in duration-200">
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-neutral-100">
                      <div>
                        <h3 className="font-semibold text-lg text-neutral-900">
                          Adaptive Practice Exam ({quizQuestions.length} Questions)
                        </h3>
                        <p className="text-xs text-neutral-400">Targeted on {selectedDoc.title}</p>
                      </div>
                      <button
                        onClick={() => handleGenerateQuiz()}
                        disabled={isQuizLoading}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-xs font-medium text-neutral-800 cursor-pointer disabled:opacity-50"
                      >
                        <Sparkles className={`w-3.5 h-3.5 text-amber-500 ${isQuizLoading ? "animate-spin" : ""}`} />
                        <span>{isQuizLoading ? "Generating..." : "Generate New Questions"}</span>
                      </button>
                    </div>

                    {isQuizLoading ? (
                      <div className="p-12 text-center rounded-2xl bg-neutral-50 border border-neutral-200 text-neutral-500">
                        <div className="w-6 h-6 border-2 border-neutral-300 border-t-neutral-900 rounded-full animate-spin mx-auto mb-3" />
                        <p className="text-xs font-medium">Generating rigorous exam questions with rationale...</p>
                      </div>
                    ) : quizQuestions.length > 0 ? (
                      <>
                        {quizQuestions.map((q, qIdx) => (
                          <div key={q.id} className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200/80 space-y-3">
                            <p className="text-sm font-semibold text-neutral-900">
                              {qIdx + 1}. {q.question}
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {q.options.map((opt, optIdx) => {
                                const isSelected = selectedAnswers[q.id] === optIdx;
                                const isCorrect = q.correctIndex === optIdx;
                                let btnStyle = "bg-white text-neutral-800 border-neutral-200 hover:bg-neutral-100";

                                if (quizSubmitted) {
                                  if (isCorrect) btnStyle = "bg-emerald-100 text-emerald-950 border-emerald-400 font-bold";
                                  else if (isSelected && !isCorrect) btnStyle = "bg-red-100 text-red-950 border-red-300";
                                } else if (isSelected) {
                                  btnStyle = "bg-neutral-900 text-white border-black font-semibold";
                                }

                                return (
                                  <button
                                    key={optIdx}
                                    onClick={() => {
                                      if (!quizSubmitted) {
                                        setSelectedAnswers((prev) => ({ ...prev, [q.id]: optIdx }));
                                      }
                                    }}
                                    className={`p-3 rounded-xl border text-xs text-left transition-all cursor-pointer ${btnStyle}`}
                                  >
                                    {opt}
                                  </button>
                                );
                              })}
                            </div>

                            {quizSubmitted && (
                              <div className="pt-2 text-xs text-neutral-600 border-t border-neutral-200/60">
                                <strong>Rationale:</strong> {q.explanation}
                              </div>
                            )}
                          </div>
                        ))}

                        <div className="pt-4 flex items-center justify-between">
                          {!quizSubmitted ? (
                            <button
                              onClick={() => setQuizSubmitted(true)}
                              className="px-6 py-3 rounded-full bg-neutral-900 hover:bg-black text-white text-xs font-semibold shadow-xs cursor-pointer"
                            >
                              Submit Exam &amp; Check Answers
                            </button>
                          ) : (
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => {
                                  setSelectedAnswers({});
                                  setQuizSubmitted(false);
                                }}
                                className="px-5 py-2.5 rounded-full border border-neutral-300 text-xs font-semibold text-neutral-700 hover:bg-neutral-100 cursor-pointer"
                              >
                                Retake Exam
                              </button>
                              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                                <Award className="w-4 h-4" /> Score:{" "}
                                {Object.entries(selectedAnswers).filter(
                                  ([id, ans]) => quizQuestions.find((q) => q.id === Number(id))?.correctIndex === ans
                                ).length}{" "}
                                / {quizQuestions.length} Correct
                              </span>
                            </div>
                          )}
                        </div>
                      </>
                    ) : (
                      <div className="p-8 text-center text-xs text-neutral-500 rounded-2xl bg-neutral-50 border border-neutral-200">
                        Click &quot;Generate New Questions&quot; to synthesize an exam for this material.
                      </div>
                    )}
                  </div>
                )}

                {/* Mode 4: AI Audio Podcast View */}
                {studyTool === "podcast" && (
                  <div className="max-w-xl mx-auto py-6 animate-in fade-in duration-200 text-center">
                    <div className="w-20 h-20 rounded-3xl bg-linear-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center mx-auto mb-4 shadow-lg">
                      <Volume2 className="w-9 h-9" />
                    </div>

                    <h3 className="text-xl font-bold text-neutral-900 mb-1">
                      AI Audio Study Guide: {selectedDoc.title}
                    </h3>
                    <p className="text-xs text-neutral-500 mb-6">
                      AI Co-hosts Alex &amp; Sarah analyze {selectedDoc.space}
                    </p>

                    {/* Animated waveform bars */}
                    <div className="flex items-center justify-center gap-1.5 h-12 mb-6">
                      {[14, 28, 44, 22, 38, 50, 32, 18, 40, 48, 20, 36, 42, 16, 26, 44, 30].map((h, i) => (
                        <span
                          key={i}
                          style={{ height: isAudioPlaying ? `${h}px` : "8px" }}
                          className={`w-1.5 rounded-full transition-all duration-300 ${
                            isAudioPlaying ? "bg-purple-600 animate-pulse" : "bg-neutral-300"
                          }`}
                        />
                      ))}
                    </div>

                    {/* Controls */}
                    <div className="flex items-center justify-center gap-4 mb-8">
                      <button
                        onClick={() => {
                          const speeds: Array<"1x" | "1.5x" | "2x"> = ["1x", "1.5x", "2x"];
                          const nextIdx = (speeds.indexOf(audioSpeed) + 1) % speeds.length;
                          setAudioSpeed(speeds[nextIdx]);
                        }}
                        className="px-3 py-1 rounded-full bg-neutral-100 text-xs font-mono font-semibold text-neutral-700 hover:bg-neutral-200"
                      >
                        {audioSpeed}
                      </button>

                      <button
                        onClick={togglePodcastAudio}
                        className="w-14 h-14 rounded-full bg-neutral-900 hover:bg-black text-white flex items-center justify-center shadow-md active:scale-95 transition-all cursor-pointer"
                        title={isAudioPlaying ? "Pause Audio" : "Play Audio with Web Speech"}
                      >
                        {isAudioPlaying ? <Pause className="w-6 h-6 fill-white" /> : <Play className="w-6 h-6 fill-white ml-0.5" />}
                      </button>

                      <span className="text-xs text-neutral-500 font-medium">
                        {isAudioPlaying ? "Playing aloud..." : "Click to Listen"}
                      </span>
                    </div>

                    {/* Transcript dialogue box */}
                    <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-200 text-left text-xs space-y-2 text-neutral-700">
                      <div>
                        <strong className="text-purple-700">Sarah:</strong> &quot;Welcome back! Today we are breaking down {selectedDoc.title}. Here is the core premise: {selectedDoc.summaryText}&quot;
                      </div>
                      <div>
                        <strong className="text-indigo-700">Alex:</strong> &quot;Exactly. What matters most for exams is being able to connect these concepts to practice questions. Make sure to review your flashcards and take the practice exam!&quot;
                      </div>
                    </div>
                  </div>
                )}

              </div>
            </div>

            {/* Right Side: AI Tutor Chat Panel */}
            <div className="w-full lg:w-[420px] bg-[#f8f9fa] flex flex-col justify-between p-5 border-l border-neutral-200/80">
              
              {/* Header */}
              <div className="pb-3 border-b border-neutral-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
                  <span className="font-semibold text-xs text-neutral-900">LearnNova AI Tutor</span>
                </div>
                <span className="text-[11px] text-neutral-500 font-mono">Groq AI Engine</span>
              </div>

              {/* Chat Message Thread */}
              <div className="flex-1 overflow-y-auto py-4 space-y-3.5 max-h-[500px]">
                {chatMessages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs sm:text-[13px] leading-relaxed ${
                        msg.sender === "user"
                          ? "bg-neutral-900 text-white"
                          : "bg-white text-neutral-800 border border-neutral-200/80 shadow-2xs"
                      }`}
                    >
                      <p className="whitespace-pre-line">{msg.text}</p>
                    </div>
                  </div>
                ))}

                {isAiThinking && (
                  <div className="flex justify-start">
                    <div className="bg-white rounded-2xl px-4 py-2 border border-neutral-200 text-xs text-neutral-500 flex items-center gap-1.5 shadow-2xs">
                      <Sparkles className="w-3.5 h-3.5 animate-spin text-emerald-500" />
                      <span>AI tutor is analyzing document...</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Chat Input Bar */}
              <form onSubmit={handleSendMessage} className="bg-white rounded-2xl p-2 border border-neutral-200/90 shadow-xs flex items-center gap-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Ask your tutor anything..."
                  className="flex-1 px-2 text-xs sm:text-sm text-neutral-800 placeholder-neutral-400 focus:outline-none"
                />
                <button
                  type="submit"
                  className="w-7 h-7 rounded-xl bg-neutral-900 text-white flex items-center justify-center hover:bg-black transition-all cursor-pointer shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>

            </div>

          </div>
        )}
      </main>

      {/* Upload Ingestion Modal */}
      {uploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-7 border border-neutral-200 shadow-2xl relative animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setUploadModalOpen(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-neutral-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-xl font-bold text-neutral-900 mb-1">
              {uploadType === "file" && "Upload Study Files"}
              {uploadType === "paste" && "Paste YouTube or Web Link"}
              {uploadType === "record" && "Record Lecture Audio"}
            </h3>
            <p className="text-xs text-neutral-500 mb-6">
              Our AI instantly transcribes and organizes your learning materials into quizzes and notes.
            </p>

            {uploadType === "file" && (
              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  accept=".pdf,.docx,.txt,.mp3,.mp4"
                />
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-neutral-200 rounded-2xl p-8 text-center bg-neutral-50 hover:bg-neutral-100/70 transition-colors cursor-pointer mb-6"
                >
                  <Upload className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
                  <p className="text-xs font-semibold text-neutral-800">
                    {uploadedFileName ? `Selected: ${uploadedFileName}` : "Click to browse or drag and drop"}
                  </p>
                  <p className="text-[11px] text-neutral-400 mt-1">
                    PDF, DOCX, MP3, MP4 (up to 300 MB)
                  </p>
                </div>
              </div>
            )}

            {uploadType === "paste" && (
              <div className="space-y-3 mb-6">
                <input
                  type="url"
                  value={pasteUrl}
                  onChange={(e) => setPasteUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full px-4 py-3 rounded-2xl bg-neutral-50 border border-neutral-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white"
                />
                <p className="text-[11px] text-neutral-400">
                  Supports YouTube lectures, public lecture recordings, and web articles.
                </p>
              </div>
            )}

            {uploadType === "record" && (
              <div className="bg-neutral-50 rounded-2xl p-6 text-center border border-neutral-200 mb-6">
                <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-3">
                  <Mic className="w-6 h-6 animate-pulse" />
                </div>
                <p className="text-xs font-semibold text-neutral-800">Microphone Ready</p>
                <p className="text-[11px] text-neutral-400 mt-1">
                  Click start to record live professor audio in classroom or Zoom.
                </p>
              </div>
            )}

            <button
              onClick={handleProcessUpload}
              disabled={isSavingContent}
              className="w-full py-3 rounded-full bg-neutral-900 hover:bg-black text-white text-xs font-semibold shadow-md active:scale-[0.98] transition-all cursor-pointer disabled:cursor-wait disabled:opacity-60"
            >
              {isSavingContent ? "Saving material..." : "Start AI Processing"}
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
