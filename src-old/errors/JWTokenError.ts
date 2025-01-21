import { HTTPStatusCodes, SpentAPIExceptionCodes } from "../types/enums";
import SpentAPIException from "./SpentAPIException";

class JWTokenError extends SpentAPIException {
  constructor(
    message: string,
    errorCode: SpentAPIExceptionCodes,
    errors?: any,
    statusCode?: HTTPStatusCodes
  ) {
    super(
      message,
      errorCode,
      statusCode ?? HTTPStatusCodes.UNAUTHORIZED,
      errors,
      "JWTokenError"
    );
  }
}

export default JWTokenError;
