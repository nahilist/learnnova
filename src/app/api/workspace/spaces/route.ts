import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { requireAuthUser } from "@/lib/auth/session";
import { SpaceItem } from "@/lib/workspace";

export async function POST(request: NextRequest) {
  try {
    const authCheck = await requireAuthUser();
    if (authCheck.errorResponse) {
      return authCheck.errorResponse;
    }
    const { user } = authCheck;

    const body = await request.json();
    const space: SpaceItem = body.space || body;

    if (!space || !space.title) {
      return NextResponse.json({ error: "Space with title is required" }, { status: 400 });
    }

    const spaceId = space.id || `space-${Date.now()}`;
    const bgGradient = space.bgGradient || "from-slate-800 via-zinc-900 to-neutral-950";
    const description = space.description || `Study materials for ${space.title}`;
    const count = space.count || 0;

    await sql`
      INSERT INTO spaces (id, user_id, title, count, bg_gradient, description)
      VALUES (${spaceId}, ${user.id}, ${space.title}, ${count}, ${bgGradient}, ${description})
      ON CONFLICT (id) DO UPDATE SET
        title = EXCLUDED.title,
        bg_gradient = EXCLUDED.bg_gradient,
        description = EXCLUDED.description,
        updated_at = NOW()
      WHERE spaces.user_id = ${user.id};
    `;

    return NextResponse.json({
      ...space,
      id: spaceId,
      userId: user.id,
    });
  } catch (error) {
    console.error("Create space error:", error);
    return NextResponse.json({ error: "Failed to create space" }, { status: 500 });
  }
}
