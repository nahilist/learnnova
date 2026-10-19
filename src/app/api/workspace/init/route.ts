import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { DEFAULT_SPACES, DEFAULT_DOCUMENTS } from "@/lib/workspace";

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json();
    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    // Check if spaces exist
    const existing = await sql`
      SELECT id FROM spaces WHERE user_id = ${userId} LIMIT 1
    `;

    if (existing.length === 0) {
      for (const space of DEFAULT_SPACES) {
        await sql`
          INSERT INTO spaces (id, user_id, title, count, bg_gradient, description)
          VALUES (${space.id}, ${userId}, ${space.title}, ${space.count}, ${space.bgGradient}, ${space.description})
          ON CONFLICT (id) DO NOTHING
        `;
      }

      for (const doc of DEFAULT_DOCUMENTS) {
        await sql`
          INSERT INTO documents (id, user_id, title, type, space, date, pages_or_duration, summary_text)
          VALUES (${doc.id}, ${userId}, ${doc.title}, ${doc.type}, ${doc.space}, ${doc.date}, ${doc.pagesOrDuration}, ${doc.summaryText})
          ON CONFLICT (id) DO NOTHING
        `;
      }
    }

    const spaces = await sql`
      SELECT id, title, count, bg_gradient as "bgGradient", description
      FROM spaces
      WHERE user_id = ${userId}
      ORDER BY created_at ASC
    `;

    const documents = await sql`
      SELECT id, title, type, space, date, pages_or_duration as "pagesOrDuration", summary_text as "summaryText", file_url as "fileUrl"
      FROM documents
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
    `;

    return NextResponse.json({ spaces, documents });
  } catch (error) {
    console.error("Workspace init error:", error);
    return NextResponse.json({ error: "Failed to initialize workspace" }, { status: 500 });
  }
}

