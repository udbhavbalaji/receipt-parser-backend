import { HTTPStatusCodes, SpentAPIExceptionCodes } from "../types";
import SpentAPIException from "./spent-api-exception";

class ForbiddenError extends SpentAPIException {
  constructor(
    message: string,
    errorCode?: SpentAPIExceptionCodes,
    errors?: any,
    statusCode?: HTTPStatusCodes
  ) {
    super(
      message,
      errorCode ?? SpentAPIExceptionCodes.FORBIDDEN,
      statusCode ?? HTTPStatusCodes.FORBIDDEN,
      errors,
      "ForbiddenError"
    );
  }
}

export default ForbiddenError;
