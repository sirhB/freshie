/**
 * Vercel DB integration uses prefix DB_ → primary URL is DB_URL
 * (not DB_DATABASE_URL). Normalize common aliases into DB_URL.
 */
export function resolveDatabaseUrls() {
  const pooled =
    process.env.DB_URL ||
    process.env.DB_POSTGRES_PRISMA_URL ||
    process.env.DB_POSTGRES_URL ||
    process.env.DB_DATABASE_URL ||
    process.env.DATABASE_URL ||
    process.env.POSTGRES_PRISMA_URL ||
    process.env.POSTGRES_URL;

  const direct =
    process.env.DB_URL_UNPOOLED ||
    process.env.DB_POSTGRES_URL_NON_POOLING ||
    process.env.DB_DATABASE_URL_UNPOOLED ||
    process.env.DATABASE_URL_UNPOOLED ||
    process.env.POSTGRES_URL_NON_POOLING ||
    pooled;

  return { pooled: pooled || null, direct: direct || null };
}

export function ensureDatabaseUrl() {
  const { pooled, direct } = resolveDatabaseUrls();

  if (pooled) {
    process.env.DB_URL = pooled;
    process.env.DATABASE_URL = pooled;
  }

  if (direct) {
    process.env.DB_URL_UNPOOLED = direct;
  }

  return { pooled, direct };
}

export function hasDatabaseUrl() {
  return Boolean(resolveDatabaseUrls().pooled);
}

ensureDatabaseUrl();
