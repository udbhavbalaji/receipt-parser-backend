import { HTTPStatusCodes, SpentAPIExceptionCodes } from "../types";
import SpentAPIException from "./spent-api-exception";

class JSONParseError extends SpentAPIException {
  constructor(
    message: string,
    errorCode?: SpentAPIExceptionCodes,
    errors?: any,
    statusCode?: HTTPStatusCodes
  ) {
    super(
      message,
      errorCode ?? SpentAPIExceptionCodes.JSON_PARSE_ERROR,
      statusCode ?? HTTPStatusCodes.BAD_REQUEST,
      errors,
      "JSONParseError"
    );
  }
}

export default JSONParseError;
