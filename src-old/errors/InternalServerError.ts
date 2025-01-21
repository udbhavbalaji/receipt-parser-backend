import { HTTPStatusCodes, SpentAPIExceptionCodes } from "../types/enums";
import SpentAPIException from "./SpentAPIException";

class InternalServerError extends SpentAPIException {
  constructor(
    message: string,
    errorCode: SpentAPIExceptionCodes,
    errors?: any,
    statusCode?: HTTPStatusCodes
  ) {
    super(
      message,
      errorCode,
      statusCode ?? HTTPStatusCodes.INTERNAL_SERVER_ERROR,
      errors,
      "InternalServerError"
    );
  }
}

export default InternalServerError;
