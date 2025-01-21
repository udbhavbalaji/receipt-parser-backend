import { Request, Response, NextFunction } from "express";
import { throwForbiddenError } from "../errors";
import { secrets, messages } from "src/constants";
import { SpentAPIExceptionCodes } from "src/types/enums";

const handle = (req: Request, res: Response, next: NextFunction) => {
  try {
    const secretAppKey = req.headers.secret_app_key;

    if (!secretAppKey) {
      throw throwForbiddenError(messages.error.MissingSecretAppKeyError);
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
