import { HTTPStatusCodes, SpentAPIExceptionCodes } from "../types";
import SpentAPIException from "./spent-api-exception";

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
