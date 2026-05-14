import { PrismaClient } from "@prisma/client";

// Create one single PrismaClient instance for the whole app.
// Prisma reads DATABASE_URL from .env automatically.
const prisma = new PrismaClient();

export default prisma;
