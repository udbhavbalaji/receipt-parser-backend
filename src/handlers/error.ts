import { Request, Response, NextFunction, RequestHandler } from "express";

import { messages } from "../constants";
import SpentAPIException, { throwInternalServerError } from "../errors";
import db from "../prisma";
import {
  SpentAPIExceptionCodes,
  HTTPStatusCodes,
  SpentAPIErrorResponse,
  SpentAPISuccessResponse,
} from "../types";
import { SpentController } from "../controllers";
import { ErrorHandler } from ".";

const handle: ErrorHandler =
  (method: SpentController): RequestHandler =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (req.headers.logout_required === "Y") {
        await db.user.logOut(req.headers.user_id as string);
        const response: SpentAPIErrorResponse = {
          status: HTTPStatusCodes.UNAUTHORIZED,
          type: "error",
          message: "User logged out due to expired jwt",
          errorCode: SpentAPIExceptionCodes.JWT_EXPIRED,
          errors: null,
        };
        res.status(response.status).json(response);
      } else {
        // const {
        //   status,
        //   responseBody,
        // }: { status: HTTPStatusCodes; responseBody?: Record<string, any> } =
        //   await method(req, res, next);

        const response: SpentAPISuccessResponse = await method(req, res, next);

        // if (responseBody) {
        //   res.status(status).json(responseBody);
        // } else {
        //   res.sendStatus(status);
        // }

        res.status(response.status).json(response);
      }
    } catch (err: any) {
      let exception: SpentAPIException;

      if (err instanceof SpentAPIException) {
        exception = err;
      } else {
        exception = throwInternalServerError(
          messages.error.DefaultError,
          err.stack
        );
      }
      next(exception);
    }
  };

// export type ErrorHandler = (method: SpentController) => RequestHandler;

export default { handle };
