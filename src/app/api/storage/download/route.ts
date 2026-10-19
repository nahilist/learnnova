import { NextRequest, NextResponse } from "next/server";
import { storage } from "@/lib/storage";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get("key");

    if (!key) {
      return NextResponse.json({ error: "key parameter is required" }, { status: 400 });
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
      },
    });
  } catch (error) {
    if ((error as { digest?: string })?.digest?.startsWith?.("NEXT_")) {
      throw error;
    }
    console.error("Storage download error:", error);
    return NextResponse.json({ error: "Failed to download file from Neon Object Storage" }, { status: 500 });
  }
}
