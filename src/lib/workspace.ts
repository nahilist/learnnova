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
  type: "pdf" | "youtube" | "recording";
  space: string;
  date: string;
  pagesOrDuration: string;
  summaryText: string;
  fileUrl?: string;
}

export const DEFAULT_SPACES: SpaceItem[] = [
  {
    id: "bio",
    title: "Human Behavioral Biology",
    count: 21,
    bgGradient: "from-amber-700 via-orange-600 to-amber-900",
    description: "Evolutionary genetics, neuroscience, and behavior biology lectures.",
  },
  {
    id: "ml",
    title: "Machine Learning & AI",
    count: 18,
    bgGradient: "from-slate-800 via-zinc-900 to-neutral-950",
    description: "Transformers, neural network architectures, and mathematical loss functions.",
  },
  {
    id: "psych",
    title: "Intro to Psychology",
    count: 6,
    bgGradient: "from-teal-700 via-emerald-800 to-cyan-900",
    description: "Cognitive biases, memory systems, and developmental psychology.",
  },
];

export const DEFAULT_DOCUMENTS: DocumentItem[] = [
  {
    id: "doc-1",
    title: "The Genetic Code & Translation (Chapter 11)",
    type: "pdf",
    space: "Human Behavioral Biology",
    date: "Today",
    pagesOrDuration: "24 pages",
    summaryText:
      "Transfer RNAs act as adaptors between codons and amino acids. Wobble base pairing at the 3' position allows 61 codons to be recognized with fewer tRNAs.",
  },
  {
    id: "doc-2",
    title: "Justice 01: The Moral Side of Murder (Harvard)",
    type: "youtube",
    space: "Philosophy & Law",
    date: "Yesterday",
    pagesOrDuration: "54 mins",
    summaryText:
      "Explores utilitarian ethics versus categorical moral duties through famous ethical dilemmas like the trolley problem.",
  },
  {
    id: "doc-3",
    title: "Teaching CS50 with AI (ACM SIGCSE 2024)",
    type: "pdf",
    space: "Machine Learning & AI",
    date: "3 days ago",
    pagesOrDuration: "8 pages",
    summaryText:
      "Analyzes student engagement and outcomes when using 24/7 AI teaching assistants in large introductory programming courses.",
  },
];

export async function fetchUserWorkspace(userId: string): Promise<{ spaces: SpaceItem[]; documents: DocumentItem[] }> {
  const res = await fetch(`/api/workspace?userId=${encodeURIComponent(userId)}`, {
    method: "GET",
  });
  if (!res.ok) {
    throw new Error(`Failed to load workspace: ${res.statusText}`);
  }
  return res.json();
}

export async function initializeUserWorkspace(user: { id: string; email?: string | null; name?: string | null }): Promise<{ spaces: SpaceItem[]; documents: DocumentItem[] }> {
  const res = await fetch("/api/workspace/init", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userId: user.id,
      email: user.email,
      name: user.name,
    }),
  });
  if (!res.ok) {
    throw new Error(`Failed to initialize workspace: ${res.statusText}`);
  }
  return res.json();
}

export async function createSpace(userId: string, space: SpaceItem): Promise<SpaceItem> {
  const res = await fetch("/api/workspace/spaces", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, space }),
  });
  if (!res.ok) {
    throw new Error(`Failed to create space: ${res.statusText}`);
  }
  return res.json();
}

export async function createDocument(userId: string, documentItem: DocumentItem): Promise<DocumentItem> {
  const res = await fetch("/api/workspace/documents", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, document: documentItem }),
  });
  if (!res.ok) {
    throw new Error(`Failed to create document: ${res.statusText}`);
  }
  return res.json();
}

export async function uploadToStorage(file: File): Promise<{ key: string; url: string }> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("/api/storage/upload", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    throw new Error(`Failed to upload file to Neon Object Storage: ${res.statusText}`);
  }
  return res.json();
}

