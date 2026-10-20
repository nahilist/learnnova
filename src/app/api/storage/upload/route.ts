import { NextRequest, NextResponse } from "next/server";
import { storage } from "@/lib/storage";
import { requireAuthUser } from "@/lib/auth/session";
import { checkAndIncrementUploadQuota, QUOTA_LIMITS } from "@/lib/quotas";

const ALLOWED_MIME_TYPES = new Set([
  "application/pdf",
  "text/plain",
  "text/markdown",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "audio/mpeg",
  "audio/mp3",
  "audio/wav",
  "video/mp4",
  "application/octet-stream",
]);

export async function POST(request: NextRequest) {
  try {
    const authCheck = await requireAuthUser();
    if (authCheck.errorResponse) {
      return authCheck.errorResponse;
    }
    const { user } = authCheck;

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided in form data." }, { status: 400 });
    }

    // 1. File size check
    if (file.size > QUOTA_LIMITS.MAX_FILE_BYTES) {
      return NextResponse.json(
        {
          error: `File exceeds maximum allowed size of 10 MB (${(file.size / (1024 * 1024)).toFixed(1)} MB uploaded).`,
        },
        { status: 413 }
      );
    }

    // 2. MIME type check
    const fileType = file.type || "application/octet-stream";
    const fileExt = file.name.split(".").pop()?.toLowerCase();
    const isAllowedExt = ["pdf", "txt", "md", "docx", "mp3", "mp4"].includes(fileExt || "");

    if (!ALLOWED_MIME_TYPES.has(fileType) && !isAllowedExt) {
      return NextResponse.json(
        { error: "Unsupported file type. Supported formats: PDF, DOCX, TXT, Markdown, MP3, MP4." },
        { status: 415 }
      );
    }

    // 3. User quota check & increment
    const quota = await checkAndIncrementUploadQuota(user.id, file.size);
    if (!quota.allowed) {
      return NextResponse.json(
        { error: `Upload quota exceeded: ${quota.resetMessage}` },
        { status: 429 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Random safe storage key partitioned by user.id
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const key = `uploads/${user.id}/${Date.now()}-${safeName}`;

    await storage.upload(key, buffer, {
      contentType: fileType,
    });

    let fileUrl = "";
    try {
      fileUrl = await storage.url(key, { expiresIn: 86400 }); // 24 hours signed URL
    } catch {
      fileUrl = `/api/storage/download?key=${encodeURIComponent(key)}`;
    }

    return NextResponse.json({
      success: true,
      key,
      url: fileUrl,
      name: file.name,
      size: file.size,
      type: fileType,
      quotaRemaining: quota.remaining,
    });
  } catch (error) {
    console.error("Storage upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload file to Neon Object Storage securely." },
      { status: 500 }
    );
  }
}
