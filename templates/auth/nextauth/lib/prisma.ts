import { PrismaClient } from "@prisma/client";

/**
 * Prisma Client instance
 * This creates a single instance of PrismaClient to be reused across the application
 * In development, hot reloading can cause multiple instances, so we use globalThis
 */

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
