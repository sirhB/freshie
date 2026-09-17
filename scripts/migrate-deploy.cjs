#!/usr/bin/env node
/**
 * Resolve DB_* env vars, then run `prisma migrate deploy`.
 * Safe no-op for builds without a database URL.
 */
const { spawnSync } = require("child_process");
const fs = require("fs");
const path = require("path");

function loadEnvFile() {
  const envPath = path.join(process.cwd(), ".env");
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (process.env[key] === undefined) process.env[key] = value;
  }
}

function ensureDatabaseUrl() {
  const pooled =
    process.env.DB_DATABASE_URL ||
    process.env.DB_POSTGRES_PRISMA_URL ||
    process.env.DB_POSTGRES_URL ||
    process.env.DATABASE_URL ||
    process.env.POSTGRES_PRISMA_URL ||
    process.env.POSTGRES_URL;

  const direct =
    process.env.DB_DATABASE_URL_UNPOOLED ||
    process.env.DB_POSTGRES_URL_NON_POOLING ||
    process.env.DATABASE_URL_UNPOOLED ||
    process.env.POSTGRES_URL_NON_POOLING ||
    pooled;

  if (pooled) {
    process.env.DB_DATABASE_URL = pooled;
    process.env.DATABASE_URL = pooled;
  }
  if (direct) {
    process.env.DB_DATABASE_URL_UNPOOLED = direct;
  }
  return Boolean(pooled);
}

loadEnvFile();

if (!ensureDatabaseUrl()) {
  console.warn(
    "[db] No DB_DATABASE_URL / DATABASE_URL found — skipping prisma migrate deploy",
  );
  process.exit(0);
}

const result = spawnSync("npx", ["prisma", "migrate", "deploy"], {
  stdio: "inherit",
  env: process.env,
});
process.exit(result.status ?? 1);
