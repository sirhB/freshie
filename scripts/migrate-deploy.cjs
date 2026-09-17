#!/usr/bin/env node
/**
 * Resolve DB_* env vars, then run `prisma migrate deploy`.
 * Safe no-op for local builds without a database URL.
 */
const { spawnSync } = require("child_process");

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
