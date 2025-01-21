import { Request, Response, NextFunction } from "express";

import { SpentAPIExceptionCodes } from "../types";
import { secrets, messages } from "../constants";
import ForbiddenError from "../errors/forbidden-error";

const appVerification = (req: Request, res: Response, next: NextFunction) => {
  try {
    const secretAppKey = req.headers.secret_app_key;

    if (!secretAppKey) {
      throw new ForbiddenError(
        messages.error.MissingSecretAppKeyError,
        SpentAPIExceptionCodes.UNVERIFIED_APP
      );
    }

    if (secretAppKey !== secrets.SECRET_APP_KEY) {
      throw new ForbiddenError(
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

export default appVerification;
