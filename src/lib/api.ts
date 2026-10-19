/**
 * LearnNova Unified Backend API Client
 * Connects Next.js Frontend to FastAPI Python Backend
 */

export const API_BASE_URL = (() => {
  // When running in the browser on an HTTPS production page (e.g. Vercel),
  // always route through the Next.js same-origin reverse proxy (/api/backend)
  // unless the API URL is already secure HTTPS, preventing browser Mixed Content blocking.
  if (typeof window !== "undefined" && window.location.protocol === "https:") {
    const publicUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!publicUrl || publicUrl.startsWith("http://")) {
      return "/api/backend";
    }
  }
  return process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "/api/backend";
})();

export interface ChatMessage {
  sender: "user" | "ai";
  text: string;
}

export interface ChatRequest {
  message: string;
  context?: string;
  history?: ChatMessage[];
}

export interface ChatResponse {
  reply: string;
}

export interface FlashcardItem {
  id: number;
  front: string;
  back: string;
}

export interface GenerateFlashcardsRequest {
  content: string;
  count?: number;
}

export interface GenerateFlashcardsResponse {
  flashcards: FlashcardItem[];
}

export interface QuizQuestionItem {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface GenerateQuizRequest {
  content: string;
  count?: number;
}

export interface GenerateQuizResponse {
  questions: QuizQuestionItem[];
}

export interface ChapterItem {
  time: string;
  title: string;
  summary: string;
}

export interface YouTubeSummarizeRequest {
  url: string;
}

export interface YouTubeSummarizeResponse {
  id: string;
  youtubeId: string;
  title: string;
  channel: string;
  duration: string;
  url: string;
  summary: string;
  keyTakeaways: string[];
  chapters: ChapterItem[];
  quizQuestions: QuizQuestionItem[];
  flashcards: FlashcardItem[];
}

export interface DocumentProcessResponse {
  title: string;
  pageCount: number;
  charCount: number;
  summary: string;
  keyTakeaways: string[];
  flashcards: FlashcardItem[];
  quizQuestions: QuizQuestionItem[];
}

export interface BackendHealthResponse {
  status: string;
  app: string;
  version: string;
  environment: string;
  primary_ai_provider: string;
  groq_configured: boolean;
  deepseek_configured: boolean;
  gemini_configured: boolean;
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  // If API_BASE_URL is set, use direct URL; otherwise fallback to Next.js proxy
  const url = `${API_BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

  const defaultHeaders: Record<string, string> = {};
  if (!(options.body instanceof FormData)) {
    defaultHeaders["Content-Type"] = "application/json";
  }

  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });

  if (!response.ok) {
    let errorDetail = `Request failed with status ${response.status}`;
    try {
      const errJson = await response.json();
      if (errJson.detail) {
        errorDetail = typeof errJson.detail === "string" ? errJson.detail : JSON.stringify(errJson.detail);
      }
    } catch {
      // Ignore JSON parse errors for non-JSON responses
    }
    throw new Error(errorDetail);
  }

  return response.json() as Promise<T>;
}

/** Check health and AI provider status of Python backend */
export async function getBackendHealth(): Promise<BackendHealthResponse> {
  return request<BackendHealthResponse>("/api/health");
}

/** Ask AI Tutor a question with optional document context and chat history */
export async function askChatTutor(payload: ChatRequest): Promise<ChatResponse> {
  return request<ChatResponse>("/api/chat/ask", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/** Generate active recall study flashcards from document content */
export async function generateStudyFlashcards(
  payload: GenerateFlashcardsRequest
): Promise<GenerateFlashcardsResponse> {
  return request<GenerateFlashcardsResponse>("/api/study/flashcards", {
    method: "POST",
    body: JSON.stringify({
      content: payload.content,
      count: payload.count ?? 5,
    }),
  });
}

/** Generate multiple-choice quiz questions from document content */
export async function generateStudyQuiz(
  payload: GenerateQuizRequest
): Promise<GenerateQuizResponse> {
  return request<GenerateQuizResponse>("/api/study/quiz", {
    method: "POST",
    body: JSON.stringify({
      content: payload.content,
      count: payload.count ?? 4,
    }),
  });
}

/** Extract transcripts and generate AI summaries, chapters, flashcards, & quiz for YouTube videos */
export async function summarizeYouTubeVideo(
  url: string
): Promise<YouTubeSummarizeResponse> {
  return request<YouTubeSummarizeResponse>("/api/youtube/summarize", {
    method: "POST",
    body: JSON.stringify({ url }),
  });
}

/** Process an uploaded PDF textbook or notes file */
export async function processPdfDocument(
  file: File
): Promise<DocumentProcessResponse> {
  const formData = new FormData();
  formData.append("file", file);

  return request<DocumentProcessResponse>("/api/documents/process-pdf", {
    method: "POST",
    body: formData,
  });
}
