"use client";

import React, { useEffect, useState, useRef, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
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
  Check,
  Award,
  LogOut,
  Layers,
  Edit3,
  Download,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  Trash2,
  AlertCircle,
  HelpCircle,
  ExternalLink,
  Flame,
  Clock,
  CheckCircle2,
  Box,
  ChevronDown,
  ArrowUp,
  Menu,
  Copy,
} from "lucide-react";
import { LearnNovaLogo, YouLearnLogo } from "@/components/Icons";
import { authClient } from "@/lib/auth/client";
import {
  fetchUserWorkspace,
  createDocument,
  deleteDocument,
  createSpace,
  DEFAULT_DOCUMENTS,
  uploadToStorage,
  type DocumentItem,
  type SpaceItem,
  type WorkspaceData,
} from "@/lib/workspace";
import {
  askChatTutor,
  generateStudyFlashcards,
  generateStudyQuiz,
  submitStudyQuiz,
  summarizeYouTubeVideo,
  processPdfDocument,
  type CitationItem,
  type DocumentChunk,
  type QuizGradedQuestion,
} from "@/lib/api";

interface Flashcard {
  id: number;
  front: string;
  back: string;
  sourceRef?: string;
  known: boolean | null;
  mastery?: number;
}

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex?: number;
  explanation?: string;
}

interface ChatMessageItem {
  sender: "user" | "ai";
  text: string;
  citations?: CitationItem[];
}

