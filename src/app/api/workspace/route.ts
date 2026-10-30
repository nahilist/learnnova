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

    // If brand-new user with NO spaces, seed default starter space & documents
    let finalSpaces = spacesResult;
    let finalDocs = documentsResult;

    if (spacesResult.length === 0) {
      const spaceTitle = user.name ? `${user.name}'s Workspace` : "Personal Workspace";
      const spaceId = `personal-space-${user.id.slice(0, 8)}`;
      await sql`
        INSERT INTO spaces (id, user_id, title, count, bg_gradient, description)
        VALUES (${spaceId}, ${user.id}, ${spaceTitle}, 0, 'from-neutral-200 via-neutral-100 to-stone-200', 'Personal study workspace, lectures, flashcards, and notes.')
        ON CONFLICT (id) DO NOTHING
      `;

      finalSpaces = await sql`
        SELECT id, title, count, bg_gradient as "bgGradient", description
        FROM spaces
        WHERE user_id = ${user.id}
        ORDER BY created_at ASC
      `;

      finalDocs = [];
    }

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
