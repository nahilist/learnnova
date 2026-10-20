import { auth } from "@/lib/auth/server";
import { NextResponse } from "next/server";

export interface AuthenticatedUser {
  id: string;
  email: string;
  name?: string | null;
}

/**
 * Validates the current session on the server.
 * Returns the authenticated user or null.
 */
export async function getAuthenticatedUser(): Promise<AuthenticatedUser | null> {
  try {
    const { data: session } = await auth.getSession();
    if (!session?.user?.id) {
      return null;
    }
    return {
      id: session.user.id,
      email: session.user.email || "",
      name: session.user.name || null,
    };
  } catch (error) {
    console.error("Session verification failed:", error);
    return null;
  }
}

/**
 * Helper to require authentication in API Route Handlers.
 * Returns either the verified user or a 401 Unauthorized NextResponse.
 */
export async function requireAuthUser(): Promise<
  { user: AuthenticatedUser; errorResponse: null } | { user: null; errorResponse: NextResponse }
> {
  const user = await getAuthenticatedUser();
  if (!user) {
    return {
      user: null,
      errorResponse: NextResponse.json(
        { error: "Authentication required. Your session has expired or is invalid." },
        { status: 401 }
      ),
    };
  }
  return { user, errorResponse: null };
}
