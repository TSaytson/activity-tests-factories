import prisma from "../src/config/database";

export async function cleanDB() {
    await prisma.$executeRaw`TRUNCATE TABLE "Game" RESTART IDENTITY CASCADE;`
    await prisma.$executeRaw`TRUNCATE TABLE "Console" RESTART IDENTITY CASCADE;`
}
