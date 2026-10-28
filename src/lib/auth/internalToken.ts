import crypto from "crypto";

function getInternalSecret(): string {
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
