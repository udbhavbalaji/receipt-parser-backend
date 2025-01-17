import { Request, Response, NextFunction } from "express";
import { throwForbiddenError } from "../errors";
import { secrets, messages } from "src/constants";
import { SpentAPIExceptionCodes } from "src/types/enums";

const handle = (req: Request, res: Response, next: NextFunction) => {
  try {
    const secretAppKey = req.headers.secret_app_key;

    if (!secretAppKey) {
      throw throwForbiddenError(messages.MissingSecretAppKeyErrorMessage);
    }

    if (secretAppKey !== secrets.SECRET_APP_KEY) {
      throw throwForbiddenError(
        messages.InvalidSecretAppKeyErrorMessage,
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
