export interface SpaceItem {
  id: string;
  title: string;
  count: number;
  bgGradient: string;
  description: string;
}

export interface DocumentItem {
  id: string;
  title: string;
  type: "pdf" | "youtube" | "recording" | "text" | "notes";
  space: string;
  date: string;
  pagesOrDuration: string;
  summaryText: string;
  fileUrl?: string;
  status?: string;
  failureReason?: string;
}

export interface WorkspaceData {
  spaces: SpaceItem[];
  documents: DocumentItem[];
  usage?: {
    questionsUsed: number;
    questionsLimit: number;
    uploadsUsed: number;
    uploadsLimit: number;
  };
  user?: {
    id: string;
    email: string;
    name?: string | null;
  };
}

export const DEFAULT_SPACES: SpaceItem[] = [
  {
    id: "himanshu-space",
    title: "Himanshu's Space",
    count: 0,
    bgGradient: "from-neutral-200 via-neutral-100 to-stone-200",
    description: "Personal study workspace, lectures, flashcards, and notes.",
  },
  {
    id: "ml",
    title: "Machine Learning & AI",
    count: 18,
    bgGradient: "from-slate-800 via-zinc-900 to-neutral-950",
    description: "Transformers, neural network architectures, and mathematical loss functions.",
  },
  {
    id: "bio",
    title: "Human Behavioral Biology",
    count: 21,
    bgGradient: "from-amber-700 via-orange-600 to-amber-900",
    description: "Evolutionary genetics, neuroscience, and behavior biology lectures.",
  },
];

export const DEFAULT_DOCUMENTS: DocumentItem[] = [
  {
    id: "doc-1",
    title: "1. Introduction to the Human Behavioral Biology",
    type: "youtube",
    space: "Himanshu's Space",
    date: "Today",
    pagesOrDuration: "Lecture 1",
    summaryText:
      "Stanford lecture series exploring evolutionary genetics, neurobiology, and behavioral endocrinology to understand complex human actions without reductionist bias.",
  },
  {
    id: "doc-2",
    title: "Positional Encoding in Transformer Models",
    type: "pdf",
    space: "Himanshu's Space",
    date: "Yesterday",
    pagesOrDuration: "12 pages",
    summaryText:
      "Mathematical formulation of sine and cosine positional encodings enabling attention mechanisms to retain sequence order without recurrent loops.",
  },
  {
    id: "doc-3",
    title: "What is Multi-head Attention Mechanism?",
    type: "pdf",
    space: "Himanshu's Space",
    date: "2 days ago",
    pagesOrDuration: "18 pages",
    summaryText:
      "Detailed explanation of linear projections of Query, Key, and Value vectors across multiple representation subspaces to capture diverse semantic relationships.",
  },
  {
    id: "doc-4",
    title: "Why is Self Attention called \"Scaled\"?",
    type: "pdf",
    space: "Himanshu's Space",
    date: "3 days ago",
    pagesOrDuration: "6 pages",
    summaryText:
      "The 1/sqrt(d_k) scaling factor prevents dot products from growing excessively large in high dimensions, preventing small softmax gradients.",
  },
  {
    id: "doc-5",
    title: "Scaled Dot Product Attention Explained",
    type: "pdf",
    space: "Himanshu's Space",
    date: "4 days ago",
    pagesOrDuration: "14 pages",
    summaryText:
      "Step-by-step breakdown of softmax((QK^T)/sqrt(d_k))V, matrix multiplications, masking techniques, and computational complexity trade-offs.",
  },
];

/**
 * Fetches the authenticated user's workspace securely using session cookie.
 */
export async function fetchUserWorkspace(): Promise<WorkspaceData> {
  const res = await fetch("/api/workspace", {
    method: "GET",
  });
  if (!res.ok) {
    if (res.status === 401) {
      throw new Error("Session expired. Please sign in again.");
    }
    throw new Error(`Failed to load workspace: ${res.statusText}`);
  }
  return res.json();
}

/**
 * Creates a new space for the authenticated user.
 */
export async function createSpace(_userId: string, space: SpaceItem): Promise<SpaceItem> {
  const res = await fetch("/api/workspace/spaces", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ space }),
  });
  if (!res.ok) {
    throw new Error(`Failed to create space: ${res.statusText}`);
  }
  return res.json();
}

/**
 * Creates or updates a document for the authenticated user.
 */
export async function createDocument(_userId: string, documentItem: DocumentItem): Promise<DocumentItem> {
  const res = await fetch("/api/workspace/documents", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ document: documentItem }),
  });
  if (!res.ok) {
    throw new Error(`Failed to create document: ${res.statusText}`);
  }
  return res.json();
}

/**
 * Deletes a document for the authenticated user.
 */
export async function deleteDocument(documentId: string): Promise<boolean> {
  const res = await fetch(`/api/workspace/documents?id=${encodeURIComponent(documentId)}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    let errMessage = `Failed to delete document (${res.statusText})`;
    try {
      const err = await res.json();
      if (err.error) errMessage = err.error;
    } catch {
      // fallback
    }
    throw new Error(errMessage);
  }
  return true;
}

/**
 * Uploads file to secure user-scoped storage with quota validation.
 */
export async function uploadToStorage(file: File): Promise<{ key: string; url: string; quotaRemaining?: number }> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("/api/storage/upload", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    let errMessage = `Failed to upload file (${res.statusText})`;
    try {
      const err = await res.json();
      if (err.error) errMessage = err.error;
    } catch {
      // fallback
    }
    throw new Error(errMessage);
  }
  return res.json();
}
