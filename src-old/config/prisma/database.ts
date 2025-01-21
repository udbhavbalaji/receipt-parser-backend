import { LoginStatus, PrismaClient } from "@prisma/client";
import { Prisma } from "@prisma/client";
import { messages } from "src/constants";
import { throwBadRequestError, throwPrismaQueryError } from "src/errors";
import SpentAPIException from "src/errors/SpentAPIException";
import { ReceiptDB } from "src/types/database";
import { SpentAPIExceptionCodes } from "src/types/enums";
import { ItemRequest } from "src/types/request";
import { generate } from "src/utils";

const db = new PrismaClient().$extends({
  query: {
    $allOperations({
      model,
      operation,
      args,
      query,
    }: {
      model?: string;
      operation: string;
      args: Prisma.MiddlewareParams["args"];
      query: (args: Prisma.MiddlewareParams["args"]) => Promise<unknown>;
    }): Promise<unknown> {
      return query(args).catch((err) => {
        if (
          err instanceof Prisma.PrismaClientKnownRequestError &&
          err.code === "P2025"
        ) {
          // console.log(err);
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
    receipt: {
      async add(receipt: ReceiptDB, items: ItemRequest[]) {
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

      async get(receiptId: string, userId: string) {
        return await db.receipt.findFirstOrThrow({
          where: {
            receiptId: receiptId,
            userId: userId,
          },
        });
      },
    },
    user: {
      async loginCheck(email: string) {
        return await db.user.findFirstOrThrow({
          select: {
            userId: true,
            loggedIn: true,
            password: true,
            lastGeneratedToken: true,
          },
          where: {
            email: email,
          },
        });
      },

      async logOut(userId: string) {
        return await db.user.update({
          where: {
            userId: userId,
          },
          data: {
            loggedIn: LoginStatus.LOGGED_OUT,
          },
        });
      },

      async logIn(userId: string, token: string) {
        return await db.user.update({
          where: {
            userId: userId,
          },
          data: {
            loggedIn: LoginStatus.LOGGED_IN,
            lastGeneratedToken: token,
          },
        });
      },

      async deleteById(userId: string) {
        await db.user.delete({
          where: {
            userId: userId,
          },
        });
      },

      async getMe(userId: string) {
        return await db.user.findFirstOrThrow({
          omit: {
            password: true,
            lastGeneratedToken: true,
            id: true,
          },
          where: {
            userId: userId,
          },
        });
      },
    },
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
  },
});

// db.$extends({
//   model: {
//     $allModels: {
//       async exists<T>(
//         this: T,
//         where: Prisma.Args<T, "findFirst">["where"]
//       ): Promise<boolean> {
//         const context = Prisma.getExtensionContext(this);

//         const result = await (context as any).findFirst({ where });
//         return result !== null;
//       },
//     },
//   },
// });

export default db;
