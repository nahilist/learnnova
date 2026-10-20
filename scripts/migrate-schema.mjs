import { neon } from "@neondatabase/serverless";
import fs from "fs";
import path from "path";

// Load environment variables from .env.local
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

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is not set!");
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);

async function runMigration() {
  console.log("Starting LearnNova PostgreSQL Schema Migration on Neon...");

  // 1. Profiles & Preferences
  await sql`
    CREATE TABLE IF NOT EXISTS profiles (
      id VARCHAR(128) PRIMARY KEY,
      user_id VARCHAR(128) UNIQUE NOT NULL,
      email VARCHAR(255),
      name VARCHAR(255),
      study_streak INTEGER DEFAULT 1,
      daily_questions_count INTEGER DEFAULT 0,
      daily_uploads_count INTEGER DEFAULT 0,
      last_active_date DATE DEFAULT CURRENT_DATE,
      preferences JSONB DEFAULT '{}'::jsonb,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;
  await sql`CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);`;

  // 2. Spaces (Extend existing table safely)
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
  await sql`ALTER TABLE spaces ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();`;
  await sql`CREATE INDEX IF NOT EXISTS idx_spaces_user_id ON spaces(user_id);`;

  // 3. Documents (Extend existing table safely)
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
  await sql`ALTER TABLE documents ADD COLUMN IF NOT EXISTS space_id VARCHAR(128);`;
  await sql`ALTER TABLE documents ADD COLUMN IF NOT EXISTS storage_key VARCHAR(512);`;
  await sql`ALTER TABLE documents ADD COLUMN IF NOT EXISTS char_count INTEGER DEFAULT 0;`;
  await sql`ALTER TABLE documents ADD COLUMN IF NOT EXISTS page_count INTEGER DEFAULT 1;`;
  await sql`ALTER TABLE documents ADD COLUMN IF NOT EXISTS status VARCHAR(32) DEFAULT 'ready';`;
  await sql`ALTER TABLE documents ADD COLUMN IF NOT EXISTS failure_reason TEXT;`;
  await sql`ALTER TABLE documents ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();`;
  await sql`CREATE INDEX IF NOT EXISTS idx_documents_user_id ON documents(user_id);`;
  await sql`CREATE INDEX IF NOT EXISTS idx_documents_status ON documents(status);`;

  // 4. Processing Jobs (Durable async worker queue)
  await sql`
    CREATE TABLE IF NOT EXISTS processing_jobs (
      id VARCHAR(128) PRIMARY KEY,
      user_id VARCHAR(128) NOT NULL,
      document_id VARCHAR(128) REFERENCES documents(id) ON DELETE CASCADE,
      status VARCHAR(32) NOT NULL DEFAULT 'queued',
      progress INTEGER DEFAULT 0,
      error_code VARCHAR(64),
      error_message TEXT,
      retries INTEGER DEFAULT 0,
      started_at TIMESTAMPTZ,
      completed_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;
  await sql`CREATE INDEX IF NOT EXISTS idx_jobs_user_id ON processing_jobs(user_id);`;
  await sql`CREATE INDEX IF NOT EXISTS idx_jobs_status ON processing_jobs(status);`;

  // 5. Document Chunks for Retrieval & Grounding
  await sql`
    CREATE TABLE IF NOT EXISTS document_chunks (
      id VARCHAR(128) PRIMARY KEY,
      document_id VARCHAR(128) NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
      user_id VARCHAR(128) NOT NULL,
      page_number INTEGER DEFAULT 1,
      chunk_index INTEGER NOT NULL,
      content TEXT NOT NULL,
      token_count INTEGER DEFAULT 0,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;
  await sql`CREATE INDEX IF NOT EXISTS idx_chunks_doc_id ON document_chunks(document_id);`;
  await sql`CREATE INDEX IF NOT EXISTS idx_chunks_user_doc ON document_chunks(user_id, document_id);`;

  // 6. Chats & Messages
  await sql`
    CREATE TABLE IF NOT EXISTS chats (
      id VARCHAR(128) PRIMARY KEY,
      user_id VARCHAR(128) NOT NULL,
      document_id VARCHAR(128) REFERENCES documents(id) ON DELETE CASCADE,
      title VARCHAR(255) NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;
  await sql`CREATE INDEX IF NOT EXISTS idx_chats_user_id ON chats(user_id);`;
  await sql`CREATE INDEX IF NOT EXISTS idx_chats_doc_id ON chats(document_id);`;

  await sql`
    CREATE TABLE IF NOT EXISTS messages (
      id VARCHAR(128) PRIMARY KEY,
      chat_id VARCHAR(128) NOT NULL REFERENCES chats(id) ON DELETE CASCADE,
      user_id VARCHAR(128) NOT NULL,
      sender VARCHAR(32) NOT NULL,
      content TEXT NOT NULL,
      citations JSONB DEFAULT '[]'::jsonb,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;
  await sql`CREATE INDEX IF NOT EXISTS idx_messages_chat_id ON messages(chat_id);`;

  // 7. Summaries & Notes
  await sql`
    CREATE TABLE IF NOT EXISTS summaries (
      id VARCHAR(128) PRIMARY KEY,
      document_id VARCHAR(128) NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
      user_id VARCHAR(128) NOT NULL,
      overview TEXT NOT NULL,
      key_ideas JSONB DEFAULT '[]'::jsonb,
      definitions JSONB DEFAULT '[]'::jsonb,
      headings JSONB DEFAULT '[]'::jsonb,
      detail_level VARCHAR(32) DEFAULT 'standard',
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;
  await sql`CREATE INDEX IF NOT EXISTS idx_summaries_doc_id ON summaries(document_id);`;

  await sql`
    CREATE TABLE IF NOT EXISTS notes (
      id VARCHAR(128) PRIMARY KEY,
      document_id VARCHAR(128) REFERENCES documents(id) ON DELETE CASCADE,
      user_id VARCHAR(128) NOT NULL,
      title VARCHAR(255) NOT NULL,
      content TEXT NOT NULL,
      source_refs JSONB DEFAULT '[]'::jsonb,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;
  await sql`CREATE INDEX IF NOT EXISTS idx_notes_user_doc ON notes(user_id, document_id);`;

  // 8. Quizzes, Questions & Attempts
  await sql`
    CREATE TABLE IF NOT EXISTS quizzes (
      id VARCHAR(128) PRIMARY KEY,
      document_id VARCHAR(128) REFERENCES documents(id) ON DELETE CASCADE,
      user_id VARCHAR(128) NOT NULL,
      title VARCHAR(255) NOT NULL,
      difficulty VARCHAR(32) DEFAULT 'medium',
      question_count INTEGER DEFAULT 4,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;
  await sql`CREATE INDEX IF NOT EXISTS idx_quizzes_doc_id ON quizzes(document_id);`;

  await sql`
    CREATE TABLE IF NOT EXISTS quiz_questions (
      id VARCHAR(128) PRIMARY KEY,
      quiz_id VARCHAR(128) NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
      question_index INTEGER NOT NULL,
      question TEXT NOT NULL,
      options JSONB NOT NULL,
      correct_index INTEGER NOT NULL,
      explanation TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;
  await sql`CREATE INDEX IF NOT EXISTS idx_quiz_q_quiz_id ON quiz_questions(quiz_id);`;

  await sql`
    CREATE TABLE IF NOT EXISTS quiz_attempts (
      id VARCHAR(128) PRIMARY KEY,
      quiz_id VARCHAR(128) NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
      user_id VARCHAR(128) NOT NULL,
      submitted_answers JSONB NOT NULL,
      score INTEGER NOT NULL,
      total_questions INTEGER NOT NULL,
      percentage NUMERIC(5,2) NOT NULL,
      completed_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;
  await sql`CREATE INDEX IF NOT EXISTS idx_attempts_quiz_user ON quiz_attempts(quiz_id, user_id);`;

  // 9. Flashcard Sets & Cards
  await sql`
    CREATE TABLE IF NOT EXISTS flashcard_sets (
      id VARCHAR(128) PRIMARY KEY,
      document_id VARCHAR(128) REFERENCES documents(id) ON DELETE CASCADE,
      user_id VARCHAR(128) NOT NULL,
      title VARCHAR(255) NOT NULL,
      card_count INTEGER DEFAULT 0,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;
  await sql`CREATE INDEX IF NOT EXISTS idx_fc_sets_doc_id ON flashcard_sets(document_id);`;

  await sql`
    CREATE TABLE IF NOT EXISTS flashcards (
      id VARCHAR(128) PRIMARY KEY,
      set_id VARCHAR(128) NOT NULL REFERENCES flashcard_sets(id) ON DELETE CASCADE,
      document_id VARCHAR(128) REFERENCES documents(id) ON DELETE CASCADE,
      user_id VARCHAR(128) NOT NULL,
      front TEXT NOT NULL,
      back TEXT NOT NULL,
      source_ref TEXT,
      mastery INTEGER DEFAULT 0,
      review_count INTEGER DEFAULT 0,
      next_review_at TIMESTAMPTZ DEFAULT NOW(),
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;
  await sql`CREATE INDEX IF NOT EXISTS idx_flashcards_set_id ON flashcards(set_id);`;
  await sql`CREATE INDEX IF NOT EXISTS idx_flashcards_user_doc ON flashcards(user_id, document_id);`;

  await sql`
    CREATE TABLE IF NOT EXISTS flashcard_reviews (
      id VARCHAR(128) PRIMARY KEY,
      flashcard_id VARCHAR(128) NOT NULL REFERENCES flashcards(id) ON DELETE CASCADE,
      user_id VARCHAR(128) NOT NULL,
      known BOOLEAN NOT NULL,
      reviewed_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;
  await sql`CREATE INDEX IF NOT EXISTS idx_fc_reviews_card_id ON flashcard_reviews(flashcard_id);`;

  // 10. Usage Quotas & Limits
  await sql`
    CREATE TABLE IF NOT EXISTS usage_counters (
      id VARCHAR(128) PRIMARY KEY,
      user_id VARCHAR(128) NOT NULL,
      date DATE NOT NULL,
      ai_questions_count INTEGER DEFAULT 0,
      uploads_count INTEGER DEFAULT 0,
      storage_bytes BIGINT DEFAULT 0,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      CONSTRAINT unique_user_date UNIQUE (user_id, date)
    );
  `;
  await sql`CREATE INDEX IF NOT EXISTS idx_usage_user_date ON usage_counters(user_id, date);`;

  const tables = await sql`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public'
    ORDER BY table_name;
  `;
  console.log("Migration finished! Public tables in Neon Postgres:", tables.map(t => t.table_name));
}

runMigration().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
