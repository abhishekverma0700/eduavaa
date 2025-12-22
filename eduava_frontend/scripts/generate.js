import fs from "fs";
import dotenv from "dotenv";
import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";

dotenv.config();

// 🔐 ENV VARIABLES (BACKEND ONLY)
const {
  R2_ACCOUNT_ID,
  R2_ACCESS_KEY_ID,
  R2_SECRET_ACCESS_KEY,
  R2_BUCKET_NAME,
} = process.env;

if (
  !R2_ACCOUNT_ID ||
  !R2_ACCESS_KEY_ID ||
  !R2_SECRET_ACCESS_KEY ||
  !R2_BUCKET_NAME
) {
  console.error("❌ Missing R2 environment variables");
  process.exit(1);
}

const s3 = new S3Client({
  region: "auto",
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

async function run() {
  console.log("🔄 Reading files from R2 bucket...");

  const response = await s3.send(
    new ListObjectsV2Command({ Bucket: R2_BUCKET_NAME })
  );

  const manifest = {};

  for (const item of response.Contents || []) {
    if (item.Key.endsWith(".pdf")) {
      manifest[item.Key] = true;
    }
  }

  fs.writeFileSync(
    "src/data/notes-manifest.json",
    JSON.stringify(manifest, null, 2)
  );

  console.log("✅ DONE: notes-manifest.json generated");
  console.log(`📄 Total PDFs: ${Object.keys(manifest).length}`);
}

run().catch(console.error);
