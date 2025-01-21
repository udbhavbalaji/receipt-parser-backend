import { HTTPStatusCodes, SpentAPIExceptionCodes } from "../types/enums";
import SpentAPIException from "./SpentAPIException";

class UnauthorizedActionError extends SpentAPIException {
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
      "UnauthorizedActionError"
    );
  }
}

export default UnauthorizedActionError;
