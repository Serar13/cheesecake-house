// Seeds Firestore through the public REST API using the local gcloud account.
// This is useful on development machines where Firebase CLI is logged in but
// no service-account key is available.

import { readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectId = process.env.FIREBASE_PROJECT_ID || "chessecakehouse";
const data = JSON.parse(readFileSync(join(__dirname, "seedData.json"), "utf8"));
const token = execFileSync("gcloud", ["auth", "print-access-token"], { encoding: "utf8" }).trim();
const baseUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents`;

function toFirestoreValue(value) {
  if (value === null || value === undefined) return { nullValue: null };
  if (typeof value === "string") return { stringValue: value };
  if (typeof value === "boolean") return { booleanValue: value };
  if (typeof value === "number") {
    return Number.isInteger(value) ? { integerValue: String(value) } : { doubleValue: value };
  }
  if (Array.isArray(value)) {
    return { arrayValue: { values: value.map(toFirestoreValue) } };
  }
  if (typeof value === "object") {
    return {
      mapValue: {
        fields: Object.fromEntries(Object.entries(value).map(([key, child]) => [key, toFirestoreValue(child)]))
      }
    };
  }
  return { stringValue: String(value) };
}

function toFirestoreFields(item) {
  const now = new Date().toISOString();
  return Object.fromEntries(
    Object.entries({ ...item, updatedAt: now }).map(([key, value]) => [key, toFirestoreValue(value)])
  );
}

async function patchDocument(collectionName, item) {
  const { id, ...rest } = item;
  const fields = toFirestoreFields(rest);
  const updateMask = Object.keys(fields).map((field) => `updateMask.fieldPaths=${encodeURIComponent(field)}`).join("&");
  const url = `${baseUrl}/${collectionName}/${encodeURIComponent(id)}?${updateMask}`;
  const response = await fetch(url, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ fields })
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`${collectionName}/${id}: ${response.status} ${body}`);
  }
}

async function seedCollection(collectionName, items) {
  for (const item of items) {
    await patchDocument(collectionName, item);
  }
  console.log(`✓ ${collectionName}: ${items.length} documents`);
}

for (const [collectionName, items] of Object.entries(data)) {
  await seedCollection(collectionName, items);
}

console.log("\nSeed complete via Firestore REST.");
