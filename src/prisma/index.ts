import { Item, LoginStatus, Receipt, User } from "@prisma/client";

import initDB from "./init-db";

const db = initDB();

export type SpentPrismaClient = ReturnType<typeof initDB>;

export { Item, LoginStatus, Receipt, User };

export default db;

export type PublicUser = Omit<
  Omit<Omit<User, "id">, "password">,
  "lastGeneratedToken"
>;
