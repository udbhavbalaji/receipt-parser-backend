import { HTTPStatusCodes, SpentAPIExceptionCodes } from "../types/enums";
import SpentAPIException from "./SpentAPIException";

class BadRequestError extends SpentAPIException {
  constructor(
    message: string,
    errorCode: SpentAPIExceptionCodes,
    errors?: any,
    statusCode?: HTTPStatusCodes
  ) {
    super(
      message,
      errorCode,
      statusCode ?? HTTPStatusCodes.BAD_REQUEST,
      errors,
      "BadRequestError"
    );
  }
}

export default BadRequestError;
