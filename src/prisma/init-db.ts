import {
  Item,
  LoginStatus,
  Prisma,
  PrismaClient,
  Receipt,
  User,
} from "@prisma/client";

import { messages } from "../constants";
import { throwBadRequestError } from "../errors";
import { ItemRequest, SpentAPIExceptionCodes } from "../types";
import { generate } from "../utils";

const initDB = () => {
  const db = new PrismaClient().$extends({
    query: {
      $allOperations: ({
        model,
        operation,
        args,
        query,
      }: {
        model?: string;
        operation: string;
        args: Prisma.MiddlewareParams["args"];
        query: (args: Prisma.MiddlewareParams["args"]) => Promise<unknown>;
      }): Promise<unknown> => {
        return query(args).catch((err) => {
          if (
            err instanceof Prisma.PrismaClientKnownRequestError &&
            err.code === "P2025"
          ) {
            if (err.meta?.modelName === "User") {
              throw throwBadRequestError(
                messages.info.UserNotFound,
                SpentAPIExceptionCodes.NOT_FOUND,
                err.stack
              );
            } else if (err.meta?.modelName === "Receipt") {
              throw throwBadRequestError(
                messages.info.ReceiptNotFound,
                SpentAPIExceptionCodes.NOT_FOUND,
                err.stack
              );
            }
          } else {
            throw err;
          }
        });
      },
    },
    model: {
      $allModels: {
        async exists<T>(
          this: T,
          where: Prisma.Args<T, "findFirst">["where"]
        ): Promise<boolean> {
          const context = Prisma.getExtensionContext(this);

          const result = await (context as any).findFirst({ where });
          return result !== null;
        },
      },
      user: {
        async loginCheck(email: string): Promise<User> {
          const context = Prisma.getExtensionContext(this);

          return await (context as any).findFirstOrThrow({
            select: {
              userId: true,
              loggedIn: true,
              password: true,
              lastGeneratedToken: true,
            },
            where: {
              email,
            },
          });
        },

        async logIn(userId: string, token: string): Promise<User> {
          const context = Prisma.getExtensionContext(this);

          return await (context as any).update({
            where: {
              userId,
            },
            data: {
              loggedIn: LoginStatus.LOGGED_IN,
              lastGeneratedToken: token,
            },
          });
        },

        async logOut(userId: string): Promise<User> {
          const context = Prisma.getExtensionContext(this);

          return await (context as any).update({
            where: {
              userId: userId,
            },
            data: {
              loggedIn: LoginStatus.LOGGED_OUT,
            },
          });
        },
      },
      receipt: {
        add: async (
          receipt: Omit<Receipt, "id">,
          items: ItemRequest[]
        ): Promise<void> => {
          await db.$transaction(async (trx) => {
            const receiptId = receipt.receiptId;
            const itemsDB = items.map((item, idx) => {
              const itemId = generate.itemID(item, receipt.date, idx);

              return { itemId, receiptId, ...item };
            });

            await trx.receipt.create({ data: receipt });
            await trx.item.createMany({ data: itemsDB });
          });
        },
      },
    },
  });

  return db;
};

export default initDB;
