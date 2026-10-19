const BASE_URL = "http://127.0.0.1:3000";

async function runTests() {
  console.log("==========================================");
  console.log("   LEARNNOVA NEON SERVICES E2E TEST       ");
  console.log("==========================================\n");

  const results = {
    pages: false,
    postgres: false,
    objectStorage: false,
    neonAuth: false,
  };

  // 1. Test Static & App Pages
  try {
    console.log("[1/4] Testing Frontend Routes...");
    const homeRes = await fetch(`${BASE_URL}/`);
    console.log(`- GET / : HTTP ${homeRes.status} (Home Landing Page)`);

    const signinRes = await fetch(`${BASE_URL}/signin`);
    console.log(`- GET /signin : HTTP ${signinRes.status} (Neon Auth SignIn Page)`);

    const appRes = await fetch(`${BASE_URL}/app`);
    console.log(`- GET /app : HTTP ${appRes.status} (Workspace Application Page)`);

    if (homeRes.ok && signinRes.ok && appRes.ok) {
      results.pages = true;
      console.log("=> Frontend Pages: PASSED\n");
    }
  } catch (err) {
    console.error("Frontend pages test failed:", err.message);
  }

  // 2. Test Neon Lakebase Postgres Service
  try {
    console.log("[2/4] Testing Neon Lakebase Postgres Service...");
    const testUserId = `user_${Date.now()}`;

    // Test GET /api/workspace
    const getWs = await fetch(`${BASE_URL}/api/workspace?userId=${testUserId}`);
    console.log(`- GET /api/workspace?userId=${testUserId} : HTTP ${getWs.status}`);
    const wsData = await getWs.json();
    console.log(`  Initialized spaces count: ${wsData.spaces?.length || 0}`);
    console.log(`  Initialized documents count: ${wsData.documents?.length || 0}`);

    // Test POST /api/workspace/spaces
    const spacePayload = {
      userId: testUserId,
      space: {
        id: `space_${Date.now()}`,
        title: "Quantum Computing & Neon",
        count: 5,
        bgGradient: "from-purple-800 to-indigo-900",
        description: "Study quantum algorithms and database branching.",
      },
    };
    const postSpace = await fetch(`${BASE_URL}/api/workspace/spaces`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(spacePayload),
    });
    console.log(`- POST /api/workspace/spaces : HTTP ${postSpace.status}`);
    const createdSpace = await postSpace.json();
    console.log(`  Created Space Title: "${createdSpace.title}"`);

    // Test POST /api/workspace/documents
    const docPayload = {
      userId: testUserId,
      document: {
        id: `doc_${Date.now()}`,
        title: "Neon Lakebase Architecture Notes",
        type: "pdf",
        space: createdSpace.title,
        date: "Today",
        pagesOrDuration: "12 pages",
        summaryText: "Storage decoupled from compute with copy-on-write branching.",
      },
    };
    const postDoc = await fetch(`${BASE_URL}/api/workspace/documents`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(docPayload),
    });
    console.log(`- POST /api/workspace/documents : HTTP ${postDoc.status}`);
    const createdDoc = await postDoc.json();
    console.log(`  Created Document: "${createdDoc.title}"`);

    // Verify persistence with another GET
    const verifyWs = await fetch(`${BASE_URL}/api/workspace?userId=${testUserId}`);
    const verifyData = await verifyWs.json();
    const foundDoc = verifyData.documents?.some(d => d.id === docPayload.document.id);
    console.log(`  Verified Document persisted in Postgres: ${foundDoc}`);

    if (getWs.ok && postSpace.ok && postDoc.ok && foundDoc) {
      results.postgres = true;
      console.log("=> Neon Lakebase Postgres Service: PASSED\n");
    }
  } catch (err) {
    console.error("Postgres service test failed:", err.message);
  }

  // 3. Test Neon Object Storage Service (S3)
  try {
    console.log("[3/4] Testing Neon Object Storage Service (Bucket: assets)...");
    const testFileName = `e2e-test-${Date.now()}.txt`;
    const fileContent = "This is a test upload to Neon Object Storage via LearnNova API.";
    const boundary = "----WebKitFormBoundary" + Math.random().toString(36).substring(2);

    const postBody = Buffer.concat([
      Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="${testFileName}"\r\nContent-Type: text/plain\r\n\r\n${fileContent}\r\n--${boundary}--\r\n`)
    ]);

    const uploadRes = await fetch(`${BASE_URL}/api/storage/upload`, {
      method: "POST",
      headers: {
        "Content-Type": `multipart/form-data; boundary=${boundary}`,
      },
      body: postBody,
    });

    console.log(`- POST /api/storage/upload : HTTP ${uploadRes.status}`);
    const uploadData = await uploadRes.json();
    console.log(`  Uploaded Object Key: "${uploadData.key}"`);
    console.log(`  Object URL: "${uploadData.url}"`);

    // Test downloading the uploaded object via /api/storage/download?key=...
    const downloadRes = await fetch(`${BASE_URL}/api/storage/download?key=${encodeURIComponent(uploadData.key)}`);
    console.log(`- GET /api/storage/download?key=${uploadData.key} : HTTP ${downloadRes.status}`);
    const downloadedText = await downloadRes.text();
    const matches = downloadedText === fileContent;
    console.log(`  Downloaded content matches uploaded text: ${matches}`);

    if (uploadRes.ok && downloadRes.ok && matches) {
      results.objectStorage = true;
      console.log("=> Neon Object Storage Service: PASSED\n");
    }
  } catch (err) {
    console.error("Object storage test failed:", err.message);
  }

  // 4. Test Neon Auth Service (Managed Better Auth)
  try {
    console.log("[4/4] Testing Neon Auth (Managed Better Auth Service)...");
    const authSessionRes = await fetch(`${BASE_URL}/api/auth/get-session`);
    console.log(`- GET /api/auth/get-session : HTTP ${authSessionRes.status}`);
    const authSessionData = await authSessionRes.json();
    console.log(`  Auth session response:`, authSessionData);

    // Test sign up via Neon Auth API route
    const testEmail = `neon_test_${Date.now()}@example.com`;
    const signUpRes = await fetch(`${BASE_URL}/api/auth/sign-up/email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Origin": "http://localhost:3000",
      },
      body: JSON.stringify({
        email: testEmail,
        password: "TestPassword123!",
        name: "Neon Test User",
      }),
    });
    console.log(`- POST /api/auth/sign-up/email (${testEmail}) : HTTP ${signUpRes.status}`);
    const signUpData = await signUpRes.json();
    console.log(`  Sign up result:`, signUpData?.user ? `User created with ID: ${signUpData.user.id}` : signUpData);

    if (authSessionRes.ok && (signUpRes.ok || signUpRes.status === 200 || signUpRes.status === 201)) {
      results.neonAuth = true;
      console.log("=> Neon Auth Service: PASSED\n");
    }
  } catch (err) {
    console.error("Neon Auth test failed:", err.message);
  }

  console.log("==========================================");
  console.log("           FINAL TEST SUMMARY             ");
  console.log("==========================================");
  console.log(`Frontend Pages:       ${results.pages ? "PASS" : "FAIL"}`);
  console.log(`Lakebase Postgres:    ${results.postgres ? "PASS" : "FAIL"}`);
  console.log(`Object Storage:       ${results.objectStorage ? "PASS" : "FAIL"}`);
  console.log(`Neon Auth:            ${results.neonAuth ? "PASS" : "FAIL"}`);
  console.log("==========================================");

  const allPassed = Object.values(results).every(Boolean);
  if (!allPassed) {
    process.exit(1);
  }
}

runTests();
