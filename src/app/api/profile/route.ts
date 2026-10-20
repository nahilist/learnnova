import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { requireAuthUser } from "@/lib/auth/session";
import { getUserDailyUsage } from "@/lib/quotas";

export async function GET() {
  try {
    const authCheck = await requireAuthUser();
    if (authCheck.errorResponse) {
      return authCheck.errorResponse;
    }
    const { user } = authCheck;

    const rows = await sql`
      SELECT id, email, name, study_streak as "studyStreak", preferences, created_at as "createdAt"
      FROM profiles
      WHERE user_id = ${user.id}
    `;

    const usage = await getUserDailyUsage(user.id);

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      profile: rows[0] || {
        studyStreak: 1,
        preferences: {},
      },
      usage,
    });
  } catch (error) {
    console.error("Profile GET error:", error);
    return NextResponse.json({ error: "Failed to load profile" }, { status: 500 });
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
    const { preferences } = body;

    const prefJson = JSON.stringify(preferences || {});
    await sql`
      UPDATE profiles
      SET preferences = ${prefJson}::jsonb, updated_at = NOW()
      WHERE user_id = ${user.id}
    `;

    return NextResponse.json({ success: true, preferences });
  } catch (error) {
    console.error("Profile POST error:", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
