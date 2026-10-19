
import { Files } from "files-sdk";
import { neon } from "files-sdk/neon";
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

async function testStorage() {
  if (!process.env.AWS_ENDPOINT_URL_S3) {
    console.log("Skipping storage live test: AWS_ENDPOINT_URL_S3 not set (CI environment without live credentials).");
    return;
  }
  console.log("Testing Neon Object Storage...");
  console.log("Endpoint:", process.env.AWS_ENDPOINT_URL_S3);
  console.log("Region:", process.env.AWS_REGION);

  const files = new Files({ adapter: neon({ bucket: "assets" }) });

  const testKey = `test-${Date.now()}.txt`;
  const content = "Hello from Neon Object Storage integration test!";
  
  console.log(`Uploading test file: ${testKey}`);
  await files.upload(testKey, content, { contentType: "text/plain" });

  console.log("Checking if file exists...");
  const exists = await files.exists(testKey);
  console.log(`File exists: ${exists}`);

  console.log("Downloading test file...");
  const downloaded = await files.download(testKey);
  const text = await downloaded.text();
  console.log(`Downloaded content matches: ${text === content}`);

  console.log("Listing files in bucket...");
  const list = await files.list();
  console.log("List result:", list);

  console.log("Deleting test file...");
  await files.delete(testKey);
  console.log("Test file cleaned up successfully!");
}

testStorage().catch((err) => {
  console.error("Storage test failed:", err);
  process.exit(1);
});
