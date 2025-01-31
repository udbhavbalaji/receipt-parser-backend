import { Request, Response, NextFunction } from "express";

import SpentAPIException, {
  throwInternalServerError,
  throwJSONParseError,
} from "../errors";
import { messages } from "../constants";
import { SpentAPIErrorResponse, SpentAPIExceptionCodes } from "../types";

export type SpentErrorController = (
  err: SpentAPIException | Error,
  req: Request,
  res: Response,
  next: NextFunction
) => void;

const controller: SpentErrorController = (
  err: SpentAPIException | Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let response: SpentAPIErrorResponse;
  if (err instanceof SpentAPIException) {
    response = {
      status: err.statusCode,
      type: "error",
      message: `${err.name}: ${err.message}`,
      errorCode: err.errorCode,
      errors: err.errors,
    };
  } else {
    let exception: SpentAPIException;
    if (err instanceof SyntaxError && "body" in err) {
      exception = throwJSONParseError(messages.error.JSONParseError, err.stack);
    } else {
      exception = throwInternalServerError(
        err.message,
        err.stack,
        SpentAPIExceptionCodes.INTERNAL_SERVER_ERROR
      );
    }
    response = {
      status: exception.statusCode,
      type: "error",
      message: `${exception.name}: ${exception.message}`,
      errorCode: exception.errorCode,
      errors: exception.errors,
    };
  }
  res.status(response.status).json(response);
};

export default { controller };
