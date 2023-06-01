import { PrismaClient } from "@prisma/client"

const globals = global as unknown as {
  prisma: PrismaClient | undefined
}
export const Prisma = globals.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== "production") {
  globals.prisma = Prisma
}
