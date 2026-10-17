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

  it("should have standard brand assets and icons defined", () => {
    const iconsPath = path.join(rootDir, "src/components/Icons.tsx");
    assert.ok(fs.existsSync(iconsPath), "Icons.tsx missing");
    const iconsContent = fs.readFileSync(iconsPath, "utf-8");
    assert.ok(iconsContent.includes("LearnNovaLogo"), "LearnNovaLogo missing from Icons.tsx");
    assert.ok(iconsContent.includes("StanfordSeal"), "StanfordSeal missing from Icons.tsx");
    assert.ok(iconsContent.includes("HarvardSeal"), "HarvardSeal missing from Icons.tsx");
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

  it("should have Firebase authentication configuration and a protected workspace", () => {
    const firebaseClientPath = path.join(rootDir, "src/lib/firebase/client.ts");
    const authGuardPath = path.join(rootDir, "src/components/AuthGuard.tsx");
    const appLayoutPath = path.join(rootDir, "src/app/app/layout.tsx");
    const envExamplePath = path.join(rootDir, ".env.example");

    assert.ok(fs.existsSync(firebaseClientPath), "Firebase client configuration is missing");
    assert.ok(fs.existsSync(authGuardPath), "AuthGuard is missing");
    assert.ok(fs.existsSync(appLayoutPath), "Protected app layout is missing");
    assert.ok(fs.existsSync(envExamplePath), ".env.example is missing");

    const appLayout = fs.readFileSync(appLayoutPath, "utf-8");
    const envExample = fs.readFileSync(envExamplePath, "utf-8");
    assert.ok(appLayout.includes("AuthGuard"), "The workspace must be wrapped in AuthGuard");
    assert.ok(envExample.includes("NEXT_PUBLIC_FIREBASE_API_KEY"), "Firebase API key variable is undocumented");
  });
<<<<<<< HEAD

  it("should persist each authenticated user's workspace with owner-only Firestore rules", () => {
    const workspacePath = path.join(rootDir, "src/lib/firebase/workspace.ts");
    const rulesPath = path.join(rootDir, "firestore.rules");

    assert.ok(fs.existsSync(workspacePath), "Firestore workspace data layer is missing");
    assert.ok(fs.existsSync(rulesPath), "Firestore security rules are missing");

    const workspace = fs.readFileSync(workspacePath, "utf-8");
    const rules = fs.readFileSync(rulesPath, "utf-8");
    assert.ok(workspace.includes("initializeUserWorkspace"), "User profile initialization is missing");
    assert.ok(workspace.includes("subscribeToDocuments"), "Realtime document persistence is missing");
    assert.ok(rules.includes("request.auth.uid == userId"), "Firestore data must be restricted by user UID");
  });
=======
>>>>>>> 5d66da33deeec2530ed911f657e3f8b838d87124
});
