import { Request, Response, NextFunction, RequestHandler } from "express";

import { throwUnauthorizedActionError } from "../errors";
import { SpentAPIExceptionCodes } from "../types";
import { verify } from "../utils";
import JWTokenError from "../errors/jwtoken-error";
import { messages } from "../constants";
import db, { LoginStatus } from "../prisma";
import { AuthHandler } from ".";

const handle: AuthHandler =
  (ignoreTokenExpiry: boolean = false): RequestHandler =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const token = req.headers.authorization;

    try {
      if (!token) {
        throw throwUnauthorizedActionError(
          messages.error.JWTMissing,
          SpentAPIExceptionCodes.MISSING_JWT_ERROR
        );
      }

      const payload = verify.JWToken(token, ignoreTokenExpiry);

      if (!payload) {
        throw throwUnauthorizedActionError(
          messages.error.JWTInvalid,
          SpentAPIExceptionCodes.INVALID_JWT
        );
      }

      const user = await db.user.findFirstOrThrow({
        select: {
          userId: true,
          loggedIn: true,
          lastGeneratedToken: true,
        },
        where: {
          userId: payload.userId,
        },
      });

      if (user.loggedIn === LoginStatus.LOGGED_OUT) {
        throw throwUnauthorizedActionError(
          messages.info.UserAlreadyLoggedOut,
          SpentAPIExceptionCodes.USER_SIGNED_OUT
        );
      }

      if (token !== user.lastGeneratedToken && !ignoreTokenExpiry) {
        throw throwUnauthorizedActionError(
          messages.error.UpdatedJWT,
          SpentAPIExceptionCodes.JWT_EXPIRED
        );
      }

      if (payload.expired) {
        req.headers.logout_required = "Y";
      }

      req.headers.authorization = undefined;
      req.headers.user_id = user.userId;
      next();
    } catch (err) {
      if (
        err instanceof JWTokenError &&
        err.errorCode === SpentAPIExceptionCodes.JWT_EXPIRED
      ) {
        console.log("still throwing expired error for some reason");
      }
      next(err);
    }
  };

export default { handle };