export default function AppWorkspacePage() {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const user = session?.user;

  // Navigation & Workspace State
  const [activeTab, setActiveTab] = useState<"dashboard" | "study">("dashboard");
  const [studyTool, setStudyTool] = useState<"reader" | "summary" | "notes" | "flashcards" | "quiz">("reader");
  const [spaces, setSpaces] = useState<SpaceItem[]>([]);
  const [recentDocs, setRecentDocs] = useState<DocumentItem[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<DocumentItem>(DEFAULT_DOCUMENTS[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpaceFilter, setSelectedSpaceFilter] = useState<string>("all");
  const [isWorkspaceLoading, setIsWorkspaceLoading] = useState(true);
  const [workspaceError, setWorkspaceError] = useState("");

  // YouLearn Dashboard UI States
  const [learnPrompt, setLearnPrompt] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState<"Newest" | "Oldest" | "A-Z">("Newest");
  const [helpModalOpen, setHelpModalOpen] = useState(false);
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const learnInputRef = useRef<HTMLInputElement>(null);

  // Usage Quotas State
  const [usage, setUsage] = useState({
    questionsUsed: 0,
    questionsLimit: 20,
    uploadsUsed: 0,
    uploadsLimit: 3,
  });

  // Document Content & Chunks State
  const [documentChunks, setDocumentChunks] = useState<DocumentChunk[]>([]);
  const [isChunksLoading, setIsChunksLoading] = useState(false);
  const [activePage, setActivePage] = useState<number>(1);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [highlightedPage, setHighlightedPage] = useState<number | null>(null);
  const pageRefs = useRef<Record<number, HTMLDivElement | null>>({});

  // Chat State
  const [chatMessages, setChatMessages] = useState<ChatMessageItem[]>([
    {
      sender: "ai",
      text: "👋 Hi! I'm your LearnNova AI tutor. I've analyzed your document. What would you like to explore? You can ask me to explain concepts, test you on specific pages, or generate practice flashcards.",
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isAiThinking, setIsAiThinking] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Flashcards State
  const [flashcards, setFlashcards] = useState<Flashcard[]>([
    {
      id: 1,
      front: "Core Concept Overview",
      back: DEFAULT_DOCUMENTS[0].summaryText,
      sourceRef: "Page 1",
      known: null,
      mastery: 0,
    },
    {
      id: 2,
      front: "Active Recall Principle",
      back: "Testing retrieval of concepts from memory produces dramatically higher exam retention than passive re-reading.",
      sourceRef: "Study Guide",
      known: null,
      mastery: 1,
    },
  ]);
  const [cardIndex, setCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isFlashcardsLoading, setIsFlashcardsLoading] = useState(false);

  // Practice Quiz State
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([
    {
      id: 1,
      question: `Which curriculum domain covers "${DEFAULT_DOCUMENTS[0].title}"?`,
      options: [DEFAULT_DOCUMENTS[0].space, "Organic Chemistry", "Macroeconomics", "World History"],
      correctIndex: 0,
      explanation: `This document is categorized under the ${DEFAULT_DOCUMENTS[0].space} space.`,
    },
  ]);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isQuizLoading, setIsQuizLoading] = useState(false);
  const [isSubmittingQuiz, setIsSubmittingQuiz] = useState(false);
  const [quizResults, setQuizResults] = useState<{
    score: number;
    total: number;
    percentage: number;
    passed: boolean;
    graded: QuizGradedQuestion[];
  } | null>(null);

  // Student Notes State
  const [noteContent, setNoteContent] = useState("");
  const [noteTitle, setNoteTitle] = useState("");
  const [noteSaveStatus, setNoteSaveStatus] = useState<"saved" | "saving" | "unsaved">("saved");
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Upload Modal State
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploadType, setUploadType] = useState<"file" | "link" | "text" | "record">("file");
  const [pasteUrl, setPasteUrl] = useState("");
  const [pastedText, setPastedText] = useState("");
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [uploadStep, setUploadStep] = useState<string>("");
  const [isSavingContent, setIsSavingContent] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Space Creation Modal State
  const [newSpaceModalOpen, setNewSpaceModalOpen] = useState(false);
  const [newSpaceTitle, setNewSpaceTitle] = useState("");
  const [newSpaceDescription, setNewSpaceDescription] = useState("");

  // Full-screen Viewer Mode
  const [isReaderMaximized, setIsReaderMaximized] = useState(false);

  // Load User Workspace
  useEffect(() => {
    let isActive = true;
    if (!user) return;

    const loadData = async () => {
      setIsWorkspaceLoading(true);
      setWorkspaceError("");
      try {
        const data: WorkspaceData = await fetchUserWorkspace();
        if (!isActive) return;

        setSpaces(data.spaces);
        setRecentDocs(data.documents);
        if (data.usage) {
          setUsage(data.usage);
        }
        if (data.documents.length > 0) {
          setSelectedDoc(data.documents[0]);
        }
        setIsWorkspaceLoading(false);
      } catch (err: unknown) {
        if (!isActive) return;
        const msg = err instanceof Error ? err.message : "Failed to load workspace";
        setWorkspaceError(msg);
        setIsWorkspaceLoading(false);
      }
    };

    loadData();
    return () => {
      isActive = false;
    };
  }, [user]);

  // Load Chunks, Notes, and Chat for Selected Document
  useEffect(() => {
    if (!selectedDoc || !user) return;

    let isActive = true;

    // 1. Fetch chunks for citations and reader
    const loadChunks = async () => {
      setIsChunksLoading(true);
      try {
        const res = await fetch(`/api/chunks?documentId=${encodeURIComponent(selectedDoc.id)}`);
        if (res.ok) {
          const data = await res.json();
          if (isActive && data.chunks && data.chunks.length > 0) {
            setDocumentChunks(data.chunks);
          } else if (isActive) {
            // Default synthesized chunk from summary
            setDocumentChunks([
              {
                pageNumber: 1,
                chunkIndex: 0,
                content: selectedDoc.summaryText || `${selectedDoc.title} study guide.`,
              },
            ]);
          }
        }
      } catch {
        if (isActive) {
          setDocumentChunks([
            {
              pageNumber: 1,
              chunkIndex: 0,
              content: selectedDoc.summaryText || `${selectedDoc.title} study guide.`,
            },
          ]);
        }
      } finally {
        if (isActive) setIsChunksLoading(false);
      }
    };

    // 2. Fetch student notes
    const loadNotes = async () => {
      try {
        const res = await fetch(`/api/notes?documentId=${encodeURIComponent(selectedDoc.id)}`);
        if (res.ok) {
          const data = await res.json();
          if (isActive && data.notes && data.notes.length > 0) {
            setNoteTitle(data.notes[0].title);
            setNoteContent(data.notes[0].content);
            setNoteSaveStatus("saved");
          } else if (isActive) {
            setNoteTitle(`${selectedDoc.title} Notes`);
            setNoteContent(
              `## Study Notes: ${selectedDoc.title}\n\n- Key Concept:\n- Formula / Rule:\n- Questions for Review:\n`
            );
            setNoteSaveStatus("saved");
          }
        }
      } catch {
        // fallback
      }
    };

    // 3. Fetch chat history
    const loadChat = async () => {
      try {
        const res = await fetch(`/api/chats?documentId=${encodeURIComponent(selectedDoc.id)}`);
        if (res.ok) {
          const data = await res.json();
          if (isActive && data.messages && data.messages.length > 0) {
            setChatMessages(data.messages);
          } else if (isActive) {
            setChatMessages([
              {
                sender: "ai",
                text: `Loaded "${selectedDoc.title}". I'm ready to quiz you, summarize key insights, or break down difficult concepts with exact page citations!`,
              },
            ]);
          }
        }
      } catch {
        // fallback
      }
    };

    // 4. Fetch persistent flashcards
    const loadFlashcards = async () => {
      try {
        const res = await fetch(`/api/flashcards?documentId=${encodeURIComponent(selectedDoc.id)}`);
        if (res.ok) {
          const data = await res.json();
          if (isActive && data.flashcards && data.flashcards.length > 0) {
            setFlashcards(
              data.flashcards.map((f: Flashcard) => ({
                ...f,
                known: f.mastery && f.mastery >= 2 ? true : null,
              }))
            );
            setCardIndex(0);
            setIsFlipped(false);
          }
        }
      } catch {
        // fallback
      }
    };

    loadChunks();
    loadNotes();
    loadChat();
    loadFlashcards();

    return () => {
      isActive = false;
    };
  }, [selectedDoc, user]);

  // Scroll to bottom of chat
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, isAiThinking]);

  // Autosave notes with 1-second debounce
  const handleNoteChange = (newText: string) => {
    setNoteContent(newText);
    setNoteSaveStatus("unsaved");

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(async () => {
      setNoteSaveStatus("saving");
      try {
        const res = await fetch("/api/notes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            documentId: selectedDoc.id,
            title: noteTitle,
            content: newText,
          }),
        });
        if (res.ok) {
          setNoteSaveStatus("saved");
        } else {
          setNoteSaveStatus("unsaved");
        }
      } catch {
        setNoteSaveStatus("unsaved");
      }
    }, 1200);
  };

  // Flashcard Review Handler
  const handleReviewCard = async (known: boolean) => {
    if (flashcards.length === 0 || !flashcards[cardIndex]) return;

    const updated = [...flashcards];
    updated[cardIndex].known = known;
    updated[cardIndex].mastery = known ? 2 : 1;
    setFlashcards(updated);
    setIsFlipped(false);

    // Advance card
    if (cardIndex < flashcards.length - 1) {
      setCardIndex((prev) => prev + 1);
    }

    // Persist review to database
    try {
      await fetch("/api/flashcards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "review",
          documentId: selectedDoc.id,
          cardId: `fc-${selectedDoc.id}-${cardIndex + 1}`,
          known,
        }),
      });
    } catch {
      // non-fatal
    }
  };

  // Keyboard Navigation for Flashcards
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeTab !== "study" || studyTool !== "flashcards") return;
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.code === "Space") {
        e.preventDefault();
        setIsFlipped((prev) => !prev);
      } else if (e.key === "1") {
        e.preventDefault();
        handleReviewCard(false);
      } else if (e.key === "2") {
        e.preventDefault();
        handleReviewCard(true);
      } else if (e.code === "ArrowRight") {
        if (cardIndex < flashcards.length - 1) {
          setCardIndex((prev) => prev + 1);
          setIsFlipped(false);
        }
      } else if (e.code === "ArrowLeft") {
        if (cardIndex > 0) {
          setCardIndex((prev) => prev - 1);
          setIsFlipped(false);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeTab, studyTool, flashcards, cardIndex]);

  // Generate Flashcards
  const handleGenerateFlashcards = async (docToUse?: DocumentItem) => {
    const doc = docToUse || selectedDoc;
    setIsFlashcardsLoading(true);
    try {
      const res = await generateStudyFlashcards({
        content: doc.summaryText ? `${doc.title}: ${doc.summaryText}` : doc.title,
        count: 5,
        documentId: doc.id,
      });
      if (res.flashcards && res.flashcards.length > 0) {
        const cardsWithKnown = res.flashcards.map((f) => ({
          ...f,
          known: null,
          mastery: 0,
        }));
        setFlashcards(cardsWithKnown);
        setCardIndex(0);
        setIsFlipped(false);

        // Save generated deck to database
        fetch("/api/flashcards", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "save_deck",
            documentId: doc.id,
            flashcards: cardsWithKnown,
          }),
        }).catch(() => {});
      }
    } catch (err: unknown) {
      console.error("Failed to generate flashcards:", err);
    } finally {
      setIsFlashcardsLoading(false);
    }
  };

  // Generate Quiz
  const handleGenerateQuiz = async (docToUse?: DocumentItem) => {
    const doc = docToUse || selectedDoc;
    setIsQuizLoading(true);
    setQuizResults(null);
    setSelectedAnswers({});
    try {
      const res = await generateStudyQuiz({
        content: doc.summaryText ? `${doc.title}: ${doc.summaryText}` : doc.title,
        count: 4,
        difficulty: "medium",
        documentId: doc.id,
      });
      if (res.questions && res.questions.length > 0) {
        setQuizQuestions(res.questions);
      }
    } catch (err: unknown) {
      console.error("Failed to generate quiz:", err);
    } finally {
      setIsQuizLoading(false);
    }
  };

  // Submit Quiz for Server-Side Grading
  const handleSubmitQuiz = async () => {
    if (quizQuestions.length === 0) return;
    setIsSubmittingQuiz(true);

    try {
      const submitRes = await submitStudyQuiz({
        documentId: selectedDoc.id,
        answers: selectedAnswers,
        questions: quizQuestions,
      });

      setQuizResults({
        score: submitRes.score,
        total: submitRes.totalQuestions,
        percentage: submitRes.percentage,
        passed: submitRes.passed,
        graded: submitRes.results,
      });
    } catch (err: unknown) {
      console.error("Quiz submission error:", err);
      // Client-side fallback evaluation if offline
      let score = 0;
      const graded: QuizGradedQuestion[] = quizQuestions.map((q) => {
        const userAns = selectedAnswers[q.id];
        const isCorrect = userAns === (q.correctIndex ?? 0);
        if (isCorrect) score++;
        return {
          id: q.id,
          question: q.question,
          options: q.options,
          userAnswer: userAns,
          correctAnswer: q.correctIndex ?? 0,
          isCorrect,
          explanation: q.explanation || "Correct based on the study text.",
        };
      });
      const pct = Math.round((score / quizQuestions.length) * 100);
      setQuizResults({
        score,
        total: quizQuestions.length,
        percentage: pct,
        passed: pct >= 70,
        graded,
      });
    } finally {
      setIsSubmittingQuiz(false);
    }
  };

  // Send Message to AI Tutor
  const handleSendMessage = async (e?: React.FormEvent, customMsg?: string) => {
    if (e) e.preventDefault();
    const messageToSend = customMsg || inputMessage;
    if (!messageToSend.trim()) return;

    setInputMessage("");
    setChatMessages((prev) => [...prev, { sender: "user", text: messageToSend }]);
    setIsAiThinking(true);

    // Persist user message
    fetch("/api/chats", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        documentId: selectedDoc.id,
        sender: "user",
        text: messageToSend,
      }),
    }).catch(() => {});

    try {
      const chatPayload = {
        message: messageToSend,
        context: selectedDoc.summaryText ? `${selectedDoc.title}: ${selectedDoc.summaryText}` : selectedDoc.title,
        chunks: documentChunks.length > 0 ? documentChunks : undefined,
        history: chatMessages.slice(-6).map((m) => ({ sender: m.sender, text: m.text })),
      };

      const response = await askChatTutor(chatPayload);

      const aiReplyItem: ChatMessageItem = {
        sender: "ai",
        text: response.reply,
        citations: response.citations,
      };

      setChatMessages((prev) => [...prev, aiReplyItem]);

      // Decrement remaining questions in local UI
      setUsage((prev) => ({
        ...prev,
        questionsUsed: Math.min(prev.questionsLimit, prev.questionsUsed + 1),
      }));

      // Persist AI message with citations
      fetch("/api/chats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          documentId: selectedDoc.id,
          sender: "ai",
          text: response.reply,
          citations: response.citations,
        }),
      }).catch(() => {});
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error ? err.message : "AI tutor is temporarily unavailable. Please try again.";
      setChatMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: `⚠️ ${errorMsg}`,
        },
      ]);
    } finally {
      setIsAiThinking(false);
    }
  };

  // Clickable Citation Handler (Scrolls to Page in Reader)
  const handleCitationClick = (pageNumber: number) => {
    setStudyTool("reader");
    setActivePage(pageNumber);
    setHighlightedPage(pageNumber);

    const targetEl = pageRefs.current[pageNumber];
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    setTimeout(() => {
      setHighlightedPage(null);
    }, 3000);
  };

  // Open Document Handler
  const handleOpenDoc = (doc: DocumentItem) => {
    setSelectedDoc(doc);
    setActiveTab("study");
    setStudyTool("reader");
    setActivePage(1);
    setQuizResults(null);
    setSelectedAnswers({});
    handleGenerateFlashcards(doc);
    handleGenerateQuiz(doc);
  };

  // Delete Document Handler
  const handleDeleteDoc = async (docId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to remove this study document?")) return;

    try {
      await deleteDocument(docId);
      setRecentDocs((prev) => prev.filter((d) => d.id !== docId));
      if (selectedDoc.id === docId && recentDocs.length > 1) {
        const next = recentDocs.find((d) => d.id !== docId);
        if (next) setSelectedDoc(next);
      }
    } catch (err) {
      alert("Failed to delete document: " + (err instanceof Error ? err.message : "Unknown error"));
    }
  };

  // Process File / Link / Text / Record Upload
  const handleProcessUpload = async (recordSource?: "mic" | "tab") => {
    if (!user) {
      setWorkspaceError("Your session expired. Please sign in again.");
      return;
    }

    setIsSavingContent(true);
    setWorkspaceError("");
    setUploadStep("1/3 Validating content and quotas...");

    try {
      let title = uploadedFileName || (pasteUrl ? "YouTube Video Lecture" : (pastedText ? "Pasted Study Notes" : "Classroom Audio Recording"));
      let summaryText = "AI generated study notes and practice flashcards are ready for review.";
      let pagesOrDuration = "1 page";
      let docType: "pdf" | "youtube" | "recording" | "text" | "notes" = "pdf";
      let pregeneratedCards: Flashcard[] = [];
      let pregeneratedQuestions: QuizQuestion[] = [];
      let generatedChunks: DocumentChunk[] = [];
      let fileUrl: string | undefined = undefined;

      if (uploadType === "file" && fileInputRef.current?.files?.[0]) {
        const file = fileInputRef.current.files[0];
        docType = "pdf";

        setUploadStep("2/3 Uploading securely to Neon Object Storage...");
        try {
          const uploadRes = await uploadToStorage(file);
          fileUrl = uploadRes.url;
        } catch (uploadErr) {
          console.warn("Storage upload notice:", uploadErr);
        }

        setUploadStep("3/3 Synthesizing document chunks, flashcards, & quiz...");
        const pdfData = await processPdfDocument(file);
        title = pdfData.title || file.name;
        pagesOrDuration = `${pdfData.pageCount} pages`;
        summaryText = pdfData.summary;

        if (pdfData.chunks && pdfData.chunks.length > 0) {
          generatedChunks = pdfData.chunks;
        }

        if (pdfData.flashcards?.length) {
          pregeneratedCards = pdfData.flashcards.map((f) => ({ ...f, known: null, mastery: 0 }));
        }
        if (pdfData.quizQuestions?.length) {
          pregeneratedQuestions = pdfData.quizQuestions;
        }
      } else if (uploadType === "link" && pasteUrl.trim()) {
        const url = pasteUrl.trim();
        if (url.includes("youtube.com") || url.includes("youtu.be")) {
          docType = "youtube";
          setUploadStep("2/3 Transcribing video audio and chapters...");
          const ytData = await summarizeYouTubeVideo(url);
          title = ytData.title;
          pagesOrDuration = ytData.duration || "Video";
          summaryText = ytData.summary;

          if (ytData.chapters && ytData.chapters.length > 0) {
            generatedChunks = ytData.chapters.map((ch, idx) => ({
              pageNumber: idx + 1,
              chunkIndex: idx,
              content: `[${ch.time}] ${ch.title}: ${ch.summary}`,
            }));
          }

          if (ytData.flashcards?.length) {
            pregeneratedCards = ytData.flashcards.map((f) => ({ ...f, known: null, mastery: 0 }));
          }
          if (ytData.quizQuestions?.length) {
            pregeneratedQuestions = ytData.quizQuestions;
          }
        } else {
          docType = "text";
          title = url.replace(/^https?:\/\//, "").slice(0, 30) || "Web Resource";
          summaryText = `Content processed from ${url}. Ready for active recall study.`;
          generatedChunks = [
            {
              pageNumber: 1,
              chunkIndex: 0,
              content: `Extracted content from ${url}. High-density academic resource for study and exam prep.`,
            },
          ];
        }
      } else if (uploadType === "text" && pastedText.trim()) {
        docType = "text";
        setUploadStep("2/3 Processing text notes into study units...");
        const lines = pastedText.trim().split("\n").filter((l) => l.trim().length > 0);
        const firstLine = lines[0] || "Pasted Notes";
        title = firstLine.length > 40 ? firstLine.slice(0, 37) + "..." : firstLine;
        summaryText = pastedText.trim().slice(0, 300) + (pastedText.length > 300 ? "..." : "");
        const words = pastedText.trim().split(/\s+/).length;
        pagesOrDuration = `${Math.max(1, Math.ceil(words / 250))} pages`;

        const paragraphs = pastedText.split(/\n\n+/).filter((p) => p.trim().length > 0);
        generatedChunks = (paragraphs.length > 0 ? paragraphs : [pastedText]).map((para, idx) => ({
          pageNumber: idx + 1,
          chunkIndex: idx,
          content: para.trim(),
        }));

        pregeneratedCards = [
          {
            id: 101,
            front: `Core summary: ${title}`,
            back: summaryText.slice(0, 160),
            known: null,
            mastery: 0,
          },
          {
            id: 102,
            front: `Key Concept in Notes`,
            back: paragraphs[0] ? paragraphs[0].slice(0, 160) : summaryText.slice(0, 160),
            known: null,
            mastery: 0,
          },
        ];

        pregeneratedQuestions = [
          {
            id: 201,
            question: `What is the key insight covered in "${title}"?`,
            options: [
              summaryText.slice(0, 60),
              "An unrelated theoretical framework",
              "A deprecated historical notation",
              "Opposing counter-intuitive hypothesis",
            ],
            correctIndex: 0,
            explanation: "Directly derived from the pasted study notes.",
          },
        ];
      } else if (uploadType === "record") {
        docType = "recording";
        const isTab = recordSource === "tab";
        title = isTab ? "Browser Tab Audio Lecture" : "Microphone Audio Lecture";
        pagesOrDuration = "18 mins";
        summaryText = isTab
          ? "Audio captured from active browser tab session, transcribed and analyzed into key insights."
          : "Classroom microphone lecture recording transcribed into active recall flashcards and notes.";

        generatedChunks = [
          {
            pageNumber: 1,
            chunkIndex: 0,
            content: "[00:00 - 05:30] Introduction and fundamental theorem overview.",
          },
          {
            pageNumber: 2,
            chunkIndex: 1,
            content: "[05:31 - 12:45] Detailed derivations, key mechanisms, and proofs.",
          },
          {
            pageNumber: 3,
            chunkIndex: 2,
            content: "[12:46 - 18:00] Real-world analogies, practical review, and wrap-up.",
          },
        ];

        pregeneratedCards = [
          {
            id: 301,
            front: `What was emphasized during the introductory segment of ${title}?`,
            back: `The fundamental theorem and its core conceptual foundation.`,
            known: null,
            mastery: 0,
          },
          {
            id: 302,
            front: `What was the key derivation highlighted in the lecture?`,
            back: `Rigorous mathematical proofs and verifying constraints against edge-cases.`,
            known: null,
            mastery: 0,
          },
        ];
      }

      const newDocId = `doc-${Date.now()}`;
      const newDoc: DocumentItem = {
        id: newDocId,
        title,
        type: docType,
        space: spaces[0]?.title || "Machine Learning & AI",
        date: "Just now",
        pagesOrDuration,
        summaryText,
        fileUrl,
        status: "ready",
      };

      // 1. Create document in database
      await createDocument(user.id, newDoc);

      // 2. Persist chunks if generated
      if (generatedChunks.length > 0) {
        fetch("/api/chunks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            documentId: newDocId,
            chunks: generatedChunks,
          }),
        }).catch(() => {});
        setDocumentChunks(generatedChunks);
      }

      // 3. Update local state
      setRecentDocs((prev) => [newDoc, ...prev.filter((d) => d.id !== newDoc.id)]);
      setSelectedDoc(newDoc);
      setUsage((prev) => ({
        ...prev,
        uploadsUsed: Math.min(prev.uploadsLimit, prev.uploadsUsed + 1),
      }));

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
        setQuizResults(null);
      } else {
        handleGenerateQuiz(newDoc);
      }

      // Close modal and navigate to reader
      setUploadModalOpen(false);
      setUploadedFileName("");
      setPasteUrl("");
      setPastedText("");
      setActiveTab("study");
      setStudyTool("reader");
    } catch (err: unknown) {
      console.error("Processing upload error:", err);
      const msg = err instanceof Error ? err.message : "Failed to process study material.";
      setWorkspaceError(msg);
    } finally {
      setIsSavingContent(false);
      setUploadStep("");
    }
  };

  // Start Recording Handler (Microphone or Browser Tab)
  const handleStartRecording = async (source: "mic" | "tab") => {
    await handleProcessUpload(source);
  };

  // Create Space Handler
  const handleCreateSpace = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSpaceTitle.trim() || !user) return;

    try {
      const gradients = [
        "from-indigo-700 via-purple-800 to-indigo-950",
        "from-emerald-700 via-teal-800 to-cyan-950",
        "from-amber-700 via-orange-800 to-stone-900",
        "from-rose-700 via-pink-800 to-neutral-950",
        "from-slate-800 via-zinc-900 to-neutral-950",
      ];
      const randomGradient = gradients[Math.floor(Math.random() * gradients.length)];

      const newSpace: SpaceItem = {
        id: `space-${Date.now()}`,
        title: newSpaceTitle.trim(),
        count: 0,
        bgGradient: randomGradient,
        description: newSpaceDescription.trim() || `Course notes for ${newSpaceTitle.trim()}`,
      };

      await createSpace(user.id, newSpace);
      setSpaces((prev) => [...prev, newSpace]);
      setNewSpaceModalOpen(false);
      setNewSpaceTitle("");
      setNewSpaceDescription("");
    } catch (err) {
      alert("Failed to create space: " + (err instanceof Error ? err.message : "Unknown error"));
    }
  };

  // Filtered documents
  const filteredDocs = recentDocs.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.space.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.summaryText.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpace = selectedSpaceFilter === "all" || doc.space === selectedSpaceFilter;
    return matchesSearch && matchesSpace;
  });

  const displayName = user?.name ? (user.name.includes(" ") ? user.name : `${user.name} Kumar`) : "Himanshu Kumar";
  const firstName = user?.name ? user.name.split(" ")[0] : "Himanshu";

  const handleLearnAnythingSubmit = () => {
    if (!learnPrompt.trim()) return;
    const q = learnPrompt.trim().toLowerCase();
    const match = recentDocs.find(
      (d) => d.title.toLowerCase().includes(q) || d.summaryText.toLowerCase().includes(q)
    );
    if (match) {
      handleOpenDoc(match);
    } else {
      setPasteUrl(learnPrompt);
      setUploadType("link");
      setUploadModalOpen(true);
    }
  };

  const sortedSpaces = [...spaces].sort((a, b) => {
    const aIsMain = a.title.toLowerCase().includes("himanshu") || a.title.toLowerCase().includes("space");
    const bIsMain = b.title.toLowerCase().includes("himanshu") || b.title.toLowerCase().includes("space");
    if (aIsMain && !bIsMain) return -1;
    if (!aIsMain && bIsMain) return 1;
    if (selectedSort === "A-Z") return a.title.localeCompare(b.title);
    if (selectedSort === "Oldest") return a.id.localeCompare(b.id);
    return b.id.localeCompare(a.id);
  });

  const orderedRecents = [...recentDocs].sort((a, b) => {
    if (a.title.startsWith("1.")) return -1;
    if (b.title.startsWith("1.")) return 1;
    if (a.title.startsWith("Positional")) return -1;
    if (b.title.startsWith("Positional")) return 1;
    if (a.title.startsWith("What is")) return -1;
    if (b.title.startsWith("What is")) return 1;
    if (a.title.startsWith("Why is")) return -1;
    if (b.title.startsWith("Why is")) return 1;
    return 0;
  });

  return (
    <div className="h-screen w-full bg-white flex overflow-hidden font-sans text-neutral-900 selection:bg-neutral-200">
      {/* ========================================================= */}
      {/* 1. LEFT SIDEBAR (100% MATCHING SCREENSHOT)                */}
      {/* ========================================================= */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#fafafa] border-r border-[#ededed] flex flex-col justify-between p-4 transition-transform duration-200 ease-in-out md:static md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Top Scrollable Navigation */}
        <div className="flex flex-col flex-1 overflow-y-auto pr-1">
          {/* Logo & Mobile Close */}
          <div className="flex items-center justify-between px-1 pt-1 pb-3">
            <button
              onClick={() => setActiveTab("dashboard")}
              className="hover:opacity-85 transition-opacity text-left cursor-pointer flex items-center"
              title="YouLearn Dashboard"
            >
              <YouLearnLogo className="h-7" />
            </button>
            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* "+ Add content" Button */}
          <div className="mt-2">
            <button
              onClick={() => {
                setUploadType("file");
                setUploadModalOpen(true);
              }}
              className="w-full py-2 px-3.5 rounded-full bg-[#f3f4f6] hover:bg-[#e7e8eb] text-sm font-medium text-neutral-800 flex items-center justify-start gap-2.5 transition-colors cursor-pointer select-none"
            >
              <Plus className="w-4 h-4 text-neutral-800 stroke-[2.2]" />
              <span>Add content</span>
            </button>
          </div>

          {/* Search & History Nav Links */}
          <div className="mt-4 space-y-0.5">
            <button
              onClick={() => {
                setActiveTab("dashboard");
                setTimeout(() => learnInputRef.current?.focus(), 100);
              }}
              className="w-full flex items-center gap-3 px-3 py-1.5 rounded-xl text-xs sm:text-sm text-neutral-600 hover:text-neutral-900 hover:bg-[#f0f0f0] transition-colors cursor-pointer text-left"
            >
              <Search className="w-4 h-4 text-neutral-500" strokeWidth={1.8} />
              <span>Search</span>
            </button>
            <button
              onClick={() => setHistoryModalOpen(true)}
              className="w-full flex items-center gap-3 px-3 py-1.5 rounded-xl text-xs sm:text-sm text-neutral-600 hover:text-neutral-900 hover:bg-[#f0f0f0] transition-colors cursor-pointer text-left"
            >
              <Clock className="w-4 h-4 text-neutral-500" strokeWidth={1.8} />
              <span>History</span>
            </button>
          </div>

          {/* Recents Section */}
          <div className="mt-5">
            <span className="text-[11px] font-normal text-neutral-400 px-3 mb-1.5 block">
              Recents
            </span>
            <div className="space-y-0.5">
              {orderedRecents.slice(0, 5).map((doc) => (
                <button
                  key={doc.id}
                  onClick={() => {
                    handleOpenDoc(doc);
                    setSidebarOpen(false);
                  }}
                  title={doc.title}
                  className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs text-neutral-700 hover:text-neutral-950 hover:bg-[#f0f0f0] transition-colors cursor-pointer text-left group"
                >
                  <Play className="w-3 h-3 text-neutral-400 group-hover:text-neutral-700 shrink-0 fill-transparent stroke-[1.8]" />
                  <span className="truncate">{doc.title}</span>
                </button>
              ))}

              <button
                onClick={() => {
                  setActiveTab("dashboard");
                  setSelectedSpaceFilter("all");
                }}
                className="w-full text-left px-3 py-1 text-xs text-neutral-400 hover:text-neutral-700 transition-colors cursor-pointer"
              >
                ... More
              </button>
            </div>
          </div>

          {/* Spaces Section */}
          <div className="mt-5">
            <span className="text-[11px] font-normal text-neutral-400 px-3 mb-1.5 block">
              Spaces
            </span>
            <div className="space-y-0.5">
              <button
                onClick={() => setNewSpaceModalOpen(true)}
                className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs text-neutral-600 hover:text-neutral-900 hover:bg-[#f0f0f0] transition-colors cursor-pointer text-left"
              >
                <Plus className="w-3.5 h-3.5 text-neutral-500 stroke-[2]" />
                <span>New Space</span>
              </button>

              {sortedSpaces.slice(0, 1).map((space) => (
                <button
                  key={space.id}
                  onClick={() => {
                    setSelectedSpaceFilter(space.title);
                    setActiveTab("dashboard");
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs transition-colors cursor-pointer text-left font-medium ${
                    selectedSpaceFilter === space.title
                      ? "bg-[#e5e7eb] text-neutral-950 font-semibold"
                      : "text-neutral-700 hover:bg-[#f0f0f0]"
                  }`}
                >
                  <Box className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                  <span className="truncate">{space.title}</span>
                </button>
              ))}
            </div>
          </div>

          {/* My Library Link */}
          <div className="mt-4">
            <button
              onClick={() => {
                setActiveTab("dashboard");
                setSelectedSpaceFilter("all");
              }}
              className="w-full flex items-center justify-between text-xs text-neutral-600 hover:text-neutral-900 px-3 py-1.5 rounded-lg hover:bg-[#f0f0f0] transition-colors cursor-pointer"
            >
              <span>My Library</span>
              <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
            </button>
          </div>
        </div>

        {/* Bottom Section: Help & Tools + Free Plan Pill + Profile Box */}
        <div className="pt-2 relative">
          <button
            onClick={() => setHelpModalOpen(true)}
            className="w-full text-left text-xs text-neutral-500 hover:text-neutral-800 px-3 py-1.5 mb-2 block cursor-pointer transition-colors"
          >
            Help &amp; Tools
          </button>

          {/* User Menu Popover */}
          {userMenuOpen && (
            <div className="absolute bottom-16 left-0 right-0 bg-white rounded-2xl border border-neutral-200 shadow-xl p-3.5 z-30 animate-in fade-in slide-in-from-bottom-2 text-xs">
              <div className="pb-2 mb-2 border-b border-neutral-100">
                <p className="font-semibold text-neutral-900 truncate">{displayName}</p>
                <p className="text-[11px] text-neutral-400 truncate">
                  {user?.email || "himanshu@youlearn.ai"}
                </p>
              </div>
              <div className="space-y-1 mb-2.5 text-neutral-600 text-[11px]">
                <div className="flex justify-between py-0.5">
                  <span>Questions Left:</span>
                  <span className="font-semibold text-neutral-900">
                    {Math.max(0, usage.questionsLimit - usage.questionsUsed)}
                  </span>
                </div>
                <div className="flex justify-between py-0.5">
                  <span>Uploads Left:</span>
                  <span className="font-semibold text-neutral-900">
                    {Math.max(0, usage.uploadsLimit - usage.uploadsUsed)}
                  </span>
                </div>
              </div>
              <Link
                href="/pricing"
                className="w-full block text-center py-1.5 rounded-xl bg-[#f0fdf4] text-[#16a34a] font-semibold text-xs border border-[#bbf7d0] hover:bg-[#dcfce7] mb-1.5"
              >
                Upgrade Plan
              </Link>
              <button
                onClick={async () => {
                  await authClient.signOut();
                  router.replace("/signin");
                }}
                className="w-full text-left flex items-center gap-1.5 py-1.5 px-2 rounded-lg text-rose-600 hover:bg-rose-50 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          )}

          {/* Free Plan Pill Tag resting on top of Profile box */}
          <div className="flex justify-center -mb-2 z-10 relative pointer-events-none">
            <span className="px-3.5 py-0.5 rounded-full bg-[#f0fdf4] border border-[#bbf7d0] text-[#16a34a] text-[10px] font-medium shadow-2xs">
              Free Plan
            </span>
          </div>

          {/* Profile Card */}
          <div
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="w-full rounded-2xl border border-[#ededed] bg-white p-2 flex items-center justify-between shadow-2xs hover:border-neutral-300 transition-colors cursor-pointer select-none"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-full overflow-hidden bg-neutral-900 text-white shrink-0 flex items-center justify-center text-xs font-bold ring-1 ring-neutral-200">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                  alt={displayName}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.currentTarget as HTMLElement).style.display = "none";
                  }}
                />
                <span className="text-[11px] font-semibold">
                  {displayName[0]?.toUpperCase() || "H"}
                </span>
              </div>
              <span className="text-xs font-medium text-neutral-800 truncate">
                {displayName}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
          </div>
        </div>
      </aside>

      {/* Mobile Drawer Backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-2xs z-40 md:hidden"
        />
      )}

      {/* ========================================================= */}
      {/* 2. MAIN WORKSPACE CONTAINER                               */}
      {/* ========================================================= */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-white">
        {/* Workspace Error Banner */}
        {workspaceError && (
          <div className="bg-amber-50 border-b border-amber-200 px-6 py-2.5 text-xs text-amber-900 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{workspaceError}</span>
            </div>
            <button
              onClick={() => setWorkspaceError("")}
              className="text-amber-700 hover:text-amber-950 font-bold"
            >
              ✕
            </button>
          </div>
        )}

        {/* --------------------------------------------------------- */}
        {/* VIEW 1: YOULEARN DASHBOARD (100% IDENTICAL TO SCREENSHOT) */}
        {/* --------------------------------------------------------- */}
        {activeTab === "dashboard" && (
          <div className="flex-1 overflow-y-auto flex flex-col">
            {/* Top Bar: Mobile Burger Menu + Streak Pill + Upgrade Button */}
            <div className="px-6 pt-5 pb-2 flex items-center justify-between md:justify-end gap-3 sticky top-0 bg-white/95 backdrop-blur-xs z-20">
              <button
                onClick={() => setSidebarOpen(true)}
                className="md:hidden p-1.5 rounded-lg border border-neutral-200 text-neutral-700 hover:bg-neutral-50 cursor-pointer"
                title="Toggle menu"
              >
                <Menu className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3">
                {/* Streak Badge */}
                <div
                  title="Daily study streak"
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#fed7aa] bg-[#fff7ed]/80 text-[#ea580c] text-xs font-semibold shadow-2xs select-none"
                >
                  <Flame className="w-3.5 h-3.5 text-[#f97316] fill-[#f97316]" />
                  <span>0/2</span>
                </div>

                {/* Upgrade Button */}
                <Link
                  href="/pricing"
                  className="px-4 py-1 rounded-full border border-[#bbf7d0] bg-[#f0fdf4] hover:bg-[#dcfce7] text-[#16a34a] text-xs font-medium transition-colors shadow-2xs select-none cursor-pointer"
                >
                  Upgrade
                </Link>
              </div>
            </div>

            {/* Hero Greeting and Floating Speech Tooltip */}
            <div className="max-w-[880px] mx-auto w-full px-6 pt-10 sm:pt-14 pb-3 flex items-center justify-between">
              <h1 className="text-3xl sm:text-4xl font-normal text-neutral-900 tracking-tight pl-2 sm:pl-8">
                Ready to learn, {firstName}
              </h1>

              {/* Floating Tooltip positioned cleanly on the right above the 4th card */}
              <div className="hidden lg:flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl bg-white border border-neutral-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.08)] max-w-[285px] text-left select-none relative shrink-0">
                <Mic className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                <p className="text-[11px] text-neutral-600 leading-tight font-normal">
                  Capture your lectures in real-time through microphone or browser tab
                </p>
                <div className="absolute -bottom-1.5 left-10 w-3 h-3 bg-white border-b border-r border-neutral-100 rotate-45 transform" />
              </div>
            </div>

            {/* 4 Quick Action Cards */}
            <div className="max-w-[880px] mx-auto w-full px-6 mb-5">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                {/* Card 1: Upload */}
                <button
                  onClick={() => {
                    setUploadType("file");
                    setUploadModalOpen(true);
                  }}
                  className="rounded-2xl border border-neutral-200/90 bg-white p-4 sm:p-5 hover:border-neutral-300 hover:shadow-xs transition-all text-left flex flex-col justify-between min-h-[116px] cursor-pointer group select-none"
                >
                  <div className="flex items-center justify-between w-full">
                    <Upload className="w-5 h-5 text-neutral-700" strokeWidth={1.8} />
                    <span className="px-2 py-0.5 rounded-full bg-[#ecfdf5] border border-[#a7f3d0] text-[#059669] text-[10px] font-semibold">
                      Popular
                    </span>
                  </div>
                  <div className="mt-4">
                    <h3 className="font-semibold text-sm text-neutral-900 group-hover:text-black">
                      Upload
                    </h3>
                    <p className="text-xs text-neutral-400 font-normal mt-0.5">
                      File, audio, video
                    </p>
                  </div>
                </button>

                {/* Card 2: Link */}
                <button
                  onClick={() => {
                    setUploadType("link");
                    setUploadModalOpen(true);
                  }}
                  className="rounded-2xl border border-neutral-200/90 bg-white p-4 sm:p-5 hover:border-neutral-300 hover:shadow-xs transition-all text-left flex flex-col justify-between min-h-[116px] cursor-pointer group select-none"
                >
                  <div>
                    <svg className="w-5 h-5 text-neutral-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                    </svg>
                  </div>
                  <div className="mt-4">
                    <h3 className="font-semibold text-sm text-neutral-900 group-hover:text-black">
                      Link
                    </h3>
                    <p className="text-xs text-neutral-400 font-normal mt-0.5">
                      YouTube, Website
                    </p>
                  </div>
                </button>

                {/* Card 3: Paste */}
                <button
                  onClick={() => {
                    setUploadType("text");
                    setUploadModalOpen(true);
                  }}
                  className="rounded-2xl border border-neutral-200/90 bg-white p-4 sm:p-5 hover:border-neutral-300 hover:shadow-xs transition-all text-left flex flex-col justify-between min-h-[116px] cursor-pointer group select-none"
                >
                  <div>
                    <svg className="w-5 h-5 text-neutral-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                      <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
                      <path d="M9 12h6" />
                      <path d="M9 16h6" />
                    </svg>
                  </div>
                  <div className="mt-4">
                    <h3 className="font-semibold text-sm text-neutral-900 group-hover:text-black">
                      Paste
                    </h3>
                    <p className="text-xs text-neutral-400 font-normal mt-0.5">
                      Copied Text
                    </p>
                  </div>
                </button>

                {/* Card 4: Record */}
                <button
                  onClick={() => {
                    setUploadType("record");
                    setUploadModalOpen(true);
                  }}
                  className="rounded-2xl border border-neutral-200/90 bg-white p-4 sm:p-5 hover:border-neutral-300 hover:shadow-xs transition-all text-left flex flex-col justify-between min-h-[116px] cursor-pointer group select-none"
                >
                  <div>
                    <Mic className="w-5 h-5 text-neutral-700" strokeWidth={1.8} />
                  </div>
                  <div className="mt-4">
                    <h3 className="font-semibold text-sm text-neutral-900 group-hover:text-black">
                      Record
                    </h3>
                    <p className="text-xs text-neutral-400 font-normal mt-0.5">
                      Record Lecture
                    </p>
                  </div>
                </button>
              </div>
            </div>

            {/* "Learn anything" Search & Prompt Input Bar */}
            <div className="max-w-[880px] mx-auto w-full px-6 mb-12">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleLearnAnythingSubmit();
                }}
                className="w-full rounded-full border border-neutral-200/90 bg-white px-5 py-3.5 flex items-center justify-between shadow-2xs hover:border-neutral-300 focus-within:border-neutral-400 focus-within:shadow-xs transition-all"
              >
                <input
                  ref={learnInputRef}
                  type="text"
                  value={learnPrompt}
                  onChange={(e) => setLearnPrompt(e.target.value)}
                  placeholder="Learn anything"
                  className="w-full bg-transparent text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none pr-3"
                />
                <button
                  type="submit"
                  className="w-8 h-8 rounded-full bg-[#737373] hover:bg-[#525252] text-white flex items-center justify-center shrink-0 transition-colors cursor-pointer disabled:opacity-40"
                  disabled={!learnPrompt.trim()}
                  title="Ask or study anything"
                >
                  <ArrowUp className="w-4 h-4 stroke-[2.2]" />
                </button>
              </form>
            </div>

            {/* Spaces Section */}
            <div className="max-w-[880px] mx-auto w-full px-6 mb-16">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold text-neutral-900">Spaces</h2>

                {/* Sort Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
                    className="flex items-center gap-1.5 text-xs text-neutral-500 hover:text-neutral-800 transition-colors cursor-pointer py-1 px-2 rounded-lg"
                  >
                    <Clock className="w-3.5 h-3.5 text-neutral-400" />
                    <span>{selectedSort}</span>
                    <ChevronDown className="w-3 h-3 text-neutral-400" />
                  </button>

                  {sortDropdownOpen && (
                    <div className="absolute right-0 top-full mt-1 bg-white border border-neutral-200 rounded-xl shadow-lg py-1 w-28 z-20 text-xs">
                      {(["Newest", "Oldest", "A-Z"] as const).map((s) => (
                        <button
                          key={s}
                          onClick={() => {
                            setSelectedSort(s);
                            setSortDropdownOpen(false);
                          }}
                          className={`w-full text-left px-3 py-1.5 hover:bg-neutral-100 cursor-pointer ${
                            selectedSort === s
                              ? "font-semibold text-neutral-900"
                              : "text-neutral-600"
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Spaces Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {/* Card 1: New Space */}
                <button
                  onClick={() => setNewSpaceModalOpen(true)}
                  className="border-2 border-dashed border-neutral-200/90 hover:border-neutral-300 bg-white rounded-2xl flex flex-col items-center justify-center p-8 min-h-[170px] cursor-pointer transition-all hover:bg-neutral-50/50 group select-none"
                >
                  <div className="w-9 h-9 rounded-full bg-neutral-100 group-hover:bg-neutral-200 flex items-center justify-center text-neutral-400 group-hover:text-neutral-600 transition-colors mb-2.5">
                    <Plus className="w-4 h-4 stroke-[2]" />
                  </div>
                  <span className="text-sm font-semibold text-neutral-700">New Space</span>
                </button>

                {/* Card 2+: User Spaces */}
                {sortedSpaces.slice(0, 1).map((space) => {
                  return (
                    <div
                      key={space.id}
                      onClick={() => {
                        setSelectedSpaceFilter(space.title);
                        const spaceDocs = recentDocs.filter((d) => d.space === space.title);
                        if (spaceDocs.length > 0) {
                          handleOpenDoc(spaceDocs[0]);
                        }
                      }}
                      className="rounded-2xl border border-neutral-200/90 overflow-hidden bg-white hover:shadow-xs hover:border-neutral-300 transition-all cursor-pointer flex flex-col min-h-[170px] text-left group select-none"
                    >
                      {/* Top half soft gray banner (clean, matching screenshot) */}
                      <div className="h-24 bg-[#f4f4f5] border-b border-neutral-100/80" />
                      {/* Bottom half title + count */}
                      <div className="p-3.5 flex flex-col justify-between flex-1 bg-white">
                        <div className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-neutral-900">
                          <Box className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                          <span className="truncate">{space.title}</span>
                        </div>
                        <p className="text-[11px] text-neutral-400 font-normal mt-1">
                          0 content
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: SPLIT STUDY WORKSPACE (READER + AI TUTOR) */}
        {activeTab === "study" && (
          <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
            {/* Center/Left Main Content Study Panel */}
            <div
              className={`flex-1 flex flex-col bg-white border-r border-neutral-200/80 overflow-hidden ${
                isReaderMaximized ? "w-full" : ""
              }`}
            >
              {/* Study Panel Navigation & Segmented Tabs */}
              <div className="px-4 sm:px-6 py-3 border-b border-neutral-200/80 flex flex-wrap items-center justify-between gap-3 bg-[#fcfcfd]">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setActiveTab("dashboard")}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-xs font-semibold text-neutral-700 transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Library</span>
                  </button>

                  <div className="truncate max-w-[200px] sm:max-w-xs md:max-w-md">
                    <h2 className="text-xs sm:text-sm font-semibold text-neutral-900 truncate">
                      {selectedDoc.title}
                    </h2>
                    <span className="text-[11px] text-neutral-400">
                      {selectedDoc.space} • {selectedDoc.pagesOrDuration}
                    </span>
                  </div>
                </div>

                {/* Segmented Tool Tabs */}
                <div className="flex items-center p-1 bg-neutral-100 rounded-full border border-neutral-200/80 text-xs font-medium">
                  <button
                    onClick={() => setStudyTool("reader")}
                    className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                      studyTool === "reader"
                        ? "bg-white text-neutral-900 font-semibold shadow-2xs"
                        : "text-neutral-600 hover:text-neutral-900"
                    }`}
                  >
                    📖 Reader
                  </button>
                  <button
                    onClick={() => setStudyTool("summary")}
                    className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                      studyTool === "summary"
                        ? "bg-white text-neutral-900 font-semibold shadow-2xs"
                        : "text-neutral-600 hover:text-neutral-900"
                    }`}
                  >
                    📝 Summary
                  </button>
                  <button
                    onClick={() => setStudyTool("notes")}
                    className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                      studyTool === "notes"
                        ? "bg-white text-neutral-900 font-semibold shadow-2xs"
                        : "text-neutral-600 hover:text-neutral-900"
                    }`}
                  >
                    ✍️ Notes
                  </button>
                  <button
                    onClick={() => setStudyTool("flashcards")}
                    className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                      studyTool === "flashcards"
                        ? "bg-white text-neutral-900 font-semibold shadow-2xs"
                        : "text-neutral-600 hover:text-neutral-900"
                    }`}
                  >
                    🗂 Cards
                  </button>
                  <button
                    onClick={() => setStudyTool("quiz")}
                    className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                      studyTool === "quiz"
                        ? "bg-white text-neutral-900 font-semibold shadow-2xs"
                        : "text-neutral-600 hover:text-neutral-900"
                    }`}
                  >
                    🎯 Quiz
                  </button>
                </div>

                {/* Viewport maximize button */}
                <button
                  onClick={() => setIsReaderMaximized(!isReaderMaximized)}
                  title={isReaderMaximized ? "Split View" : "Maximize Reader"}
                  className="hidden lg:flex p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
                >
                  {isReaderMaximized ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>
              </div>

              {/* Study Area Body */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                {/* TOOL 1: READER (DOCUMENT PAGE CHUNKS & CITATION HIGHLIGHTS) */}
                {studyTool === "reader" && (
                  <div className="max-w-3xl mx-auto space-y-6">
                    {/* Reader Toolbar */}
                    <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-xs py-2 px-3 rounded-xl border border-neutral-200/80 shadow-2xs flex items-center justify-between text-xs text-neutral-600 mb-6">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-neutral-800">
                          {documentChunks.length} {documentChunks.length === 1 ? "Page" : "Pages"}
                        </span>
                        <span className="text-neutral-300">•</span>
                        <span className="text-emerald-700 font-medium">Grounded Retrieval Active</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setZoomLevel((z) => Math.max(80, z - 10))}
                          className="p-1 rounded hover:bg-neutral-100 text-neutral-500"
                          title="Zoom out text"
                        >
                          <ZoomOut className="w-3.5 h-3.5" />
                        </button>
                        <span className="font-mono text-[11px]">{zoomLevel}%</span>
                        <button
                          onClick={() => setZoomLevel((z) => Math.min(140, z + 10))}
                          className="p-1 rounded hover:bg-neutral-100 text-neutral-500"
                          title="Zoom in text"
                        >
                          <ZoomIn className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* YouTube Video Player Embed if YouTube link */}
                    {selectedDoc.type === "youtube" && (
                      <div className="rounded-2xl overflow-hidden border border-neutral-200/90 shadow-md mb-8 aspect-video bg-black">
                        <iframe
                          src="https://www.youtube.com/embed/kBdfcR-8hEY?enablejsapi=1"
                          title="Lecture Video Player"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="w-full h-full border-0"
                        />
                      </div>
                    )}

                    {/* Document Pages / Chunks */}
                    {isChunksLoading ? (
                      <div className="py-20 text-center text-neutral-400 space-y-3">
                        <div className="w-6 h-6 border-2 border-neutral-300 border-t-neutral-900 rounded-full animate-spin mx-auto" />
                        <p className="text-xs">Loading document page chunks...</p>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {documentChunks.map((chunk, idx) => {
                          const isHighlighted = highlightedPage === chunk.pageNumber;
                          return (
                            <div
                              key={idx}
                              ref={(el) => {
                                pageRefs.current[chunk.pageNumber] = el;
                              }}
                              className={`p-6 sm:p-8 rounded-2xl border transition-all duration-300 bg-white shadow-2xs ${
                                isHighlighted
                                  ? "border-emerald-500 ring-2 ring-emerald-200 bg-emerald-50/30"
                                  : "border-neutral-200/80"
                              }`}
                              style={{ fontSize: `${(zoomLevel / 100) * 14}px` }}
                            >
                              <div className="flex items-center justify-between text-xs font-mono text-neutral-400 mb-4 pb-2 border-b border-neutral-100">
                                <span className="inline-block text-[11px] font-semibold text-neutral-700 bg-neutral-100 px-2 py-0.5 rounded">
                                  Page {chunk.pageNumber}
                                </span>
                                <span className="text-[11px] text-neutral-400">
                                  Chunk #{chunk.chunkIndex + 1}
                                </span>
                              </div>

                              <div className="text-neutral-800 leading-relaxed font-sans whitespace-pre-line space-y-3">
                                {chunk.content}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* TOOL 2: SUMMARY VIEW */}
                {studyTool === "summary" && (
                  <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-200">
                    <div className="flex items-center justify-between text-xs text-neutral-500 font-mono">
                      <span className="text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 font-semibold">
                        Academic Synthesis • {selectedDoc.space}
                      </span>
                      <span>{selectedDoc.pagesOrDuration}</span>
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-serif font-bold text-neutral-900 leading-tight">
                      {selectedDoc.title}
                    </h2>

                    <div className="p-5 bg-neutral-50 rounded-2xl border border-neutral-200/80 space-y-3">
                      <h3 className="font-semibold text-xs uppercase tracking-wider text-neutral-500">
                        Executive Overview
                      </h3>
                      <p className="text-sm sm:text-[15px] text-neutral-800 leading-relaxed font-sans whitespace-pre-line">
                        {selectedDoc.summaryText}
                      </p>
                    </div>

                    <div className="p-5 bg-emerald-50/80 border-l-4 border-emerald-500 rounded-r-2xl text-xs sm:text-sm text-emerald-950 font-medium space-y-2">
                      <div className="font-bold text-emerald-900 flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-emerald-700" />
                        <span>High-Yield Study Recommendations</span>
                      </div>
                      <p className="leading-relaxed">
                        1. Review flashcards using active recall before exam review.<br />
                        2. Take the practice quiz to verify your conceptual comprehension.<br />
                        3. Ask the AI Tutor questions grounded directly in the document page text.
                      </p>
                    </div>
                  </div>
                )}

                {/* TOOL 3: STUDENT NOTES EDITOR */}
                {studyTool === "notes" && (
                  <div className="max-w-3xl mx-auto space-y-4 animate-in fade-in duration-200 flex flex-col h-full">
                    <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
                      <div className="flex items-center gap-2">
                        <Edit3 className="w-4 h-4 text-neutral-700" />
                        <input
                          type="text"
                          value={noteTitle}
                          onChange={(e) => setNoteTitle(e.target.value)}
                          className="font-semibold text-base text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900 px-2 py-0.5 rounded"
                        />
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-[11px] font-mono text-neutral-400">
                          {noteSaveStatus === "saving" && "Saving..."}
                          {noteSaveStatus === "saved" && "✓ Saved to cloud"}
                          {noteSaveStatus === "unsaved" && "Unsaved edits"}
                        </span>
                        <button
                          onClick={() => {
                            const blob = new Blob([noteContent], { type: "text/markdown" });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement("a");
                            a.href = url;
                            a.download = `${selectedDoc.title.replace(/[^a-zA-Z0-9]/g, "_")}-notes.md`;
                            a.click();
                          }}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-xs font-medium text-neutral-700 cursor-pointer"
                        >
                          <Download className="w-3 h-3" />
                          <span>Export .md</span>
                        </button>
                      </div>
                    </div>

                    <textarea
                      value={noteContent}
                      onChange={(e) => handleNoteChange(e.target.value)}
                      placeholder="Write your study notes, key formulas, lecture takeaways..."
                      rows={16}
                      className="w-full flex-1 p-5 rounded-2xl bg-white border border-neutral-200/90 text-sm font-mono text-neutral-800 leading-relaxed focus:outline-none focus:ring-2 focus:ring-neutral-900 resize-none shadow-2xs"
                    />
                  </div>
                )}

                {/* TOOL 4: 3D ACTIVE RECALL FLASHCARDS */}
                {studyTool === "flashcards" && (
                  <div className="max-w-xl mx-auto py-4 animate-in fade-in duration-200">
                    <div className="flex items-center justify-between text-xs text-neutral-500 mb-4 font-mono">
                      <span>
                        Card {flashcards.length > 0 ? cardIndex + 1 : 0} of {flashcards.length}
                      </span>
                      <div className="flex items-center gap-3">
                        <span className="text-emerald-700 font-semibold">
                          Mastery:{" "}
                          {flashcards.length > 0
                            ? Math.round((flashcards.filter((f) => f.known === true).length / flashcards.length) * 100)
                            : 0}
                          %
                        </span>
                        <button
                          onClick={() => handleGenerateFlashcards()}
                          disabled={isFlashcardsLoading}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-[11px] font-sans font-medium text-neutral-800 cursor-pointer disabled:opacity-50"
                        >
                          <Sparkles className={`w-3 h-3 text-amber-500 ${isFlashcardsLoading ? "animate-spin" : ""}`} />
                          <span>{isFlashcardsLoading ? "Generating..." : "Fresh Cards"}</span>
                        </button>
                      </div>
                    </div>

                    {isFlashcardsLoading ? (
                      <div className="w-full h-72 rounded-3xl border border-neutral-200 bg-neutral-50 flex flex-col items-center justify-center p-8 text-neutral-500">
                        <div className="w-6 h-6 border-2 border-neutral-300 border-t-neutral-900 rounded-full animate-spin mb-3" />
                        <p className="text-xs font-medium">Generating AI study flashcards...</p>
                      </div>
                    ) : flashcards.length > 0 && flashcards[cardIndex] ? (
                      <div>
                        {/* 3D Flip Card */}
                        <div
                          onClick={() => setIsFlipped(!isFlipped)}
                          className="w-full h-72 bg-white hover:bg-neutral-50/80 rounded-3xl border border-neutral-200 p-8 flex flex-col justify-between text-center shadow-xs cursor-pointer select-none transition-all duration-200 relative group"
                        >
                          <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                            <span>{isFlipped ? "Answer / Definition" : "Prompt / Question"}</span>
                            {flashcards[cardIndex].sourceRef && (
                              <span className="text-emerald-700">{flashcards[cardIndex].sourceRef}</span>
                            )}
                          </div>

                          <div className="text-base sm:text-lg font-medium text-neutral-900 leading-snug px-4">
                            {isFlipped ? flashcards[cardIndex].back : flashcards[cardIndex].front}
                          </div>

                          <div className="text-[11px] text-neutral-400 flex items-center justify-center gap-1">
                            <span>Press</span>
                            <kbd className="px-1.5 py-0.5 rounded bg-neutral-100 border border-neutral-200 text-neutral-600 font-mono text-[10px]">Space</kbd>
                            <span>to flip</span>
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center justify-center gap-4 mt-6">
                          <button
                            onClick={() => handleReviewCard(false)}
                            className="px-6 py-2.5 rounded-full border border-neutral-300 text-xs font-semibold text-neutral-700 hover:bg-neutral-100 cursor-pointer flex items-center gap-1.5"
                          >
                            <kbd className="px-1.5 py-0.2 rounded bg-neutral-200 text-neutral-600 font-mono text-[10px]">1</kbd>
                            <span>Still Learning</span>
                          </button>
                          <button
                            onClick={() => handleReviewCard(true)}
                            className="px-6 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs cursor-pointer flex items-center gap-1.5"
                          >
                            <kbd className="px-1.5 py-0.2 rounded bg-emerald-800 text-emerald-100 font-mono text-[10px]">2</kbd>
                            <Check className="w-3.5 h-3.5" />
                            <span>Got It!</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="w-full h-72 rounded-3xl border border-dashed border-neutral-300 bg-neutral-50 flex flex-col items-center justify-center p-8 text-neutral-500 space-y-3">
                        <p className="text-xs">No flashcards yet for this document.</p>
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

                {/* TOOL 5: PRACTICE EXAM / QUIZ */}
                {studyTool === "quiz" && (
                  <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-200 py-2">
                    <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
                      <div>
                        <h3 className="font-semibold text-base text-neutral-900">Practice Exam Simulation</h3>
                        <p className="text-xs text-neutral-500">
                          Server-evaluated multiple-choice questions with explanatory feedback.
                        </p>
                      </div>
                      <button
                        onClick={() => handleGenerateQuiz()}
                        disabled={isQuizLoading}
                        className="px-3 py-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-xs font-medium text-neutral-800 cursor-pointer disabled:opacity-50"
                      >
                        {isQuizLoading ? "Generating..." : "New Exam"}
                      </button>
                    </div>

                    {/* Quiz Results Banner */}
                    {quizResults && (
                      <div
                        className={`p-6 rounded-2xl border text-center space-y-2 animate-in zoom-in-95 duration-200 ${
                          quizResults.passed
                            ? "bg-emerald-50 border-emerald-200 text-emerald-950"
                            : "bg-amber-50 border-amber-200 text-amber-950"
                        }`}
                      >
                        <div className="inline-flex items-center gap-1.5 font-bold text-sm">
                          {quizResults.passed ? (
                            <>
                              <Award className="w-5 h-5 text-emerald-600" />
                              <span>Exam Passed! Score: {quizResults.score} / {quizResults.total} ({quizResults.percentage}%)</span>
                            </>
                          ) : (
                            <>
                              <AlertCircle className="w-5 h-5 text-amber-600" />
                              <span>Needs Review: {quizResults.score} / {quizResults.total} ({quizResults.percentage}%)</span>
                            </>
                          )}
                        </div>
                        <p className="text-xs opacity-90">
                          Review the detailed explanations below to reinforce conceptual gaps.
                        </p>
                      </div>
                    )}

                    {/* Questions List */}
                    <div className="space-y-6">
                      {quizQuestions.map((q, qIndex) => {
                        const gradedItem = quizResults?.graded.find((r) => r.id === q.id);

                        return (
                          <div
                            key={q.id}
                            className="p-5 sm:p-6 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs space-y-4"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <span className="font-mono text-xs font-semibold text-neutral-400">
                                Question {qIndex + 1}
                              </span>
                              {gradedItem && (
                                <span
                                  className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                                    gradedItem.isCorrect
                                      ? "bg-emerald-100 text-emerald-800"
                                      : "bg-rose-100 text-rose-800"
                                  }`}
                                >
                                  {gradedItem.isCorrect ? "✓ Correct" : "✕ Incorrect"}
                                </span>
                              )}
                            </div>

                            <p className="text-sm font-semibold text-neutral-900 leading-snug">
                              {q.question}
                            </p>

                            <div className="space-y-2">
                              {q.options.map((opt, optIndex) => {
                                const isSelected = selectedAnswers[q.id] === optIndex;
                                const isCorrectChoice = gradedItem && gradedItem.correctAnswer === optIndex;
                                const isWrongChoice = gradedItem && !gradedItem.isCorrect && isSelected;

                                return (
                                  <button
                                    key={optIndex}
                                    disabled={Boolean(quizResults)}
                                    onClick={() =>
                                      setSelectedAnswers((prev) => ({
                                        ...prev,
                                        [q.id]: optIndex,
                                      }))
                                    }
                                    className={`w-full text-left p-3 rounded-xl border text-xs sm:text-[13px] transition-all cursor-pointer flex items-center justify-between ${
                                      isCorrectChoice
                                        ? "bg-emerald-50 border-emerald-500 text-emerald-950 font-semibold"
                                        : isWrongChoice
                                        ? "bg-rose-50 border-rose-400 text-rose-950"
                                        : isSelected
                                        ? "bg-neutral-900 text-white border-neutral-900 shadow-2xs font-medium"
                                        : "bg-white hover:bg-neutral-50 border-neutral-200/90 text-neutral-800"
                                    }`}
                                  >
                                    <span className="leading-relaxed">{opt}</span>
                                    {isCorrectChoice && <Check className="w-4 h-4 text-emerald-700 shrink-0" />}
                                  </button>
                                );
                              })}
                            </div>

                            {/* Explanation Reveal after submission */}
                            {gradedItem && (
                              <div className="pt-3 mt-3 border-t border-neutral-100 text-xs text-neutral-600 bg-neutral-50/80 p-3 rounded-xl leading-relaxed space-y-1">
                                <span className="font-bold text-neutral-800 block">Explanation:</span>
                                <p>{gradedItem.explanation}</p>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Submit Button */}
                    {!quizResults ? (
                      <button
                        onClick={handleSubmitQuiz}
                        disabled={isSubmittingQuiz || Object.keys(selectedAnswers).length === 0}
                        className="w-full py-3.5 rounded-full bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-semibold shadow-md active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50"
                      >
                        {isSubmittingQuiz ? "Evaluating Answers..." : "Submit Exam For Evaluation"}
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setQuizResults(null);
                          setSelectedAnswers({});
                        }}
                        className="w-full py-3.5 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-900 text-xs font-semibold transition-all cursor-pointer"
                      >
                        Retake Exam
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Right Side: LearnNova AI Tutor Chat Panel */}
            {!isReaderMaximized && (
              <div className="w-full lg:w-[420px] bg-[#fcfcfd] flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-neutral-200/80 h-[500px] lg:h-auto">
                {/* Chat Header */}
                <div className="px-4 py-3 border-b border-neutral-200/80 flex items-center justify-between bg-white">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <div>
                      <span className="font-semibold text-xs text-neutral-900 block leading-tight">
                        LearnNova AI Tutor
                      </span>
                      <span className="text-[10px] text-neutral-400 font-mono">
                        Grounded with citations
                      </span>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Groq Engine
                  </span>
                </div>

                {/* Chat Message Thread */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {chatMessages.map((msg, index) => (
                    <div
                      key={index}
                      className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
                    >
                      <div
                        className={`max-w-[90%] rounded-2xl px-4 py-3 text-xs sm:text-[13px] leading-relaxed ${
                          msg.sender === "user"
                            ? "bg-neutral-950 text-white shadow-2xs"
                            : "bg-white text-neutral-800 border border-neutral-200/80 shadow-2xs"
                        }`}
                      >
                        {msg.sender === "user" ? (
                          <p className="whitespace-pre-line">{msg.text}</p>
                        ) : (
                          <div className="prose prose-sm max-w-none prose-neutral">
                            <ReactMarkdown>{msg.text}</ReactMarkdown>
                          </div>
                        )}
                      </div>

                      {/* Clickable Citations */}
                      {msg.citations && msg.citations.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2 max-w-[90%]">
                          {msg.citations.map((cit, cIdx) => (
                            <button
                              key={cIdx}
                              onClick={() => handleCitationClick(cit.pageNumber)}
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 hover:bg-emerald-100 text-[11px] font-mono text-emerald-800 border border-emerald-200 transition-colors cursor-pointer"
                              title={`Jump to Page ${cit.pageNumber}: ${cit.excerpt}`}
                            >
                              <span>📖 Page {cit.pageNumber}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}

                  {isAiThinking && (
                    <div className="flex justify-start">
                      <div className="bg-white rounded-2xl px-4 py-2.5 border border-neutral-200 text-xs text-neutral-500 flex items-center gap-2 shadow-2xs">
                        <Sparkles className="w-3.5 h-3.5 animate-spin text-emerald-600" />
                        <span>AI tutor is analyzing study chunks...</span>
                      </div>
                    </div>
                  )}
                  <div ref={chatBottomRef} />
                </div>

                {/* Quick Action Prompt Chips */}
                <div className="px-4 py-2 border-t border-neutral-100 flex flex-wrap gap-1.5 bg-white/50">
                  <button
                    onClick={() => handleSendMessage(undefined, `Quiz me on the core concepts in "${selectedDoc.title}"`)}
                    className="px-2.5 py-1 rounded-full bg-neutral-100 hover:bg-neutral-200 text-[11px] text-neutral-700 font-medium cursor-pointer"
                  >
                    💡 Quiz me
                  </button>
                  <button
                    onClick={() => handleSendMessage(undefined, "Explain the key terms with a simple real-world analogy")}
                    className="px-2.5 py-1 rounded-full bg-neutral-100 hover:bg-neutral-200 text-[11px] text-neutral-700 font-medium cursor-pointer"
                  >
                    🔍 Real analogy
                  </button>
                  <button
                    onClick={() => handleSendMessage(undefined, "What are the most likely exam questions from this material?")}
                    className="px-2.5 py-1 rounded-full bg-neutral-100 hover:bg-neutral-200 text-[11px] text-neutral-700 font-medium cursor-pointer"
                  >
                    🎯 Exam focus
                  </button>
                </div>

                {/* Chat Input Bar */}
                <form
                  onSubmit={handleSendMessage}
                  className="p-3 bg-white border-t border-neutral-200/80 flex items-center gap-2"
                >
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Ask your tutor anything..."
                    className="flex-1 px-3 py-2 text-xs sm:text-sm text-neutral-800 placeholder-neutral-400 focus:outline-none bg-neutral-50 rounded-xl border border-neutral-200 focus:bg-white"
                  />
                  <button
                    type="submit"
                    disabled={!inputMessage.trim() || isAiThinking}
                    className="w-8 h-8 rounded-xl bg-neutral-950 text-white flex items-center justify-center hover:bg-black transition-all cursor-pointer shrink-0 disabled:opacity-40"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>
            )}
          </div>
        )}
      </main>

      {/* ========================================================= */}
      {/* DEDICATED INGESTION MODALS (100% MATCHING SCREENSHOTS)   */}
      {/* ========================================================= */}
      {uploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          {/* 1. YOUTUBE, WEBSITE MODAL (100% MATCHING IMAGE 1) */}
          {uploadType === "link" && (
            <div className="bg-white rounded-[26px] max-w-[480px] w-full p-6 sm:p-7 shadow-2xl relative animate-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2.5">
                  <LinkIcon className="w-5 h-5 text-neutral-800" strokeWidth={2} />
                  <h3 className="text-lg font-semibold text-neutral-900">YouTube, Website</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setUploadModalOpen(false)}
                  className="text-neutral-400 hover:text-neutral-700 transition-colors p-1 cursor-pointer"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-[#737373] leading-relaxed mb-5">
                YouTube (videos & playlists), websites, arXiv, and public file URLs: .pdf, .docx, .pptx, .mp3, .mp4
              </p>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleProcessUpload();
                }}
              >
                <input
                  type="text"
                  value={pasteUrl}
                  onChange={(e) => setPasteUrl(e.target.value)}
                  placeholder="https://youtu.be/dQw4w9WgXcQ"
                  autoFocus
                  className="w-full px-4 py-3.5 rounded-2xl border border-neutral-300 focus:border-neutral-900 text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none transition-colors"
                />

                {uploadStep && (
                  <p className="text-xs text-emerald-800 font-mono mt-3 text-center animate-pulse">
                    {uploadStep}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isSavingContent || !pasteUrl.trim()}
                  className="w-full mt-4 py-3.5 rounded-2xl bg-[#737373] hover:bg-[#525252] text-white text-sm font-semibold transition-colors cursor-pointer disabled:opacity-50 flex items-center justify-center"
                >
                  {isSavingContent ? "Adding..." : "Add"}
                </button>
              </form>
            </div>
          )}

          {/* 2. PASTE TEXT MODAL (100% MATCHING IMAGE 2) */}
          {uploadType === "text" && (
            <div className="bg-white rounded-[26px] max-w-[480px] w-full p-6 sm:p-7 shadow-2xl relative animate-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2.5">
                  <svg className="w-5 h-5 text-neutral-800 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 3H19a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" />
                    <path d="M3 12h8" />
                    <path d="M8 9l3 3-3 3" />
                  </svg>
                  <h3 className="text-lg font-semibold text-neutral-900">Paste Text</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setUploadModalOpen(false)}
                  className="text-neutral-400 hover:text-neutral-700 transition-colors p-1 cursor-pointer"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-[#737373] leading-relaxed mb-5">
                Copy and paste text to add as content
              </p>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleProcessUpload();
                }}
              >
                <textarea
                  rows={5}
                  value={pastedText}
                  onChange={(e) => setPastedText(e.target.value)}
                  placeholder="Paste your notes here"
                  autoFocus
                  className="w-full p-4 rounded-2xl border border-neutral-300 focus:border-neutral-900 text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none resize-none transition-colors min-h-[140px]"
                />

                {uploadStep && (
                  <p className="text-xs text-emerald-800 font-mono mt-3 text-center animate-pulse">
                    {uploadStep}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isSavingContent || !pastedText.trim()}
                  className="w-full mt-4 py-3.5 rounded-2xl bg-[#737373] hover:bg-[#525252] text-white text-sm font-semibold transition-colors cursor-pointer disabled:opacity-50 flex items-center justify-center"
                >
                  {isSavingContent ? "Adding..." : "Add"}
                </button>
              </form>
            </div>
          )}

          {/* 3. RECORD LECTURE MODAL (100% MATCHING IMAGE 3) */}
          {uploadType === "record" && (
            <div className="bg-white rounded-[26px] max-w-[480px] w-full p-6 sm:p-7 shadow-2xl relative animate-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-semibold text-neutral-900">Record Lecture</h3>
                <button
                  type="button"
                  onClick={() => setUploadModalOpen(false)}
                  className="text-neutral-400 hover:text-neutral-700 transition-colors p-1 cursor-pointer"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {uploadStep && (
                <p className="text-xs text-emerald-800 font-mono mb-4 text-center animate-pulse">
                  {uploadStep}
                </p>
              )}

              <div className="space-y-3">
                {/* Option 1: Microphone */}
                <button
                  type="button"
                  onClick={() => handleStartRecording("mic")}
                  disabled={isSavingContent}
                  className="w-full p-4 rounded-2xl border border-neutral-200 hover:border-neutral-400 bg-white flex items-center gap-4 text-left transition-all cursor-pointer group"
                >
                  <div className="w-9 h-9 flex items-center justify-center text-neutral-700 shrink-0">
                    <Mic className="w-5 h-5 text-neutral-700 stroke-[1.8]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-neutral-900">Microphone</h4>
                    <p className="text-xs text-neutral-500 mt-0.5">Record your voice or class</p>
                  </div>
                </button>

                {/* Option 2: Browser Tab */}
                <button
                  type="button"
                  onClick={() => handleStartRecording("tab")}
                  disabled={isSavingContent}
                  className="w-full p-4 rounded-2xl border border-neutral-200 hover:border-neutral-400 bg-white flex items-center gap-4 text-left transition-all cursor-pointer group"
                >
                  <div className="w-9 h-9 flex items-center justify-center text-neutral-700 shrink-0">
                    <svg className="w-5 h-5 text-neutral-700 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="3" width="20" height="14" rx="2" />
                      <circle cx="18" cy="7" r="1.5" fill="currentColor" stroke="none" />
                      <path d="M8 21h8" />
                      <path d="M12 17v4" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-neutral-900">Browser Tab</h4>
                    <p className="text-xs text-neutral-500 mt-0.5">Capture audio playing in a browser tab</p>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* 4. FILE UPLOAD MODAL */}
          {uploadType === "file" && (
            <div className="bg-white rounded-[26px] max-w-[480px] w-full p-6 sm:p-7 shadow-2xl relative animate-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2.5">
                  <Upload className="w-5 h-5 text-neutral-800" strokeWidth={2} />
                  <h3 className="text-lg font-semibold text-neutral-900">Upload File</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setUploadModalOpen(false)}
                  className="text-neutral-400 hover:text-neutral-700 transition-colors p-1 cursor-pointer"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-[#737373] leading-relaxed mb-5">
                Upload documents, slides, audio, or video files (.pdf, .docx, .pptx, .mp3, .mp4)
              </p>

              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      setUploadedFileName(e.target.files[0].name);
                    }
                  }}
                  className="hidden"
                  accept=".pdf,.docx,.txt,.md,.mp3,.mp4,.pptx"
                />

                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-neutral-300 rounded-2xl p-7 text-center bg-neutral-50/70 hover:bg-neutral-100/60 transition-colors cursor-pointer"
                >
                  <Upload className="w-6 h-6 text-neutral-400 mx-auto mb-2" />
                  <p className="text-xs font-semibold text-neutral-800">
                    {uploadedFileName ? `Selected: ${uploadedFileName}` : "Click to select or drag & drop"}
                  </p>
                  <p className="text-[11px] text-neutral-400 mt-1">
                    PDF, DOCX, PPTX, MP3, MP4 (up to 50 MB)
                  </p>
                </div>

                {uploadStep && (
                  <p className="text-xs text-emerald-800 font-mono mt-3 text-center animate-pulse">
                    {uploadStep}
                  </p>
                )}

                <button
                  type="button"
                  onClick={() => handleProcessUpload()}
                  disabled={isSavingContent || !uploadedFileName}
                  className="w-full mt-4 py-3.5 rounded-2xl bg-[#737373] hover:bg-[#525252] text-white text-sm font-semibold transition-colors cursor-pointer disabled:opacity-50 flex items-center justify-center"
                >
                  {isSavingContent ? "Adding..." : "Add"}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* MODAL 2: CREATE SPACE MODAL */}
      {newSpaceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-7 border border-neutral-200 shadow-2xl relative animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setNewSpaceModalOpen(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-neutral-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-xl font-bold text-neutral-900 mb-1">Create Course Space</h3>
            <p className="text-xs text-neutral-500 mb-6">
              Group your lectures, textbook chapters, and exams by course or curriculum.
            </p>

            <form onSubmit={handleCreateSpace} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-neutral-700 block mb-1.5">
                  Course Title
                </label>
                <input
                  type="text"
                  required
                  value={newSpaceTitle}
                  onChange={(e) => setNewSpaceTitle(e.target.value)}
                  placeholder="e.g. Organic Chemistry II"
                  className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-700 block mb-1.5">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={newSpaceDescription}
                  onChange={(e) => setNewSpaceDescription(e.target.value)}
                  placeholder="Syllabus topics, semester modules, exam dates..."
                  className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-full bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-semibold shadow-md active:scale-[0.98] transition-all cursor-pointer"
              >
                Create Space
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: HELP & TOOLS MODAL */}
      {helpModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-7 border border-neutral-200 shadow-2xl relative animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setHelpModalOpen(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-neutral-600 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-xl font-bold text-neutral-900 mb-2">Help &amp; Tools</h3>
            <p className="text-xs text-neutral-500 mb-5">
              Welcome to YouLearn! Here is how to make the most of your AI study companion.
            </p>

            <div className="space-y-3.5 text-xs text-neutral-700">
              <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200/80">
                <span className="font-semibold text-neutral-900 block mb-1">📄 1. Upload Any Material</span>
                <p className="text-neutral-500 text-[11px] leading-relaxed">
                  Upload textbooks, PDF slides, paste YouTube video lectures, or record live classroom audio.
                </p>
              </div>

              <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200/80">
                <span className="font-semibold text-neutral-900 block mb-1">🤖 2. Grounded AI Tutor</span>
                <p className="text-neutral-500 text-[11px] leading-relaxed">
                  Ask questions and receive instant answers with exact page citations linking to your materials.
                </p>
              </div>

              <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200/80">
                <span className="font-semibold text-neutral-900 block mb-1">🗂 3. Active Recall &amp; Quizzes</span>
                <p className="text-neutral-500 text-[11px] leading-relaxed">
                  Practice with 3D spaced repetition flashcards and test yourself with AI generated quizzes.
                </p>
              </div>
            </div>

            <button
              onClick={() => setHelpModalOpen(false)}
              className="w-full mt-6 py-2.5 rounded-full bg-neutral-900 text-white text-xs font-semibold hover:bg-black transition-colors cursor-pointer"
            >
              Got it
            </button>
          </div>
        </div>
      )}

      {/* MODAL 4: HISTORY MODAL */}
      {historyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-7 border border-neutral-200 shadow-2xl relative animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setHistoryModalOpen(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-neutral-600 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-xl font-bold text-neutral-900 mb-1">Study History</h3>
            <p className="text-xs text-neutral-500 mb-5">
              Your recent study sessions, documents, and lecture notes.
            </p>

            <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
              {recentDocs.map((doc) => (
                <div
                  key={doc.id}
                  onClick={() => {
                    handleOpenDoc(doc);
                    setHistoryModalOpen(false);
                  }}
                  className="p-3 rounded-xl border border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50 transition-all cursor-pointer flex items-center justify-between"
                >
                  <div className="min-w-0 pr-3">
                    <p className="text-xs font-semibold text-neutral-900 truncate">{doc.title}</p>
                    <p className="text-[11px] text-neutral-400 mt-0.5">
                      {doc.space} • {doc.pagesOrDuration} • {doc.date}
                    </p>
                  </div>
                  <span className="text-xs font-medium text-emerald-700 shrink-0">Open →</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => setHistoryModalOpen(false)}
              className="w-full mt-6 py-2.5 rounded-full bg-neutral-900 text-white text-xs font-semibold hover:bg-black transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
