import { Item, Prisma, Receipt, User } from "@prisma/client";

import { messages } from "../../constants";
import { SpentAPIExceptionCodes } from "../../types";
import { BadRequestError } from "../../errors";

type PrismaModels = User | Receipt | Item;

const $errorHandler = Prisma.defineExtension({
  name: "errorHandler",
  query: {
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
            return new BadRequestError(
              messages.info.UserNotFound,
              SpentAPIExceptionCodes.NOT_FOUND,
              err.stack
            );
          } else if (err.meta?.modelName === "Receipt") {
            return new BadRequestError(
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

export default $errorHandler;
