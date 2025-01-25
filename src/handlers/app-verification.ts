import { Request, Response, NextFunction, RequestHandler } from "express";

import { throwForbiddenError } from "../errors";
import { secrets, messages } from "../constants";
import { SpentAPIExceptionCodes } from "../types";

const handle: RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const secretAppKey = req.headers.secret_app_key;

    if (!secretAppKey) {
      throw throwForbiddenError(
        messages.error.MissingSecretAppKeyError,
        SpentAPIExceptionCodes.UNVERIFIED_APP
      );
    }

    if (secretAppKey !== secrets.SECRET_APP_KEY) {
      throw throwForbiddenError(
        messages.error.InvalidSecretAppKeyError,
        SpentAPIExceptionCodes.INVALID_APP_KEY
      );
    }

    req.headers.secret_app_key = undefined;
    req.headers.app_validated = "Y";
    next();
  } catch (err) {
    next(err);
  }
};

export default { handle };
