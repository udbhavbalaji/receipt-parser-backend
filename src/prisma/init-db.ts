import { PrismaClient } from "@prisma/client";

const initDB = () => new PrismaClient();

export default initDB;
