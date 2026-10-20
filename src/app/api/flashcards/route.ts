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

    const cards = await sql`
      SELECT id, front, back, source_ref as "sourceRef", mastery, review_count as "reviewCount"
      FROM flashcards
      WHERE user_id = ${user.id} AND document_id = ${documentId}
      ORDER BY id ASC
    `;

    return NextResponse.json({ flashcards: cards });
  } catch (error) {
    console.error("Flashcards GET error:", error);
    return NextResponse.json({ error: "Failed to load flashcards" }, { status: 500 });
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
    const { action, documentId, cardId, known, flashcards } = body;

    // Action 1: Record card review
    if (action === "review" && cardId) {
      const isKnown = Boolean(known);
      const masteryVal = isKnown ? 2 : 1;

      await sql`
        UPDATE flashcards
        SET mastery = ${masteryVal},
            review_count = review_count + 1,
            next_review_at = NOW() + (${isKnown ? "3 days" : "1 day"}::interval)
        WHERE id = ${cardId} AND user_id = ${user.id};
      `;

      await sql`
        INSERT INTO flashcard_reviews (id, flashcard_id, user_id, known)
        VALUES (${`rev-${Date.now()}`}, ${cardId}, ${user.id}, ${isKnown});
      `;

      return NextResponse.json({ success: true, cardId, known: isKnown });
    }

    // Action 2: Save deck of flashcards for document
    if (action === "save_deck" && documentId && Array.isArray(flashcards)) {
      const setId = `set-${documentId}-${user.id.slice(0, 8)}`;
      await sql`
        INSERT INTO flashcard_sets (id, document_id, user_id, title, card_count)
        VALUES (${setId}, ${documentId}, ${user.id}, ${"Study Flashcards"}, ${flashcards.length})
        ON CONFLICT (id) DO UPDATE SET card_count = EXCLUDED.card_count;
      `;

      for (let i = 0; i < flashcards.length; i++) {
        const fc = flashcards[i];
        const fcId = `fc-${documentId}-${i + 1}`;
        await sql`
          INSERT INTO flashcards (id, set_id, document_id, user_id, front, back, source_ref, mastery)
          VALUES (
            ${fcId},
            ${setId},
            ${documentId},
            ${user.id},
            ${fc.front},
            ${fc.back},
            ${fc.sourceRef || null},
            ${fc.mastery || 0}
          )
          ON CONFLICT (id) DO UPDATE SET
            front = EXCLUDED.front,
            back = EXCLUDED.back,
            source_ref = EXCLUDED.source_ref;
        `;
      }

      return NextResponse.json({ success: true, count: flashcards.length });
    }

    return NextResponse.json({ error: "Invalid action or parameters" }, { status: 400 });
  } catch (error) {
    console.error("Flashcards POST error:", error);
    return NextResponse.json({ error: "Failed to update flashcards" }, { status: 500 });
  }
}
