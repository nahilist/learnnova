import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

describe("LearnNova Production Route & Asset Validation", () => {
  const rootDir = process.cwd();

  const requiredPages = [
    "src/app/page.tsx",
    "src/app/app/page.tsx",
    "src/app/pricing/page.tsx",
    "src/app/signin/page.tsx",
    "src/app/blogs/page.tsx",
    "src/app/careers/page.tsx",
    "src/app/youtube-summarizer/page.tsx",
    "src/app/terms-conditions/page.tsx",
    "src/app/privacy-policy/page.tsx",
  ];

  it("should have all 9 primary route entry points defined", () => {
    for (const pagePath of requiredPages) {
      const fullPath = path.join(rootDir, pagePath);
      assert.ok(
        fs.existsSync(fullPath),
        `Route file missing: ${pagePath}`
      );
      const content = fs.readFileSync(fullPath, "utf-8");
      assert.ok(
        content.includes("export default"),
        `Route file ${pagePath} must export a default React component`
      );
    }
  });

  it("should have standard LearnNova brand assets and logos defined", () => {
    const iconsPath = path.join(rootDir, "src/components/Icons.tsx");
    assert.ok(fs.existsSync(iconsPath), "Icons.tsx missing");
    const iconsContent = fs.readFileSync(iconsPath, "utf-8");
    assert.ok(iconsContent.includes("LearnNovaLogo"), "LearnNovaLogo missing from Icons.tsx");
  });

  it("should have standalone output configured in next.config.ts for Docker deployment", () => {
    const configPath = path.join(rootDir, "next.config.ts");
    assert.ok(fs.existsSync(configPath), "next.config.ts missing");
    const configContent = fs.readFileSync(configPath, "utf-8");
    assert.ok(
      configContent.includes('output: "standalone"') || configContent.includes("output: 'standalone'"),
      "next.config.ts must have output: 'standalone' for containerized deployments"
    );
  });

  it("should have Neon authentication configuration and a protected workspace", () => {
    const authClientPath = path.join(rootDir, "src/lib/auth/client.ts");
    const authServerPath = path.join(rootDir, "src/lib/auth/server.ts");
    const authGuardPath = path.join(rootDir, "src/components/AuthGuard.tsx");
    const appLayoutPath = path.join(rootDir, "src/app/app/layout.tsx");
    const envExamplePath = path.join(rootDir, ".env.example");

    assert.ok(fs.existsSync(authClientPath), "Neon auth client configuration is missing");
    assert.ok(fs.existsSync(authServerPath), "Neon auth server configuration is missing");
    assert.ok(fs.existsSync(authGuardPath), "AuthGuard is missing");
    assert.ok(fs.existsSync(appLayoutPath), "Protected app layout is missing");
    assert.ok(fs.existsSync(envExamplePath), ".env.example is missing");

    const appLayout = fs.readFileSync(appLayoutPath, "utf-8");
    const envExample = fs.readFileSync(envExamplePath, "utf-8");
    assert.ok(appLayout.includes("AuthGuard"), "The workspace must be wrapped in AuthGuard");
    assert.ok(envExample.includes("DATABASE_URL"), "DATABASE_URL is undocumented in .env.example");
    assert.ok(envExample.includes("NEON_AUTH_BASE_URL"), "NEON_AUTH_BASE_URL is undocumented in .env.example");
  });

  it("should have Neon Lakebase Postgres, Object Storage, and secure backend proxy integration", () => {
    const workspacePath = path.join(rootDir, "src/lib/workspace.ts");
    const dbPath = path.join(rootDir, "src/lib/db.ts");
    const storagePath = path.join(rootDir, "src/lib/storage.ts");
    const neonConfigPath = path.join(rootDir, "neon.ts");
    const backendProxyPath = path.join(rootDir, "src/app/api/backend/[...path]/route.ts");
    const notesApiPath = path.join(rootDir, "src/app/api/notes/route.ts");
    const flashcardsApiPath = path.join(rootDir, "src/app/api/flashcards/route.ts");

    assert.ok(fs.existsSync(workspacePath), "Workspace data layer is missing");
    assert.ok(fs.existsSync(dbPath), "Neon Postgres db client is missing");
    assert.ok(fs.existsSync(storagePath), "Neon Object Storage client is missing");
    assert.ok(fs.existsSync(neonConfigPath), "neon.ts config is missing");
    assert.ok(fs.existsSync(backendProxyPath), "Secure backend proxy route handler is missing");
    assert.ok(fs.existsSync(notesApiPath), "Notes persistence API route is missing");
    assert.ok(fs.existsSync(flashcardsApiPath), "Flashcards persistence API route is missing");

    const workspace = fs.readFileSync(workspacePath, "utf-8");
    assert.ok(workspace.includes("fetchUserWorkspace"), "User workspace fetch is missing");
    assert.ok(workspace.includes("createDocument"), "Document creation is missing");
  });
});
