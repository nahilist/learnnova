"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { getFirebaseAuth, isFirebaseConfigured } from "@/lib/firebase/client";

export function AuthGuard({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(isFirebaseConfigured);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (!isFirebaseConfigured) {
      return;
    }

    const unsubscribe = onAuthStateChanged(getFirebaseAuth(), (user) => {
      if (user) {
        setIsAuthenticated(true);
        setIsChecking(false);
        return;
      }

      const next = encodeURIComponent(pathname || "/app");
      router.replace(`/signin?next=${next}`);
      setIsChecking(false);
    });

    return unsubscribe;
  }, [pathname, router]);

  if (!isFirebaseConfigured) {
    return (
      <main className="min-h-screen bg-[#fafafa] px-6 flex items-center justify-center">
        <div className="w-full max-w-lg rounded-3xl border border-neutral-200 bg-white p-8 text-center shadow-lg">
          <h1 className="text-2xl font-semibold text-neutral-950">Firebase setup required</h1>
          <p className="mt-3 text-sm leading-6 text-neutral-600">
            Copy the Firebase web app values from <code>.env.example</code> into <code>.env.local</code>,
            then restart the development server.
          </p>
          <Link
            href="/signin"
            className="mt-6 inline-flex rounded-full bg-neutral-950 px-5 py-2.5 text-sm font-medium text-white"
          >
            Return to sign in
          </Link>
        </div>
      </main>
    );
  }

  if (isChecking || !isAuthenticated) {
    return (
      <main className="min-h-screen bg-[#fafafa] flex items-center justify-center" aria-live="polite">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-200 border-t-neutral-950" />
        <span className="sr-only">Checking your session</span>
      </main>
    );
  }

  return children;
}
