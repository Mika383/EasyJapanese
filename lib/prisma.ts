import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import { Pool } from "pg"

process.env.PRISMA_CLIENT_ENGINE_TYPE ||= "library"

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined }

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ["query", "error", "warn"],
    adapter: new PrismaPg(
      new Pool({
        connectionString: process.env.DATABASE_URL,
      })
    ),
  })

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma
}
