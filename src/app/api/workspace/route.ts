import { connection, NextResponse } from "next/server";
import { unstable_rethrow } from "next/navigation";
import { sql } from "@/lib/db";
import { requireAuthUser } from "@/lib/auth/session";
import { DEFAULT_SPACES, DEFAULT_DOCUMENTS } from "@/lib/workspace";
import { getUserDailyUsage } from "@/lib/quotas";

export async function GET() {
  await connection();

  try {
    const authCheck = await requireAuthUser();
    if (authCheck.errorResponse) {
      return authCheck.errorResponse;
    }
    const { user } = authCheck;

    // Fetch user profile or initialize it
    await sql`
      INSERT INTO profiles (id, user_id, email, name)
      VALUES (${user.id}, ${user.id}, ${user.email}, ${user.name || null})
      ON CONFLICT (user_id) DO UPDATE
      SET last_active_date = CURRENT_DATE,
          updated_at = NOW();
    `;

    const spacesResult = await sql`
      SELECT id, title, count, bg_gradient as "bgGradient", description
      FROM spaces
      WHERE user_id = ${user.id}
      ORDER BY created_at ASC
    `;

    const documentsResult = await sql`
      SELECT id, title, type, space, date, pages_or_duration as "pagesOrDuration",
             summary_text as "summaryText", file_url as "fileUrl", status, failure_reason as "failureReason"
      FROM documents
      WHERE user_id = ${user.id}
      ORDER BY created_at DESC
    `;

    // If new user, seed default starter space & documents owned by this user
    if (spacesResult.length === 0) {
      for (const space of DEFAULT_SPACES) {
        const spaceId = `${space.id}-${user.id.slice(0, 8)}`;
        await sql`
          INSERT INTO spaces (id, user_id, title, count, bg_gradient, description)
          VALUES (${spaceId}, ${user.id}, ${space.title}, ${space.count}, ${space.bgGradient}, ${space.description})
          ON CONFLICT (id) DO NOTHING
        `;
      }
    }

    if (documentsResult.length === 0) {
      for (const doc of DEFAULT_DOCUMENTS) {
        const docId = `${doc.id}-${user.id.slice(0, 8)}`;
        await sql`
          INSERT INTO documents (id, user_id, title, type, space, date, pages_or_duration, summary_text, status)
          VALUES (${docId}, ${user.id}, ${doc.title}, ${doc.type}, ${doc.space}, ${doc.date}, ${doc.pagesOrDuration}, ${doc.summaryText}, 'ready')
          ON CONFLICT (id) DO NOTHING
        `;

        // Also seed initial chunk for grounding demo
        await sql`
          INSERT INTO document_chunks (id, document_id, user_id, page_number, chunk_index, content)
          VALUES (${`chunk-${docId}-1`}, ${docId}, ${user.id}, 1, 0, ${doc.summaryText})
          ON CONFLICT (id) DO NOTHING
        `;
      }
    }

    const finalSpaces =
      spacesResult.length > 0
        ? spacesResult
        : await sql`
            SELECT id, title, count, bg_gradient as "bgGradient", description
            FROM spaces
            WHERE user_id = ${user.id}
            ORDER BY created_at ASC
          `;

    const finalDocs =
      documentsResult.length > 0
        ? documentsResult
        : await sql`
            SELECT id, title, type, space, date, pages_or_duration as "pagesOrDuration",
                   summary_text as "summaryText", file_url as "fileUrl", status, failure_reason as "failureReason"
            FROM documents
            WHERE user_id = ${user.id}
            ORDER BY created_at DESC
          `;

    const usage = await getUserDailyUsage(user.id);

    return NextResponse.json({
      spaces: finalSpaces,
      documents: finalDocs,
      usage,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    unstable_rethrow(error);
    console.error("Workspace GET error:", error);
    return NextResponse.json({ error: "Failed to load workspace data securely." }, { status: 500 });
  }
}
