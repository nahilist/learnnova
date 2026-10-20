import crypto from "crypto";

export function getInternalSecret(): string {
  return (
    process.env.LEARNNOVA_BACKEND_SECRET ||
    process.env.NEON_AUTH_COOKIE_SECRET ||
    "learnnova-secure-backend-shared-secret-dev"
  );
}

/**
 * Generates HMAC signature and timestamp headers for Next.js -> FastAPI communication.
 */
export function createInternalBackendHeaders(
  userId: string,
  email?: string
): Record<string, string> {
  const timestamp = Math.floor(Date.now() / 1000);
  const secret = getInternalSecret();
  const payload = `${userId}:${timestamp}`;
  const signature = crypto.createHmac("sha256", secret).update(payload).digest("hex");

  return {
    "X-User-Id": userId,
    "X-User-Email": email || "",
    "X-Timestamp": timestamp.toString(),
    "X-Signature": signature,
  };
}

/**
 * Validates HMAC signature and timestamp.
 */
export function verifyInternalBackendSignature(
  userId: string,
  timestampStr: string,
  signature: string,
  maxAgeSeconds = 300
): boolean {
  try {
    const timestamp = parseInt(timestampStr, 10);
    const now = Math.floor(Date.now() / 1000);
    if (isNaN(timestamp) || Math.abs(now - timestamp) > maxAgeSeconds) {
      return false;
    }

    const secret = getInternalSecret();
    const payload = `${userId}:${timestamp}`;
    const expectedSig = crypto.createHmac("sha256", secret).update(payload).digest("hex");

    return crypto.timingSafeEqual(Buffer.from(signature, "hex"), Buffer.from(expectedSig, "hex"));
  } catch {
    return false;
  }
}
