// Dynamic Database
import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";
import fs from "fs";
import path from "path";
// NOTE: Unfortunately, we couldn't import this from .env
// due to a library limitation.
const createPrismaClient = () => {
  const schemaPath = path.join(process.cwd(), "prisma", "schema.prisma");
  try {
    const schema = fs.readFileSync(schemaPath, "utf-8");
    const match = schema.match(
      /datasource\s+\w+\s*\{[^}]*provider\s*=\s*"([^"]+)"[^}]*\}/
    );
    const provider = match ? match[1] : null;

    if (provider === "postgresql") {
      // eslint-disable-next-line no-console
      console.log("Using PostgreSQL provider");
      return new PrismaClient().$extends(withAccelerate());
    } else {
      // eslint-disable-next-line no-console
      console.log("Using SQLite provider");
      return new PrismaClient({
        log:
          process.env.NODE_ENV === "development"
            ? ["query", "error", "warn"]
            : ["error"],
      });
    }
  } catch (error) {
    console.error("Error reading prisma/schema.prisma:", error);
    // Fallback to a default client
    return new PrismaClient();
  }
};

type PrismaClientSingleton = ReturnType<typeof createPrismaClient>;

declare global {
  var prisma: PrismaClientSingleton | undefined;
}

export const prisma = globalThis.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma;

/* 
// for Postgress
import { PrismaClient } from '@prisma/client'
import { withAccelerate } from '@prisma/extension-accelerate'

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createPrismaClient> | undefined
}

const createPrismaClient = () => {
  return new PrismaClient().$extends(withAccelerate())
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

 */

/*
// for SQL Lite
 import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === "development" ?
    ["query", "error", "warn"] : ["error"],
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma


 */
