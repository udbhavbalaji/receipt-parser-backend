import bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { JsonWebTokenError } from "jsonwebtoken";

import { messages, secrets } from "../constants";
import { SpentAPIExceptionCodes } from "../types";
import JWTokenError from "../errors/jw-token-error";
import BadRequestError from "../errors/bad-request-error";

const password = (plain: string, hashed: string): Promise<boolean> => {
  return bcrypt.compare(plain, hashed).catch((err) => {
    throw new BadRequestError(
      messages.error.InvalidCredentialsError,
      SpentAPIExceptionCodes.INCORRECT_PASSWORD
    );
  });
};

const JWToken = (token: string, ignoreExpiry: boolean = false) => {
  try {
    const payload = jwt.verify(token, secrets.JWT_PRIVATE_SECRET, {
      ignoreExpiration: ignoreExpiry,
    }) as any;
    return payload;
  } catch (err) {
    // todo: if jwt is expired, then we send a payload back with a retry/expired property set to true.
    if (err instanceof JsonWebTokenError) {
      if (err.message.includes("expired")) {
        // throw new JWTokenError(
        //   messages.error.JWTExpired,
        //   SpentAPIExceptionCodes.JWT_EXPIRED,
        //   err.stack
        // );
        return { retry: true };
      } else if (err.message.includes("malformed")) {
        throw new JWTokenError(
          messages.error.JWTMalformed,
          SpentAPIExceptionCodes.INVALID_JWT,
          err.stack
        );
      }
    } else {
      throw new JWTokenError(
        messages.error.JWTError,
        SpentAPIExceptionCodes.JWT_ERROR,
        (err as Error).stack
      );
    }
  }
};

export default { password, JWToken };
