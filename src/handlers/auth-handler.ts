import { Request, Response, NextFunction } from "express";

import { messages } from "../constants";
import { verify } from "../utils";
import { SpentAPIExceptionCodes } from "../types";
import { JWTokenError, UnauthorizedActionError } from "../errors";
import db from "../prisma";
import { LoginStatus, User } from "@prisma/client";

const authHandler = (ignoreTokenExpiry: boolean = false) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;
    let isTokenExpired: boolean = false;
    let expiredTokenUserId: string | undefined = undefined;

    try {
      if (!token) {
        throw new UnauthorizedActionError(
          messages.error.JWTMissing,
          SpentAPIExceptionCodes.MISSING_JWT_ERROR
        );
      }

      const payload = verify.JWToken(token, ignoreTokenExpiry);

      console.log(payload);

      if (!payload) {
        throw new UnauthorizedActionError(
          messages.error.JWTInvalid,
          SpentAPIExceptionCodes.INVALID_JWT
        );
      }

      let userId: string;

      if (payload.retry) {
        const expiredPayload = verify.JWToken(token, true);
        isTokenExpired = true;

        expiredTokenUserId = expiredPayload.userId;
        userId = expiredPayload.userId;
      } else {
        userId = payload.userId;
      }

      console.log(userId);

      const user = await db.user.findFirstOrThrow({
        select: {
          userId: true,
          loggedIn: true,
          lastGeneratedToken: true,
        },
        where: {
          userId: userId,
        },
      });

      if (user.loggedIn === LoginStatus.LOGGED_OUT && !isTokenExpired) {
        throw new UnauthorizedActionError(
          messages.info.UserAlreadyLoggedOut,
          SpentAPIExceptionCodes.USER_SIGNED_OUT
        );
      }

      if (token !== user.lastGeneratedToken && !ignoreTokenExpiry) {
        throw new UnauthorizedActionError(
          messages.error.JWTExpired,
          SpentAPIExceptionCodes.JWT_EXPIRED
        );
      }

      req.headers.user_id = user.userId;
      req.headers.authorization = undefined;
      next();
    } catch (err) {
      if (isTokenExpired) {
        req.headers.logout_required = "Y";
        req.headers.authorization = undefined;
        req.headers.user_id = expiredTokenUserId;
        next(
          new JWTokenError(
            messages.error.JWTExpired,
            SpentAPIExceptionCodes.JWT_EXPIRED
          )
        );
      } else {
        next(err);
      }
    }
  };
};

// const authHandler = (ignoreTokenExpiry: boolean = false) => {
//   return async (req: Request, res: Response, next: NextFunction) => {
//     const token = req.headers.authorization;

//     try {
//       if (!token) {
//         throw new UnauthorizedActionError(
//           messages.error.JWTMissing,
//           SpentAPIExceptionCodes.MISSING_JWT_ERROR
//         );
//       }

//       const payload = verify.JWToken(token, ignoreTokenExpiry);
//       // todo: check if retry property is enabled, and then retry to get the payload with the ignoreExpiry set to true
//       // todo: then we can send user_id as part of the request to allow prisma to log out the suer automatically rather than only sending logout instructions to client and trusting them to do it.

//       if (!payload) {
//         throw new UnauthorizedActionError(
//           messages.error.JWTInvalid,
//           SpentAPIExceptionCodes.INVALID_JWT
//         );
//       }

//       if (payload.retry) {
//         const expiredPayload = verify.JWToken(token, true);
//       }

//       const userId = payload.userId

//       const user = await db.user.findFirstOrThrow({
//         select: {
//           userId: true,
//           loggedIn: true,
//           lastGeneratedToken: true,
//         },
//         where: {
//           userId: payload.userId,
//         },
//       });

//       if (user.loggedIn === LoginStatus.LOGGED_OUT) {
//         throw new UnauthorizedActionError(
//           messages.info.UserAlreadyLoggedOut,
//           SpentAPIExceptionCodes.USER_SIGNED_OUT
//         );
//       }

//       if (token !== user.lastGeneratedToken && !ignoreTokenExpiry) {
//         throw new UnauthorizedActionError(
//           messages.error.JWTExpired,
//           SpentAPIExceptionCodes.JWT_EXPIRED
//         );
//       }

//       req.headers.user_id = user.userId;
//       req.headers.authorization = undefined;
//       next();
//     } catch (err) {
//       if (
//         err instanceof JWTokenError &&
//         err.errorCode === SpentAPIExceptionCodes.JWT_EXPIRED
//       ) {
//         // req.user_id = "redacted";
//         req.headers.user_id = "redacted";
//         req.headers.logout_required = "Y";
//       }
//       next(err);
//     }
//   };
// };

export default authHandler;
