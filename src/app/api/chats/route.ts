import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { requireAuthUser } from "@/lib/auth/session";

export async function GET(request: NextRequest) {
  try {
    const authCheck = await requireAuthUser();
    if (authCheck.errorResponse) {
      return authCheck.errorResponse;
    }
    const { user } = authCheck;

    const { searchParams } = new URL(request.url);
    const documentId = searchParams.get("documentId");

    if (!documentId) {
      return NextResponse.json({ messages: [] });
    }

    // Get or create chat thread
    const chatId = `chat-${documentId}-${user.id.slice(0, 8)}`;
    const messages = await sql`
      SELECT sender, content as "text", citations, created_at as "createdAt"
      FROM messages
      WHERE chat_id = ${chatId} AND user_id = ${user.id}
      ORDER BY created_at ASC
      LIMIT 50
    `;

    return NextResponse.json({ messages });
  } catch (error) {
    console.error("Chat GET error:", error);
    return NextResponse.json({ error: "Failed to load chat history" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const authCheck = await requireAuthUser();
    if (authCheck.errorResponse) {
      return authCheck.errorResponse;
    }
    const { user } = authCheck;

    const body = await request.json();
    const { documentId, sender, text, citations } = body;

    if (!documentId || !sender || !text) {
      return NextResponse.json({ error: "documentId, sender, and text are required" }, { status: 400 });
    }

    const chatId = `chat-${documentId}-${user.id.slice(0, 8)}`;

    // Ensure chat thread exists
    await sql`
      INSERT INTO chats (id, user_id, document_id, title)
      VALUES (${chatId}, ${user.id}, ${documentId}, ${"Document Study Chat"})
      ON CONFLICT (id) DO UPDATE SET updated_at = NOW();
    `;

    const msgId = `msg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const citationsJson = JSON.stringify(citations || []);

    await sql`
      INSERT INTO messages (id, chat_id, user_id, sender, content, citations)
      VALUES (${msgId}, ${chatId}, ${user.id}, ${sender}, ${text}, ${citationsJson}::jsonb);
    `;

    return NextResponse.json({ success: true, messageId: msgId });
  } catch (error) {
    console.error("Chat POST error:", error);
    return NextResponse.json({ error: "Failed to persist chat message" }, { status: 500 });
  }
}
