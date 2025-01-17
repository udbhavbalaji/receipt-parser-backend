import { Request, Response, NextFunction } from "express";
import SpentAPIException from "../errors/SpentAPIException";
import { throwInternalServerError, throwJSONParseError } from "../errors";
import { SpentAPIExceptionCodes } from "../types/enums";

const controller = (
  err: SpentAPIException | Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof SpentAPIException) {
    res.status(err.statusCode).json({
      message: err.message,
      errorCode: err.errorCode,
      errors: err.errors,
    });
  } else {
    let exception: SpentAPIException;
    if (err instanceof SyntaxError && "body" in err) {
      exception = throwJSONParseError(
        "request body has a syntax error and couldn't be processed",
        err.stack
      );
    } else {
      exception = throwInternalServerError(
        err.message,
        err.stack,
        SpentAPIExceptionCodes.INTERNAL_SERVER_ERROR
      );
    }
    res.status(exception.statusCode).json({
      message: exception.message,
      errorCode: exception.errorCode,
      errors: exception.errors,
    });
  }
};

export default { controller };
