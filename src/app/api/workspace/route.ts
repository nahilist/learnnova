import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { DEFAULT_SPACES, DEFAULT_DOCUMENTS } from "@/lib/workspace";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId") || "default-user";

    const spacesResult = await sql`
      SELECT id, title, count, bg_gradient as "bgGradient", description
      FROM spaces
      WHERE user_id = ${userId}
      ORDER BY created_at ASC
    `;

    const documentsResult = await sql`
      SELECT id, title, type, space, date, pages_or_duration as "pagesOrDuration", summary_text as "summaryText", file_url as "fileUrl"
      FROM documents
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
    `;

    // If empty for this user, seed default data
    if (spacesResult.length === 0) {
      for (const space of DEFAULT_SPACES) {
        await sql`
          INSERT INTO spaces (id, user_id, title, count, bg_gradient, description)
          VALUES (${space.id}, ${userId}, ${space.title}, ${space.count}, ${space.bgGradient}, ${space.description})
          ON CONFLICT (id) DO NOTHING
        `;
      }
    }

    if (documentsResult.length === 0) {
      for (const doc of DEFAULT_DOCUMENTS) {
        await sql`
          INSERT INTO documents (id, user_id, title, type, space, date, pages_or_duration, summary_text)
          VALUES (${doc.id}, ${userId}, ${doc.title}, ${doc.type}, ${doc.space}, ${doc.date}, ${doc.pagesOrDuration}, ${doc.summaryText})
          ON CONFLICT (id) DO NOTHING
        `;
      }
    }

    const finalSpaces = spacesResult.length > 0 ? spacesResult : DEFAULT_SPACES;
    const finalDocs = documentsResult.length > 0 ? documentsResult : DEFAULT_DOCUMENTS;

    return NextResponse.json({
      spaces: finalSpaces,
      documents: finalDocs,
    });
  } catch (error) {
    if ((error as { digest?: string })?.digest?.startsWith?.("NEXT_")) {
      throw error;
    }
    console.error("Workspace GET error:", error);
    return NextResponse.json({ error: "Failed to load workspace data" }, { status: 500 });
  }
}
