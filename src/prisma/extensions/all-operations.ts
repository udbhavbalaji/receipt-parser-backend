import { Item, Prisma, Receipt, User } from "@prisma/client";

import { messages } from "../../constants";
import { SpentAPIExceptionCodes } from "../../types";
import { throwBadRequestError } from "../../errors";
import { PrismaClient } from "@prisma/client/extension";

type PrismaModels = User | Receipt | Item;

const $addErrorHandler = (db: PrismaClient) => {
  return db.$extends($errorHandler);
};

export type ExtendedPrismaClientWithErrorHandler = ReturnType<
  typeof $addErrorHandler
>;

const $errorHandler = Prisma.defineExtension({
  name: "errorHandler",
  query: {
    // $allOperations: async <T>({
    //   model,
    //   operation,
    //   args,
    //   query,
    // }: {
    //   model?: string;
    //   operation: string;
    //   args: Prisma.MiddlewareParams["args"];
    //   query: (args: Prisma.MiddlewareParams["args"]) => Promise<T | void>;
    // }): Promise<T | void> => {
    //   try {
    //     return await query(args);
    //   } catch (err) {
    //     if (
    //       err instanceof Prisma.PrismaClientKnownRequestError &&
    //       err.code === "P2025"
    //     ) {
    //       // console.log(err);
    //       if (err.meta?.modelName === "User") {
    //         throw throwBadRequestError(
    //           messages.info.UserNotFound,
    //           SpentAPIExceptionCodes.NOT_FOUND,
    //           err.stack
    //         );
    //       } else if (err.meta?.modelName === "Receipt") {
    //         throw throwBadRequestError(
    //           messages.info.ReceiptNotFound,
    //           SpentAPIExceptionCodes.NOT_FOUND,
    //           err.stack
    //         );
    //       }
    //     } else {
    //       throw err;
    //     }
    //   }
    // },

    $allOperations<T>({
      model,
      operation,
      args,
      query,
    }: {
      model?: string;
      operation: string;
      args: Prisma.MiddlewareParams["args"];
      query: (args: Prisma.MiddlewareParams["args"]) => Promise<T | void>;
    }): Promise<T | void> {
      console.log("error handler is being called");
      return query(args).catch((err) => {
        if (
          err instanceof Prisma.PrismaClientKnownRequestError &&
          err.code === "P2025"
        ) {
          // console.log(err);
          if (err.meta?.modelName === "User") {
            return throwBadRequestError(
              messages.info.UserNotFound,
              SpentAPIExceptionCodes.NOT_FOUND,
              err.stack
            );
          } else if (err.meta?.modelName === "Receipt") {
            return throwBadRequestError(
              messages.info.ReceiptNotFound,
              SpentAPIExceptionCodes.NOT_FOUND,
              err.stack
            );
          }
        } else {
          return err;
        }
      });
    },
  },
});

export { $addErrorHandler };

export default $errorHandler;
