/**
 * LearnNova Unified Backend API Client
 * Connects Next.js Frontend to FastAPI Backend via Session-Authenticated Proxy
 */

// Route all browser calls through the session-aware /api/backend proxy
export const API_BASE_URL = "/api/backend";

export interface ChatMessage {
  sender: "user" | "ai";
  text: string;
}

export interface CitationItem {
  pageNumber: number;
  excerpt: string;
}

export interface DocumentChunk {
  pageNumber: number;
  chunkIndex: number;
  content: string;
}

export interface ChatRequest {
  message: string;
  context?: string;
  chunks?: DocumentChunk[];
  history?: ChatMessage[];
}

export interface ChatResponse {
  reply: string;
  citations?: CitationItem[];
  grounded?: boolean;
}

export interface FlashcardItem {
  id: number;
  front: string;
  back: string;
  sourceRef?: string;
  mastery?: number;
}

export interface GenerateFlashcardsRequest {
  content: string;
  count?: number;
  documentId?: string;
}

export interface GenerateFlashcardsResponse {
  flashcards: FlashcardItem[];
}

export interface QuizQuestionItem {
  id: number;
  question: string;
  options: string[];
  correctIndex?: number;
  explanation?: string;
}

export interface GenerateQuizRequest {
  content: string;
  count?: number;
  difficulty?: "easy" | "medium" | "hard";
  documentId?: string;
}

export interface GenerateQuizResponse {
  questions: QuizQuestionItem[];
}

export interface QuizGradedQuestion {
  id: number;
  question: string;
  options: string[];
  userAnswer?: number;
  correctAnswer: number;
  isCorrect: boolean;
  explanation: string;
}

export interface QuizSubmitRequest {
  documentId?: string;
  answers: Record<string | number, number>;
  questions?: QuizQuestionItem[];
}

export interface QuizSubmitResponse {
  score: number;
  totalQuestions: number;
  percentage: float;
  passed: boolean;
  results: QuizGradedQuestion[];
}

type float = number;

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
  chunks?: DocumentChunk[];
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
      if (errJson.error) {
        errorDetail = errJson.error;
      } else if (errJson.detail) {
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
  return request<BackendHealthResponse>("/health");
}

/** Ask AI Tutor a question with optional document chunks and citations */
export async function askChatTutor(payload: ChatRequest): Promise<ChatResponse> {
  return request<ChatResponse>("/chat/ask", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/** Generate active recall study flashcards from document content */
export async function generateStudyFlashcards(
  payload: GenerateFlashcardsRequest
): Promise<GenerateFlashcardsResponse> {
  return request<GenerateFlashcardsResponse>("/study/flashcards", {
    method: "POST",
    body: JSON.stringify({
      content: payload.content,
      count: payload.count ?? 5,
      documentId: payload.documentId,
    }),
  });
}

/** Generate practice exam quiz questions from document content */
export async function generateStudyQuiz(
  payload: GenerateQuizRequest
): Promise<GenerateQuizResponse> {
  return request<GenerateQuizResponse>("/study/quiz", {
    method: "POST",
    body: JSON.stringify({
      content: payload.content,
      count: payload.count ?? 4,
      difficulty: payload.difficulty ?? "medium",
      documentId: payload.documentId,
    }),
  });
}

/** Submit quiz answers for server-side score calculation and explanation reveal */
export async function submitStudyQuiz(
  payload: QuizSubmitRequest
): Promise<QuizSubmitResponse> {
  return request<QuizSubmitResponse>("/study/quiz/submit", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/** Extract transcripts and generate AI summaries, chapters, flashcards, & quiz for YouTube videos */
export async function summarizeYouTubeVideo(
  url: string
): Promise<YouTubeSummarizeResponse> {
  return request<YouTubeSummarizeResponse>("/youtube/summarize", {
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

  return request<DocumentProcessResponse>("/documents/process-pdf", {
    method: "POST",
    body: formData,
  });
}
