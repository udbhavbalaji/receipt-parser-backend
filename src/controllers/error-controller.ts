import { Request, Response, NextFunction } from "express";

import { messages } from "../constants";
import SpentAPIException from "../errors/spent-api-exception";
import JSONParseError from "../errors/json-parse-error";
import { InternalServerError } from "../errors";
import { SpentAPIExceptionCodes } from "../types";

const errorController = (
  err: SpentAPIException | Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof SpentAPIException) {
    res.status(err.statusCode).json({
      message: `${err.name}: ${err.message}`,
      errorCode: err.errorCode,
      errors: err.errors,
    });
  } else {
    let exception: SpentAPIException;
    if (err instanceof SyntaxError && "body" in err) {
      exception = new JSONParseError(
        messages.error.JSONParseError,
        SpentAPIExceptionCodes.JSON_PARSE_ERROR,
        err.stack
      );
    } else {
      exception = new InternalServerError(
        err.message,
        SpentAPIExceptionCodes.INTERNAL_SERVER_ERROR,
        err.stack
      );
    }
    res.status(exception.statusCode).json({
      message: `${exception.name}: ${exception.message}`,
      errorCode: exception.errorCode,
      errors: exception.errors,
    });
  }
};

export default errorController;
