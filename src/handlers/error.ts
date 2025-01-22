import { Request, Response, NextFunction, RequestHandler } from "express";
import { messages } from "src/constants";
import { throwInternalServerError } from "src/errors";
import SpentAPIException from "src/errors/SpentAPIException";
import db from "src/prisma";
import { HTTPStatusCodes } from "src/types/enums";

const handle: ErrorHandler =
  (method: Function): RequestHandler =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (req.headers.logout_required === "Y") {
        await db.user.logOut(req.headers.user_id as string);
        res.status(HTTPStatusCodes.UNAUTHORIZED).json({
          message: "User logged out due to expired jwt",
        });
      } else {
        const {
          status,
          responseBody,
        }: { status: HTTPStatusCodes; responseBody?: Record<string, any> } =
          await method(req, res, next);

        if (responseBody) {
          res.status(status).json(responseBody);
        } else {
          res.sendStatus(status);
        }
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

export type ErrorHandler = (method: Function) => RequestHandler;

export default { handle };
