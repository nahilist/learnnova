import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { DocumentItem } from "@/lib/workspace";

export async function POST(request: NextRequest) {
  try {
    const { userId, document }: { userId: string; document: DocumentItem } = await request.json();
    if (!userId || !document) {
      return NextResponse.json({ error: "userId and document are required" }, { status: 400 });
    }

    await sql`
      INSERT INTO documents (id, user_id, title, type, space, date, pages_or_duration, summary_text, file_url)
      VALUES (
        ${document.id}, 
        ${userId}, 
        ${document.title}, 
        ${document.type}, 
        ${document.space}, 
        ${document.date}, 
        ${document.pagesOrDuration}, 
        ${document.summaryText},
        ${document.fileUrl || null}
      )
      ON CONFLICT (id) DO UPDATE SET
        title = EXCLUDED.title,
        type = EXCLUDED.type,
        space = EXCLUDED.space,
        date = EXCLUDED.date,
        pages_or_duration = EXCLUDED.pages_or_duration,
        summary_text = EXCLUDED.summary_text,
        file_url = EXCLUDED.file_url
    `;

    return NextResponse.json(document);
  } catch (error) {
    console.error("Create document error:", error);
    return NextResponse.json({ error: "Failed to create document" }, { status: 500 });
  }
}

