import type { User } from "firebase/auth";
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  setDoc,
  type Unsubscribe,
} from "firebase/firestore";
import { getFirebaseDb } from "@/lib/firebase/client";

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

export async function initializeUserWorkspace(user: User): Promise<void> {
  const db = getFirebaseDb();
  const userRef = doc(db, "users", user.uid);

  await runTransaction(db, async (transaction) => {
    const userSnapshot = await transaction.get(userRef);
    const isInitialized = userSnapshot.data()?.workspaceInitialized === true;

    transaction.set(
      userRef,
      {
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        updatedAt: serverTimestamp(),
        lastSeenAt: serverTimestamp(),
        ...(!userSnapshot.exists() ? { createdAt: serverTimestamp() } : {}),
        ...(!isInitialized ? { workspaceInitialized: true } : {}),
      },
      { merge: true },
    );

    if (isInitialized) return;

    DEFAULT_SPACES.forEach((space, index) => {
      transaction.set(doc(db, "users", user.uid, "spaces", space.id), {
        ...space,
        createdAt: index,
      });
    });

    DEFAULT_DOCUMENTS.forEach((documentItem, index) => {
      transaction.set(doc(db, "users", user.uid, "documents", documentItem.id), {
        ...documentItem,
        createdAt: DEFAULT_DOCUMENTS.length - index,
      });
    });
  });
}

export function subscribeToSpaces(
  uid: string,
  onData: (spaces: SpaceItem[]) => void,
  onError: (error: Error) => void,
): Unsubscribe {
  const spacesQuery = query(
    collection(getFirebaseDb(), "users", uid, "spaces"),
    orderBy("createdAt", "asc"),
  );

  return onSnapshot(
    spacesQuery,
    (snapshot) => {
      onData(snapshot.docs.map((spaceDoc) => ({ ...spaceDoc.data(), id: spaceDoc.id }) as SpaceItem));
    },
    onError,
  );
}

export function subscribeToDocuments(
  uid: string,
  onData: (documents: DocumentItem[]) => void,
  onError: (error: Error) => void,
): Unsubscribe {
  const documentsQuery = query(
    collection(getFirebaseDb(), "users", uid, "documents"),
    orderBy("createdAt", "desc"),
  );

  return onSnapshot(
    documentsQuery,
    (snapshot) => {
      onData(
        snapshot.docs.map(
          (documentSnapshot) => ({ ...documentSnapshot.data(), id: documentSnapshot.id }) as DocumentItem,
        ),
      );
    },
    onError,
  );
}

export async function createSpace(uid: string, space: SpaceItem): Promise<void> {
  await setDoc(doc(getFirebaseDb(), "users", uid, "spaces", space.id), {
    ...space,
    createdAt: Date.now(),
  });
}

export async function createDocument(uid: string, documentItem: DocumentItem): Promise<void> {
  await setDoc(doc(getFirebaseDb(), "users", uid, "documents", documentItem.id), {
    ...documentItem,
    createdAt: Date.now(),
  });
}
