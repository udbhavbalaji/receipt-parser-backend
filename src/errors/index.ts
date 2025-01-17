import { HTTPStatusCodes, SpentAPIExceptionCodes } from "../types/enums";
import BadRequestError from "./BadRequestError";
import ForbiddenError from "./ForbiddenError";
import InternalServerError from "./InternalServerError";
import SpentDatabaseError from "./SpentDatabaseError";

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

const throwSpentDatabaseError = (
  message: string,
  errors?: any,
  errorCode?: SpentAPIExceptionCodes,
  statusCode?: HTTPStatusCodes
) => {
  return new SpentDatabaseError(
    message,
    errorCode ?? SpentAPIExceptionCodes.GENERIC_DATABASE_ERROR,
    errors,
    statusCode
  );
};

const throwDatabaseQueryError = (err: any) => {
  let errorProps: Partial<SpentDatabaseError> = {};

  const errorMessage = err.message.toLowerCase();

  if (errorMessage.includes("sqlite_error")) {
    if (errorMessage.includes("no such table")) {
      const errTable = err.message.split(": ")[2];
      errorProps.message = `SQLITE_ERROR: no such table: ${errTable}`;
      errorProps.errorCode = SpentAPIExceptionCodes.NOT_FOUND;
      errorProps.statusCode = HTTPStatusCodes.NOT_FOUND;
      errorProps.errors = err.stack;
    } else if (errorMessage.includes("no such column")) {
      const errCol = err.message.split(": ")[2];
      errorProps.message = `SQLITE_ERROR: no such column: ${errCol}`;
      errorProps.errorCode = SpentAPIExceptionCodes.NOT_FOUND;
      errorProps.statusCode = HTTPStatusCodes.NOT_FOUND;
      errorProps.errors = err.stack;
    } else {
      errorProps.message = "SQLITE_ERROR: Query error";
      errorProps.errorCode = SpentAPIExceptionCodes.GENERIC_DATABASE_ERROR;
      errorProps.statusCode = HTTPStatusCodes.BAD_REQUEST;
      errorProps.errors = err.stack;
    }
  } else if (errorMessage.includes("sqlite_constraint")) {
    errorProps.message = "SQLITE_ERROR: Constraint Error";
    errorProps.errorCode = SpentAPIExceptionCodes.GENERIC_DATABASE_ERROR;
    errorProps.statusCode = HTTPStatusCodes.INTERNAL_SERVER_ERROR;
    errorProps.errors = err.stack;
  } else {
    errorProps.message = err.message;
    errorProps.errorCode = SpentAPIExceptionCodes.GENERIC_DATABASE_ERROR;
    errorProps.statusCode = HTTPStatusCodes.INTERNAL_SERVER_ERROR;
    errorProps.errors = err.stack;
  }

  return throwSpentDatabaseError(
    errorProps.message ?? "Query Error",
    errorProps.errors,
    errorProps.errorCode,
    errorProps.statusCode
  );
};

const throwDatabaseManipulationError = (err: any) => {
  let errorProps: Partial<SpentDatabaseError> = {};

  const errorMessage = err.message.toLowerCase();
  if (errorMessage.includes("sqlite_constraint")) {
    if (errorMessage.includes("unique constraint failed")) {
      const errCol = err.message.split(": ")[2];
      errorProps.message = `Unique constraint failed on ${errCol}`;
      errorProps.errorCode = SpentAPIExceptionCodes.ALREADY_EXISTS;
      errorProps.statusCode = HTTPStatusCodes.BAD_REQUEST;
      errorProps.errors = (err as Error).stack;
    } else if (errorMessage.includes("check constraint failed")) {
      const errCol = err.message.split(": ")[2];
      errorProps.message = `Check constraint failed on ${errCol}`;
      errorProps.errorCode = SpentAPIExceptionCodes.CHECK_CONSTRAINT_FAILED;
      errorProps.statusCode = HTTPStatusCodes.BAD_REQUEST;
      errorProps.errors = (err as Error).stack;
    } else if (errorMessage.includes("foreign key constraint failed")) {
      errorProps.message = `Foreign key constraint failed`;
      errorProps.errorCode =
        SpentAPIExceptionCodes.FOREIGN_KEY_CONSTRAINT_FAILED;
      errorProps.statusCode = HTTPStatusCodes.BAD_REQUEST;
      errorProps.errors = (err as Error).stack;
    } else if (errorMessage.includes("not null constraint failed")) {
      const errCol = err.message.split(": ")[2];
      errorProps.message = `NOT NULL constraint failed on: ${errCol}`;
      errorProps.errorCode = SpentAPIExceptionCodes.NOT_NULL_CONSTRAINT_FAILED;
      errorProps.statusCode = HTTPStatusCodes.BAD_REQUEST;
      errorProps.errors = (err as Error).stack;
    } else {
      errorProps.message = "SQLITE_CONSTRAINT: Error while manipulating data";
      errorProps.errorCode = SpentAPIExceptionCodes.GENERIC_DATABASE_ERROR;
      errorProps.statusCode = HTTPStatusCodes.INTERNAL_SERVER_ERROR;
      errorProps.errors = (err as Error).stack;
    }
  } else if (errorMessage.includes("sqlite_mismatch")) {
    errorProps.message = "Data type mismatch";
    errorProps.errorCode = SpentAPIExceptionCodes.UNPROCESSABLE_CONTENT;
    errorProps.statusCode = HTTPStatusCodes.UNPROCESSABLE_CONTENT;
    errorProps.errors = (err as Error).stack;
  } else if (errorMessage.includes("sqlite_range")) {
    errorProps.message =
      "BindingError: Error while binding variables for data manipulation";
    errorProps.errorCode = SpentAPIExceptionCodes.BINDING_ERROR;
    errorProps.statusCode = HTTPStatusCodes.INTERNAL_SERVER_ERROR;
    errorProps.errors = (err as Error).stack;
  } else {
    errorProps.message = "SQLITE_ERROR";
    errorProps.errorCode = SpentAPIExceptionCodes.GENERIC_DATABASE_ERROR;
    errorProps.statusCode = HTTPStatusCodes.INTERNAL_SERVER_ERROR;
    errorProps.errors = (err as Error).stack;
  }
  return throwSpentDatabaseError(
    errorProps.message,
    errorProps.errors,
    errorProps.errorCode,
    errorProps.statusCode
  );
};

const throwBadRequestError = (
  message: string,
  errorCode?: SpentAPIExceptionCodes,
  errors?: any,
  statusCode?: HTTPStatusCodes
) => {
  return new BadRequestError(
    message,
    errorCode ?? SpentAPIExceptionCodes.BAD_REQUEST,
    errors,
    statusCode
  );
};

export {
  throwJSONParseError,
  throwInternalServerError,
  throwForbiddenError,
  throwDatabaseQueryError,
  throwDatabaseManipulationError,
  throwBadRequestError,
};
