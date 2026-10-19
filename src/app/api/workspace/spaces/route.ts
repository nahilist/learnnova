
import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { SpaceItem } from "@/lib/workspace";

export async function POST(request: NextRequest) {
  try {
    const { userId, space }: { userId: string; space: SpaceItem } = await request.json();
    if (!userId || !space) {
      return NextResponse.json({ error: "userId and space are required" }, { status: 400 });
    }

    await sql`
      INSERT INTO spaces (id, user_id, title, count, bg_gradient, description)
      VALUES (${space.id}, ${userId}, ${space.title}, ${space.count}, ${space.bgGradient}, ${space.description})
      ON CONFLICT (id) DO UPDATE SET
        title = EXCLUDED.title,
        count = EXCLUDED.count,
        bg_gradient = EXCLUDED.bg_gradient,
        description = EXCLUDED.description
    `;

    return NextResponse.json(space);
  } catch (error) {
    console.error("Create space error:", error);
    return NextResponse.json({ error: "Failed to create space" }, { status: 500 });
  }
}
