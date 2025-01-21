import { Request, Response, NextFunction, response } from "express";
import { messages } from "src/constants";
import { throwInternalServerError } from "src/errors";
import SpentAPIException from "src/errors/SpentAPIException";
import { HTTPStatusCodes } from "src/types/enums";

const handle = (method: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (
      req.headers.logout_required === "Y" &&
      req.headers.authorization === "redacted"
    ) {
      res.status(HTTPStatusCodes.REDIRECT_REQUIRED).json({
        message: messages.info.UserLogOutInstruction,
        redirectTo: "/api/auth/logout",
        method: "PUT",
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
            exception = throwInternalServerError(
              messages.error.DefaultError,
              err.stack
            );
          }
          next(exception);
        });
    }
  };
};

export default { handle };
