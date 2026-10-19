import { NextRequest, NextResponse } from "next/server";
import { storage } from "@/lib/storage";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const key = `uploads/${Date.now()}-${safeName}`;

    await storage.upload(key, buffer, {
      contentType: file.type || "application/octet-stream",
    });

    // Generate URL or presigned URL
    let fileUrl = "";
    try {
      fileUrl = await storage.url(key, { expiresIn: 86400 }); // 24 hours
    } catch {
      fileUrl = `/api/storage/download?key=${encodeURIComponent(key)}`;
    }

    return NextResponse.json({
      success: true,
      key,
      url: fileUrl,
      name: file.name,
      size: file.size,
      type: file.type,
    });
  } catch (error) {
    console.error("Storage upload error:", error);
    return NextResponse.json({ error: "Failed to upload file to Neon Object Storage" }, { status: 500 });
  }
}

