import { PrismaClient } from '../generated/prisma'
import dotenv from 'dotenv'

dotenv.config()

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

const prisma = globalForPrisma.prisma || new PrismaClient()

if (process.env.API_ENVIRONMENT !== 'production') globalForPrisma.prisma = prisma

export * from '../generated/prisma'
export default prisma
