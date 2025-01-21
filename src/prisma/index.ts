import { Item, LoginStatus, Receipt, User } from "@prisma/client";

import initDB from "./init-db";

import {
  $allModelsExtension,
  $userModelExtension,
  $errorHandler,
  $receiptModelExtension,
} from "./extensions";

const getExtendedPrismaClient = () => {
  const db = initDB()
    .$extends($errorHandler)
    .$extends($allModelsExtension)
    .$extends($userModelExtension)
    .$extends($receiptModelExtension);
  return db;
};

type PrismaClientWithExtensions = ReturnType<typeof getExtendedPrismaClient>;

const db: PrismaClientWithExtensions = getExtendedPrismaClient();

export { User, Receipt, Item, LoginStatus, PrismaClientWithExtensions };

export default db;
