# LearnNova

LearnNova is a Next.js AI learning workspace powered by Neon (Lakebase Postgres, Neon Auth, and Neon Object Storage).

## Neon Architecture

LearnNova uses Neon's cloud primitives:
1. **Lakebase Postgres**: Serverless PostgreSQL database storing users' study spaces and documents.
2. **Neon Auth**: Managed Better Auth providing secure authentication (Email/Password and Social OAuth) connected to Postgres.
3. **Neon Object Storage**: S3-compatible file storage for textbook uploads, PDF notes, and lecture audio recordings.

## Getting Started

1. Set up your Neon environment variables in `.env.local` (automatically pulled by `neon deploy`).
2. Run database initialization:
```bash
node scripts/init-db.mjs
```
3. Start the Next.js development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser. The `/app` route protects workspace features with Neon Auth.
