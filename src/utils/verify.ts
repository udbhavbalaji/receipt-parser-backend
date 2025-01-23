import jwt, { JsonWebTokenError } from "jsonwebtoken";
import bcrypt from "bcrypt";

import { messages, secrets } from "../constants";
import { throwBadRequestError, throwJWTokenError } from "../errors";
import { SpentAPIExceptionCodes } from "../types";

const password = (plain: string, hashed: string): Promise<boolean> => {
  return bcrypt.compare(plain, hashed).catch((err) => {
    throw throwBadRequestError(
      messages.error.InvalidCredentialsError,
      SpentAPIExceptionCodes.INVALID_PASSWORD
    );
  });
};

const JWToken = (token: string, ignoreExpiry: boolean = false) => {
  try {
    const payload = jwt.verify(token, secrets.JWT_PRIVATE_SECRET, {
      ignoreExpiration: ignoreExpiry,
    }) as any;

    return { ...payload, expired: false };
  } catch (err) {
    if (err instanceof JsonWebTokenError) {
      if (err.message.includes("expired")) {
        const expiredPayload = jwt.verify(token, secrets.JWT_PRIVATE_SECRET, {
          ignoreExpiration: true,
        }) as any;
        return { ...expiredPayload, expired: true };
      } else if (err.message.includes("malformed")) {
        throw throwJWTokenError(
          messages.error.JWTMalformed,
          err.stack,
          SpentAPIExceptionCodes.INVALID_JWT
        );
      }
    } else {
      throw throwJWTokenError(
        messages.error.JWTError,
        (err as Error).stack,
        SpentAPIExceptionCodes.JWT_ERROR
      );
    }
  }
};

export default { password, JWToken };
