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

    let notes;
    if (documentId) {
      notes = await sql`
        SELECT id, document_id as "documentId", title, content, updated_at as "updatedAt"
        FROM notes
        WHERE user_id = ${user.id} AND document_id = ${documentId}
        ORDER BY updated_at DESC
      `;
    } else {
      notes = await sql`
        SELECT id, document_id as "documentId", title, content, updated_at as "updatedAt"
        FROM notes
        WHERE user_id = ${user.id}
        ORDER BY updated_at DESC
        LIMIT 20
      `;
    }

    return NextResponse.json({ notes });
  } catch (error) {
    console.error("Notes GET error:", error);
    return NextResponse.json({ error: "Failed to load notes" }, { status: 500 });
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
    const { documentId, title, content } = body;

    if (!title && !content) {
      return NextResponse.json({ error: "Title or content required" }, { status: 400 });
    }

    const noteId = body.id || `note-${documentId || "general"}-${user.id.slice(0, 8)}`;
    const noteTitle = title || "Study Notes";
    const noteContent = content || "";

    await sql`
      INSERT INTO notes (id, document_id, user_id, title, content)
      VALUES (${noteId}, ${documentId || null}, ${user.id}, ${noteTitle}, ${noteContent})
      ON CONFLICT (id) DO UPDATE SET
        title = EXCLUDED.title,
        content = EXCLUDED.content,
        updated_at = NOW()
      WHERE notes.user_id = ${user.id};
    `;

    return NextResponse.json({
      success: true,
      note: {
        id: noteId,
        documentId,
        title: noteTitle,
        content: noteContent,
        updatedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Notes POST error:", error);
    return NextResponse.json({ error: "Failed to save note" }, { status: 500 });
  }
}
