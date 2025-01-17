import { Request, Response, NextFunction } from "express";
import { throwUnauthorizedActionError } from "src/errors";
import { SpentAPIExceptionCodes } from "src/types/enums";
import { verify } from "../utils";
import UnauthorizedActionError from "src/errors/UnauthorizedActionError";
import { user as User } from "../models";
import JWTokenError from "src/errors/JWTokenError";

const handle = (ignoreTokenExpiry: boolean = false) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;

    try {
      if (!token) {
        throw throwUnauthorizedActionError(
          "Missing JWT",
          SpentAPIExceptionCodes.MISSING_JWT_ERROR
        );
      }

      const payload = verify.JWToken(token, ignoreTokenExpiry);

      if (!payload) {
        throw new UnauthorizedActionError(
          "Invalid JWT",
          SpentAPIExceptionCodes.INVALID_JWT
        );
      }

      const user = await User.getByID(payload.userId, [
        "user_id",
        "logged_in",
        "last_generated_token",
      ]);

      if (!user) {
        throw throwUnauthorizedActionError(
          "User not found",
          SpentAPIExceptionCodes.NOT_FOUND
        );
      } else if (user.logged_in === "N") {
        throw throwUnauthorizedActionError(
          "User has signed out",
          SpentAPIExceptionCodes.USER_SIGNED_OUT
        );
      }

      if (token !== user.last_generated_token) {
        throw throwUnauthorizedActionError(
          "Updated JWT found",
          SpentAPIExceptionCodes.JWT_EXPIRED
        );
      }

      req.headers.user_id = user.user_id;
      req.headers.authorization = undefined;
      next();
    } catch (err) {
      if (
        err instanceof JWTokenError &&
        err.errorCode === SpentAPIExceptionCodes.JWT_EXPIRED
      ) {
        const payload = verify.JWToken(token ?? "", true);

        req.headers.authorization = "redacted";
        req.headers.logout_required = "Y";
        next();
      } else {
        next(err);
      }
    }
  };
};

export default { handle };
