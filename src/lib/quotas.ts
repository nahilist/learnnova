import { sql } from "@/lib/db";

export const QUOTA_LIMITS = {
  MAX_DAILY_QUESTIONS: parseInt(process.env.MAX_DAILY_QUESTIONS || "20", 10),
  MAX_DAILY_UPLOADS: parseInt(process.env.MAX_DAILY_UPLOADS || "3", 10),
  MAX_FILE_BYTES: 10 * 1024 * 1024, // 10 MB default limit
  MAX_PDF_PAGES: 100,
};

export interface QuotaStatus {
  allowed: boolean;
  used: number;
  limit: number;
  remaining: number;
  resetMessage: string;
}

/**
 * Checks and increments the daily AI question counter for a user.
 */
export async function checkAndIncrementQuestionQuota(userId: string): Promise<QuotaStatus> {
  const today = new Date().toISOString().split("T")[0];

  // Upsert usage row for today
  await sql`
    INSERT INTO usage_counters (id, user_id, date, ai_questions_count, uploads_count)
    VALUES (${`${userId}_${today}`}, ${userId}, ${today}, 0, 0)
    ON CONFLICT (user_id, date) DO NOTHING;
  `;

  // Fetch current usage
  const rows = await sql`
    SELECT ai_questions_count FROM usage_counters
    WHERE user_id = ${userId} AND date = ${today}
  `;

  const used = rows.length > 0 ? (rows[0].ai_questions_count as number) : 0;
  const limit = QUOTA_LIMITS.MAX_DAILY_QUESTIONS;

  if (used >= limit) {
    return {
      allowed: false,
      used,
      limit,
      remaining: 0,
      resetMessage: "You have reached your daily limit of 20 AI questions. Quota resets at midnight UTC.",
    };
  }

  // Increment counter
  await sql`
    UPDATE usage_counters
    SET ai_questions_count = ai_questions_count + 1
    WHERE user_id = ${userId} AND date = ${today}
  `;

  return {
    allowed: true,
    used: used + 1,
    limit,
    remaining: Math.max(0, limit - (used + 1)),
    resetMessage: "Quota resets at midnight UTC.",
  };
}

/**
 * Checks and increments the daily upload counter for a user.
 */
export async function checkAndIncrementUploadQuota(
  userId: string,
  fileSizeBytes: number
): Promise<QuotaStatus> {
  const today = new Date().toISOString().split("T")[0];

  if (fileSizeBytes > QUOTA_LIMITS.MAX_FILE_BYTES) {
    return {
      allowed: false,
      used: 0,
      limit: QUOTA_LIMITS.MAX_DAILY_UPLOADS,
      remaining: 0,
      resetMessage: `File exceeds maximum allowed size of 10 MB (${(fileSizeBytes / (1024 * 1024)).toFixed(1)} MB uploaded).`,
    };
  }

  await sql`
    INSERT INTO usage_counters (id, user_id, date, ai_questions_count, uploads_count, storage_bytes)
    VALUES (${`${userId}_${today}`}, ${userId}, ${today}, 0, 0, 0)
    ON CONFLICT (user_id, date) DO NOTHING;
  `;

  const rows = await sql`
    SELECT uploads_count FROM usage_counters
    WHERE user_id = ${userId} AND date = ${today}
  `;

  const used = rows.length > 0 ? (rows[0].uploads_count as number) : 0;
  const limit = QUOTA_LIMITS.MAX_DAILY_UPLOADS;

  if (used >= limit) {
    return {
      allowed: false,
      used,
      limit,
      remaining: 0,
      resetMessage: "You have reached your daily limit of 3 uploads. Quota resets at midnight UTC.",
    };
  }

  await sql`
    UPDATE usage_counters
    SET uploads_count = uploads_count + 1,
        storage_bytes = storage_bytes + ${fileSizeBytes}
    WHERE user_id = ${userId} AND date = ${today}
  `;

  return {
    allowed: true,
    used: used + 1,
    limit,
    remaining: Math.max(0, limit - (used + 1)),
    resetMessage: "Quota resets at midnight UTC.",
  };
}

/**
 * Returns current usage summary for user.
 */
export async function getUserDailyUsage(userId: string): Promise<{
  questionsUsed: number;
  questionsLimit: number;
  uploadsUsed: number;
  uploadsLimit: number;
}> {
  const today = new Date().toISOString().split("T")[0];
  const rows = await sql`
    SELECT ai_questions_count, uploads_count
    FROM usage_counters
    WHERE user_id = ${userId} AND date = ${today}
  `;

  if (rows.length === 0) {
    return {
      questionsUsed: 0,
      questionsLimit: QUOTA_LIMITS.MAX_DAILY_QUESTIONS,
      uploadsUsed: 0,
      uploadsLimit: QUOTA_LIMITS.MAX_DAILY_UPLOADS,
    };
  }

  return {
    questionsUsed: rows[0].ai_questions_count as number,
    questionsLimit: QUOTA_LIMITS.MAX_DAILY_QUESTIONS,
    uploadsUsed: rows[0].uploads_count as number,
    uploadsLimit: QUOTA_LIMITS.MAX_DAILY_UPLOADS,
  };
}
