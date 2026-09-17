import { ensureDatabaseUrl, hasDatabaseUrl } from "@/lib/db-url";
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createClient() {
  ensureDatabaseUrl();
  if (!hasDatabaseUrl()) {
    throw new Error(
      "No database URL found. Set DB_URL (Vercel DB_ prefix) in project env.",
    );
  }
  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

/** Lazy Prisma accessor — avoids crashing module load when DB env is missing. */
export function getPrisma() {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = createClient();
  }
  return globalForPrisma.prisma;
}

/** Backward-compatible proxy used by existing imports. */
export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop, receiver) {
    const client = getPrisma();
    const value = Reflect.get(client, prop, receiver);
    return typeof value === "function" ? value.bind(client) : value;
  },
});
