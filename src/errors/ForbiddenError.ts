import { HTTPStatusCodes, SpentAPIExceptionCodes } from "../types/enums";
import SpentAPIException from "./SpentAPIException";

class ForbiddenError extends SpentAPIException {
  constructor(
    message: string,
    errorCode: SpentAPIExceptionCodes,
    errors?: any,
    statusCode?: HTTPStatusCodes
  ) {
    super(
      message,
      errorCode,
      statusCode ?? HTTPStatusCodes.FORBIDDEN,
      errors,
      "ForbiddenError"
    );
  }
}

export default ForbiddenError;
