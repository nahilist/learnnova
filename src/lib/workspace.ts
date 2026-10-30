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
    id: "personal-space",
    title: "Personal Workspace",
    count: 0,
    bgGradient: "from-neutral-200 via-neutral-100 to-stone-200",
    description: "Personal study workspace, lectures, flashcards, and notes.",
  },
];

export const DEFAULT_DOCUMENTS: DocumentItem[] = [];

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
