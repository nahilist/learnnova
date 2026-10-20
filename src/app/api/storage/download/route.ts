import { NextRequest, NextResponse } from "next/server";
import { storage } from "@/lib/storage";
import { requireAuthUser } from "@/lib/auth/session";

export async function GET(request: NextRequest) {
  try {
    const authCheck = await requireAuthUser();
    if (authCheck.errorResponse) {
      return authCheck.errorResponse;
    }
    const { user } = authCheck;

    const { searchParams } = new URL(request.url);
    const key = searchParams.get("key");

    if (!key) {
      return NextResponse.json({ error: "key parameter is required" }, { status: 400 });
    }

    // Verify ownership: Key must start with uploads/<user.id>/ or be public demo asset
    const isOwnerKey = key.startsWith(`uploads/${user.id}/`);
    const isDemoAsset = key.startsWith("demo/") || key.startsWith("public/");

    if (!isOwnerKey && !isDemoAsset) {
      return NextResponse.json(
        { error: "Forbidden: You do not have permission to access this file." },
        { status: 403 }
      );
    }

    const exists = await storage.exists(key);
    if (!exists) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    const file = await storage.download(key);
    const buffer = await file.arrayBuffer();

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": file.type || "application/octet-stream",
        "Content-Disposition": `inline; filename="${key.split("/").pop()}"`,
        "Cache-Control": "private, max-age=3600",
      },
    });
  } catch (error) {
    if ((error as { digest?: string })?.digest?.startsWith?.("NEXT_")) {
      throw error;
    }
    console.error("Storage download error:", error);
    return NextResponse.json(
      { error: "Failed to download file from storage." },
      { status: 500 }
    );
  }
}
