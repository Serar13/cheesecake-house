// Seeds Firestore with the initial catalog (categories, products, locations,
// tables, promotions, reviews) from seedData.json.
//
// Usage:
//   1. Create a service account key in the Firebase console
//      (Project settings → Service accounts → Generate new private key).
//   2. Save it as seed/service-account.json (gitignored) OR point
//      GOOGLE_APPLICATION_CREDENTIALS at it.
//   3. cd seed && npm install && npm run seed
//
// The Admin SDK bypasses security rules, so this does NOT require an admin
// login — but keep the key file secret and never commit it.

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { initializeApp, cert, applicationDefault } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";

const __dirname = dirname(fileURLToPath(import.meta.url));
const data = JSON.parse(readFileSync(join(__dirname, "seedData.json"), "utf8"));

// Prefer an explicit key file at seed/service-account.json, else fall back to
// GOOGLE_APPLICATION_CREDENTIALS / application default credentials.
let credential;
try {
  const key = JSON.parse(readFileSync(join(__dirname, "service-account.json"), "utf8"));
  credential = cert(key);
} catch {
  credential = applicationDefault();
}

initializeApp({ credential, projectId: process.env.FIREBASE_PROJECT_ID || "chessecakehouse" });
const db = getFirestore();

async function seedCollection(name, items) {
  const batch = db.batch();
  for (const item of items) {
    const { id, ...rest } = item;
    const ref = db.collection(name).doc(id);
    batch.set(
      ref,
      { ...rest, createdAt: FieldValue.serverTimestamp(), updatedAt: FieldValue.serverTimestamp() },
      { merge: true }
    );
  }
  await batch.commit();
  console.log(`✓ ${name}: ${items.length} documents`);
}

async function run() {
  for (const [name, items] of Object.entries(data)) {
    await seedCollection(name, items);
  }
  console.log("\nSeed complete. Now make yourself an admin: set users/{your-uid}.role = 'admin'.");
}

run().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
