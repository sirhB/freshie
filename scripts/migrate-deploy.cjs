#!/usr/bin/env node
/**
 * Resolve DB_* env vars, then run `prisma migrate deploy`.
 * Skips when no URL is set, or when SKIP_DB_MIGRATE=1.
 * On non-Vercel hosts, connection failures warn instead of failing the build.
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

if (process.env.SKIP_DB_MIGRATE === "1") {
  console.warn("[db] SKIP_DB_MIGRATE=1 — skipping prisma migrate deploy");
  process.exit(0);
}

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

const status = result.status ?? 1;
if (status !== 0 && process.env.VERCEL !== "1") {
  console.warn(
    "[db] prisma migrate deploy failed locally/CI — continuing build (set Vercel DB_* for production migrations)",
  );
  process.exit(0);
}

process.exit(status);
