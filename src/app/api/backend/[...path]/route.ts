import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth/session";
import { createInternalBackendHeaders } from "@/lib/auth/internalToken";
import { checkAndIncrementQuestionQuota } from "@/lib/quotas";

// Get backend URL from environment, defaulting to local dev URL
function getBackendBaseUrl(): string {
  const url = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  return url.replace(/\/$/, "");
}

// Restricted allowed upstream subpaths
const ALLOWED_PATH_PREFIXES = ["health", "chat", "study", "documents", "youtube"];

async function handleProxy(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const resolvedParams = await params;
  const pathSegments = resolvedParams.path || [];

  // Strip leading 'api' if duplicated
  const cleanSegments = pathSegments[0] === "api" ? pathSegments.slice(1) : pathSegments;
  const subpath = cleanSegments.join("/");

  // Validate allowed upstream paths to prevent open proxying
  const isAllowed = ALLOWED_PATH_PREFIXES.some(
    (prefix) => cleanSegments[0] === prefix || subpath.startsWith(prefix)
  );

  if (!isAllowed && subpath !== "") {
    return NextResponse.json(
      { error: "Invalid or restricted backend endpoint requested." },
      { status: 403 }
    );
  }

  // Health check does not strictly require auth
  const isPublicEndpoint = subpath === "health";
  const user = await getAuthenticatedUser();

  if (!isPublicEndpoint && !user) {
    return NextResponse.json(
      { error: "Authentication required. Your session has expired or is invalid." },
      { status: 401 }
    );
  }

  // For chat/generation requests, verify daily AI question quota
  if (subpath.startsWith("chat/ask") && user) {
    const quota = await checkAndIncrementQuestionQuota(user.id);
    if (!quota.allowed) {
      return NextResponse.json(
        { error: `Daily AI limit reached: ${quota.resetMessage}` },
        { status: 429 }
      );
    }
  }

  const backendBase = getBackendBaseUrl();
  const search = request.nextUrl.search;
  const targetUrl = `${backendBase}/api/${subpath}${search}`;

  const forwardHeaders = new Headers();
  const contentType = request.headers.get("content-type");
  if (contentType) {
    forwardHeaders.set("Content-Type", contentType);
  }
  forwardHeaders.set("Accept", request.headers.get("accept") || "application/json");

  // Attach verified user identity headers with server-to-server signature
  if (user) {
    const secureHeaders = createInternalBackendHeaders(user.id, user.email);
    for (const [k, v] of Object.entries(secureHeaders)) {
      forwardHeaders.set(k, v);
    }
  }

  try {
    const method = request.method;
    const body = method !== "GET" && method !== "HEAD" ? await request.arrayBuffer() : undefined;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 45000); // 45s timeout

    const upstreamResponse = await fetch(targetUrl, {
      method,
      headers: forwardHeaders,
      body,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    // Forward streaming responses (like SSE or chunked transfer)
    const isStream = upstreamResponse.headers.get("content-type")?.includes("text/event-stream");
    if (isStream && upstreamResponse.body) {
      return new NextResponse(upstreamResponse.body as unknown as ReadableStream, {
        status: upstreamResponse.status,
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache, no-transform",
          Connection: "keep-alive",
        },
      });
    }

    const responseData = await upstreamResponse.arrayBuffer();
    const responseHeaders = new Headers();
    const upstreamContentType = upstreamResponse.headers.get("content-type");
    if (upstreamContentType) {
      responseHeaders.set("Content-Type", upstreamContentType);
    }

    return new NextResponse(responseData, {
      status: upstreamResponse.status,
      headers: responseHeaders,
    });
  } catch (err: unknown) {
    const error = err as { name?: string; message?: string };
    if (error?.name === "AbortError") {
      return NextResponse.json(
        { error: "AI Tutor request timed out. Please try asking a shorter question or try again." },
        { status: 504 }
      );
    }

    console.error(`Upstream backend proxy error on ${targetUrl}:`, error?.message);
    return NextResponse.json(
      {
        error:
          "AI Tutor service is temporarily unavailable. Please check backend connection or try again in a moment.",
      },
      { status: 502 }
    );
  }
}

export async function GET(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return handleProxy(request, context);
}

export async function POST(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return handleProxy(request, context);
}

export async function PUT(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return handleProxy(request, context);
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return handleProxy(request, context);
}
