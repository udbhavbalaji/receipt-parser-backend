import * as jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { messages, secrets } from "src/constants";
import { throwBadRequestError, throwJWTokenError } from "src/errors";
import { SpentAPIExceptionCodes } from "src/types/enums";
import { JsonWebTokenError } from "jsonwebtoken";

const password = (plain: string, hashed: string): Promise<boolean> => {
  return bcrypt.compare(plain, hashed).catch((err) => {
    throw throwBadRequestError(
      messages.InvalidCredentialsErrorMessage,
      SpentAPIExceptionCodes.INVALID_PASSWORD
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
    if (err instanceof JsonWebTokenError) {
      if (err.message.includes("expired")) {
        throw throwJWTokenError(
          "JWT expired",
          err.stack,
          SpentAPIExceptionCodes.JWT_EXPIRED
        );
      } else if (err.message.includes("malformed")) {
        throw throwJWTokenError(
          "JWT malformed",
          err.stack,
          SpentAPIExceptionCodes.INVALID_JWT
        );
      }
    } else {
      throw throwJWTokenError(
        "Something went wrong while verifying JWT.",
        (err as Error).stack,
        SpentAPIExceptionCodes.JWT_ERROR
      );
    }
  }
};

export default { password, JWToken };
