"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth/client";

export function AuthGuard({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (!isPending && !session?.user) {
      const next = encodeURIComponent(pathname || "/app");
      router.replace(`/signin?next=${next}`);
    }
  }, [isPending, session, pathname, router]);

  if (isPending || !session?.user) {
    return (
      <main className="min-h-screen bg-[#fafafa] flex items-center justify-center" aria-live="polite">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-200 border-t-neutral-950" />
        <span className="sr-only">Checking your session</span>
      </main>
    );
  }

  return <>{children}</>;
}
