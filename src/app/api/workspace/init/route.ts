import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { requireAuthUser } from "@/lib/auth/session";
import { DEFAULT_SPACES, DEFAULT_DOCUMENTS } from "@/lib/workspace";

export async function POST() {
  try {
    const authCheck = await requireAuthUser();
    if (authCheck.errorResponse) {
      return authCheck.errorResponse;
    }
    const { user } = authCheck;

    // Check if spaces exist for this authenticated user
    const existing = await sql`
      SELECT id FROM spaces WHERE user_id = ${user.id} LIMIT 1
    `;

    if (existing.length === 0) {
      for (const space of DEFAULT_SPACES) {
        const spaceId = `${space.id}-${user.id.slice(0, 8)}`;
        await sql`
          INSERT INTO spaces (id, user_id, title, count, bg_gradient, description)
          VALUES (${spaceId}, ${user.id}, ${space.title}, ${space.count}, ${space.bgGradient}, ${space.description})
          ON CONFLICT (id) DO NOTHING
        `;
      }

      for (const doc of DEFAULT_DOCUMENTS) {
        const docId = `${doc.id}-${user.id.slice(0, 8)}`;
        await sql`
          INSERT INTO documents (id, user_id, title, type, space, date, pages_or_duration, summary_text, status)
          VALUES (${docId}, ${user.id}, ${doc.title}, ${doc.type}, ${doc.space}, ${doc.date}, ${doc.pagesOrDuration}, ${doc.summaryText}, 'ready')
          ON CONFLICT (id) DO NOTHING
        `;
      }
    }

    const spaces = await sql`
      SELECT id, title, count, bg_gradient as "bgGradient", description
      FROM spaces
      WHERE user_id = ${user.id}
      ORDER BY created_at ASC
    `;

    const documents = await sql`
      SELECT id, title, type, space, date, pages_or_duration as "pagesOrDuration",
             summary_text as "summaryText", file_url as "fileUrl", status
      FROM documents
      WHERE user_id = ${user.id}
      ORDER BY created_at DESC
    `;

    return NextResponse.json({ spaces, documents });
  } catch (error) {
    console.error("Workspace init error:", error);
    return NextResponse.json({ error: "Failed to initialize workspace" }, { status: 500 });
  }
}
