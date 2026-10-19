import { neon } from "@neondatabase/serverless";
import fs from "fs";
import path from "path";

// Load .env.local
const envPath = path.resolve(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf-8");
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#") && trimmed.includes("=")) {
      const idx = trimmed.indexOf("=");
      const key = trimmed.slice(0, idx).trim();
      let val = trimmed.slice(idx + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      process.env[key] = val;
    }
  }
}

const sql = neon(process.env.DATABASE_URL);

async function main() {
  console.log("Connecting to Neon Postgres...");
  await sql`
    CREATE TABLE IF NOT EXISTS spaces (
      id VARCHAR(128) PRIMARY KEY,
      user_id VARCHAR(128) NOT NULL,
      title VARCHAR(255) NOT NULL,
      count INTEGER DEFAULT 0,
      bg_gradient VARCHAR(255) NOT NULL,
      description TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS documents (
      id VARCHAR(128) PRIMARY KEY,
      user_id VARCHAR(128) NOT NULL,
      title VARCHAR(255) NOT NULL,
      type VARCHAR(64) NOT NULL,
      space VARCHAR(255) NOT NULL,
      date VARCHAR(64) NOT NULL,
      pages_or_duration VARCHAR(64) NOT NULL,
      summary_text TEXT NOT NULL,
      file_url TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;
  const tables = await sql`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public';
  `;
  console.log("Successfully connected! Tables in public schema:", tables.map(t => t.table_name));
}

main().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});

