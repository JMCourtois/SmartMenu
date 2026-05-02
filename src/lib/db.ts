import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

export function hasDatabaseUrl() {
  const databaseUrl = process.env.DATABASE_URL;
  return Boolean(
    databaseUrl &&
      !databaseUrl.includes("USER:PASSWORD@HOST") &&
      !databaseUrl.includes("@HOST:") &&
      !databaseUrl.includes("HOST:6543"),
  );
}

export function getPrisma() {
  if (!hasDatabaseUrl()) {
    throw new Error("DATABASE_URL is not configured.");
  }

  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = new PrismaClient({
      log:
        process.env.NODE_ENV === "development"
          ? ["query", "error", "warn"]
          : ["error"],
    });
  }

  return globalForPrisma.prisma;
}
