/**
 * Vercel database integrations often use a custom prefix (this project: DB_).
 * Normalize common variants into the names Prisma expects.
 */
export function ensureDatabaseUrl() {
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
    // Keep DATABASE_URL in sync for tooling that still reads it
    process.env.DATABASE_URL = pooled;
  }

  if (direct) {
    process.env.DB_DATABASE_URL_UNPOOLED = direct;
  }

  return { pooled, direct };
}

ensureDatabaseUrl();
