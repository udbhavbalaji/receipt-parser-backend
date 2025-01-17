import { HTTPStatusCodes, SpentAPIExceptionCodes } from "../types/enums";
import BadRequestError from "./BadRequestError";
import ForbiddenError from "./ForbiddenError";
import InternalServerError from "./InternalServerError";

const throwJSONParseError = (
  message: string,
  errors?: any,
  errorCode?: SpentAPIExceptionCodes,
  statusCode?: HTTPStatusCodes
) => {
  return new BadRequestError(
    message,
    errorCode ?? SpentAPIExceptionCodes.JSON_PARSE_ERROR,
    errors,
    statusCode
  );
};

const throwInternalServerError = (
  message: string,
  errors?: any,
  errorCode?: SpentAPIExceptionCodes,
  statusCode?: HTTPStatusCodes
) => {
  return new InternalServerError(
    message,
    errorCode ?? SpentAPIExceptionCodes.INTERNAL_SERVER_ERROR,
    errors,
    statusCode
  );
};

const throwForbiddenError = (
  message: string,
  errorCode?: SpentAPIExceptionCodes,
  errors?: any,
  statusCode?: HTTPStatusCodes
) => {
  return new ForbiddenError(
    message,
    errorCode ?? SpentAPIExceptionCodes.UNVERIFIED_APP,
    errors,
    statusCode
  );
};

export { throwJSONParseError, throwInternalServerError, throwForbiddenError };
