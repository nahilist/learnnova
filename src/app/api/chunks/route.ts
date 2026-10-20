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
      return NextResponse.json({ error: "documentId is required" }, { status: 400 });
    }

    const chunks = await sql`
      SELECT page_number as "pageNumber", chunk_index as "chunkIndex", content
      FROM document_chunks
      WHERE user_id = ${user.id} AND document_id = ${documentId}
      ORDER BY chunk_index ASC
    `;

    return NextResponse.json({ chunks });
  } catch (error) {
    console.error("Chunks GET error:", error);
    return NextResponse.json({ error: "Failed to load document chunks" }, { status: 500 });
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
    const { documentId, chunks } = body;

    if (!documentId || !Array.isArray(chunks)) {
      return NextResponse.json({ error: "documentId and chunks array required" }, { status: 400 });
    }

    // Verify user owns document
    const docCheck = await sql`
      SELECT id FROM documents WHERE id = ${documentId} AND user_id = ${user.id}
    `;
    if (docCheck.length === 0) {
      return NextResponse.json({ error: "Document not found or access denied." }, { status: 404 });
    }

    for (let i = 0; i < chunks.length; i++) {
      const c = chunks[i];
      const chunkId = `chk-${documentId}-${c.chunkIndex ?? i}`;
      await sql`
        INSERT INTO document_chunks (id, document_id, user_id, page_number, chunk_index, content)
        VALUES (${chunkId}, ${documentId}, ${user.id}, ${c.pageNumber || 1}, ${c.chunkIndex ?? i}, ${c.content})
        ON CONFLICT (id) DO UPDATE SET content = EXCLUDED.content;
      `;
    }

    return NextResponse.json({ success: true, count: chunks.length });
  } catch (error) {
    console.error("Chunks POST error:", error);
    return NextResponse.json({ error: "Failed to save document chunks" }, { status: 500 });
  }
}
