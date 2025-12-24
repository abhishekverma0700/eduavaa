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

// Map manifest keys (lowercase, consistent) to actual R2 folder prefixes (case-sensitive)
const CATEGORIES = [
  { key: "notes", prefix: "Notes" },
  { key: "question-papers", prefix: "Question-Papers" },
  { key: "quantum", prefix: "Quantum" },
  { key: "all-units", prefix: "All-Unit-Notes" },
];

async function run() {
  console.log("🔄 Reading files from R2 bucket...");

  const manifest = {
    notes: [],
    "question-papers": [],
    quantum: [],
    "all-units": [],
  };

  let totalPDFs = 0;

  // Scan each category folder
  for (const { key, prefix } of CATEGORIES) {
    console.log(`📂 Scanning ${prefix}/...`);

    const response = await s3.send(
      new ListObjectsV2Command({
        Bucket: R2_BUCKET_NAME,
        Prefix: `${prefix}/`, // case-sensitive prefix
      })
    );

    const pdfs = (response.Contents || [])
      .map((item) => item.Key)
      .filter((key) => /\.pdf$/i.test(key) && key !== `${prefix}/`); // case-insensitive .pdf

    manifest[key] = pdfs;
    totalPDFs += pdfs.length;

    console.log(`   ✓ Found ${pdfs.length} PDFs`);
  }

  fs.writeFileSync(
    "src/data/notes-manifest.json",
    JSON.stringify(manifest, null, 2)
  );

  console.log("\n✅ DONE: notes-manifest.json generated");
  console.log(`📄 Total PDFs: ${totalPDFs}`);
  console.log(`📊 Breakdown:`);
  for (const [cat, files] of Object.entries(manifest)) {
    console.log(`   ${cat}: ${files.length}`);
  }
}

run().catch(console.error);
