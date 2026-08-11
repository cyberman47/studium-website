// One-off migration runner: applies a supabase/migrations/*.sql file
// straight to the real Postgres database using POSTGRES_URL_NON_POOLING
// (DDL should not go through the pooled connection). Usage:
//   node scripts/run-migration.mjs supabase/migrations/0001_profiles.sql
import { readFileSync } from "node:fs";
import { Client } from "pg";
import { config } from "dotenv";

config({ path: ".env.local" });

const file = process.argv[2];
if (!file) {
  console.error("Usage: node scripts/run-migration.mjs <path-to-sql-file>");
  process.exit(1);
}

const connectionString = process.env.POSTGRES_URL_NON_POOLING || process.env.POSTGRES_URL;
if (!connectionString) {
  console.error("POSTGRES_URL_NON_POOLING / POSTGRES_URL is not set in the environment.");
  process.exit(1);
}

const sql = readFileSync(file, "utf8");
const client = new Client({ connectionString, ssl: { rejectUnauthorized: false } });

try {
  await client.connect();
  await client.query(sql);
  console.log(`Applied ${file} successfully.`);
} catch (err) {
  console.error(`Failed to apply ${file}:`, err.message);
  process.exit(1);
} finally {
  await client.end();
}
