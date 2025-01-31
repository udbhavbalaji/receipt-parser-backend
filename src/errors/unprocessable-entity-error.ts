import { HTTPStatusCodes, SpentAPIExceptionCodes } from "../types";
import SpentAPIException from "./spent-api-exception";

class UnprocessableEntityError extends SpentAPIException {
  constructor(
    message: string,
    errorCode: SpentAPIExceptionCodes,
    errors?: any,
    statusCode?: HTTPStatusCodes
  ) {
    super(
      message,
      errorCode,
      statusCode ?? HTTPStatusCodes.UNPROCESSABLE_CONTENT,
      errors,
      "UnprocessableEntityError"
    );
  }
}

export default UnprocessableEntityError;
