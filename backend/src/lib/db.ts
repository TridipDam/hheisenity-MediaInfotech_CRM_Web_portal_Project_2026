import { PrismaClient } from "@/generated/prisma";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const adapter = new PrismaMariaDb({
  host: process.env.DATABASE_HOST!,
  user: process.env.DATABASE_USER!,
  password: process.env.DATABASE_PASSWORD!,
  database: process.env.DATABASE_NAME!,
  port: parseInt(process.env.DATABASE_PORT!),
});

export const prisma = new PrismaClient({ adapter });