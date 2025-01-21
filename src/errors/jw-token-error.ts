import { HTTPStatusCodes, SpentAPIExceptionCodes } from "../types";
import SpentAPIException from "./spent-api-exception";

class JWTokenError extends SpentAPIException {
  constructor(
    message: string,
    errorCode?: SpentAPIExceptionCodes,
    errors?: any,
    statusCode?: HTTPStatusCodes
  ) {
    super(
      message,
      errorCode ?? SpentAPIExceptionCodes.JWT_ERROR,
      statusCode ?? HTTPStatusCodes.UNAUTHORIZED,
      errors,
      "JWTokenError"
    );
  }
}

export default JWTokenError;
