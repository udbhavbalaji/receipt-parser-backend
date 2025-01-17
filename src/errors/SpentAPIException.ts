import { HTTPStatusCodes, SpentAPIExceptionCodes } from "../types/enums";

class SpentAPIException extends Error {
  message: string;
  name: string;
  errorCode: SpentAPIExceptionCodes;
  statusCode: HTTPStatusCodes;
  errors?: any;

  constructor(
    message: string,
    errorCode: SpentAPIExceptionCodes,
    statusCode: HTTPStatusCodes,
    errors?: any,
    name?: string
  ) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    this.message = message;
    this.errorCode = errorCode;
    this.statusCode = statusCode;
    this.errors = errors;
    this.name = name ?? "SpentAPIException";
  }
}

export default SpentAPIException;
