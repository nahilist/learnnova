import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { requireAuthUser } from "@/lib/auth/session";
import { DocumentItem } from "@/lib/workspace";

export async function POST(request: NextRequest) {
  try {
    const authCheck = await requireAuthUser();
    if (authCheck.errorResponse) {
      return authCheck.errorResponse;
    }
    const { user } = authCheck;

    const body = await request.json();
    const document: DocumentItem = body.document || body;

    if (!document || !document.title) {
      return NextResponse.json({ error: "Document payload with title is required" }, { status: 400 });
    }

    const docId = document.id || `doc-${Date.now()}`;
    const docType = document.type || "pdf";
    const space = document.space || "General Learning";
    const dateStr = document.date || "Just now";
    const pagesOrDuration = document.pagesOrDuration || "1 page";
    const summaryText = document.summaryText || "";
    const fileUrl = document.fileUrl || null;
    const status = (document as { status?: string }).status || "ready";

    await sql`
      INSERT INTO documents (
        id, user_id, title, type, space, date, pages_or_duration, summary_text, file_url, status
      )
      VALUES (
        ${docId}, 
        ${user.id}, 
        ${document.title}, 
        ${docType}, 
        ${space}, 
        ${dateStr}, 
        ${pagesOrDuration}, 
        ${summaryText},
        ${fileUrl},
        ${status}
      )
      ON CONFLICT (id) DO UPDATE SET
        title = EXCLUDED.title,
        type = EXCLUDED.type,
        space = EXCLUDED.space,
        date = EXCLUDED.date,
        pages_or_duration = EXCLUDED.pages_or_duration,
        summary_text = EXCLUDED.summary_text,
        file_url = COALESCE(EXCLUDED.file_url, documents.file_url),
        status = EXCLUDED.status,
        updated_at = NOW()
      WHERE documents.user_id = ${user.id};
    `;

    // Increment space item count
    await sql`
      UPDATE spaces
      SET count = count + 1, updated_at = NOW()
      WHERE user_id = ${user.id} AND title = ${space};
    `;

    return NextResponse.json({
      ...document,
      id: docId,
      userId: user.id,
      status,
    });
  } catch (error) {
    console.error("Create document error:", error);
    return NextResponse.json({ error: "Failed to persist document" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const authCheck = await requireAuthUser();
    if (authCheck.errorResponse) {
      return authCheck.errorResponse;
    }
    const { user } = authCheck;

    const { searchParams } = new URL(request.url);
    const documentId = searchParams.get("id");

    if (!documentId) {
      return NextResponse.json({ error: "Document ID required" }, { status: 400 });
    }

    // Verify ownership before deleting
    const existing = await sql`
      SELECT id FROM documents WHERE id = ${documentId} AND user_id = ${user.id}
    `;

    if (existing.length === 0) {
      return NextResponse.json({ error: "Document not found or access denied." }, { status: 404 });
    }

    await sql`
      DELETE FROM documents WHERE id = ${documentId} AND user_id = ${user.id}
    `;

    return NextResponse.json({ success: true, deletedId: documentId });
  } catch (error) {
    console.error("Delete document error:", error);
    return NextResponse.json({ error: "Failed to delete document" }, { status: 500 });
  }
}
