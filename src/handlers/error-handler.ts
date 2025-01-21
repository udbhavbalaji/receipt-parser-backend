import { Request, Response, NextFunction } from "express";

import db from "../prisma";
import { HTTPStatusCodes, SpentAPIExceptionCodes } from "../types";
import { messages } from "../constants";
import SpentAPIException from "../errors/spent-api-exception";
import { InternalServerError } from "../errors";

const errorHandler = (method: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.headers.logout_required === "Y") {
      const userId = req.headers.user_id as string;

      db.user.logOut(userId).then(() => {
        res.status(HTTPStatusCodes.REDIRECT_REQUIRED).json({
          message: messages.info.UserLogOutInstruction,
          redirectTo: "/api/auth/logout",
          method: "PUT",
        });
      });
    } else {
      Promise.resolve(method(req, res, next))
        .then(
          ({
            status,
            responseBody,
          }: {
            status: HTTPStatusCodes;
            responseBody?: Record<string, any>;
          }) => {
            if (responseBody) {
              res.status(status).json(responseBody);
            } else {
              res.sendStatus(status);
            }
          }
        )
        .catch((err) => {
          let exception: SpentAPIException;
          if (err instanceof SpentAPIException) {
            exception = err;
          } else {
            exception = new InternalServerError(
              messages.error.DefaultError,
              SpentAPIExceptionCodes.INTERNAL_SERVER_ERROR,
              err.stack,
              HTTPStatusCodes.INTERNAL_SERVER_ERROR
            );
          }
          next(exception);
        });
    }
  };
};

export default errorHandler;
