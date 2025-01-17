import { AnyZodObject } from "zod";
import { Request, Response, NextFunction } from "express";
import { throwUnprocessableEntityError } from "src/errors";
import { SpentAPIExceptionCodes } from "src/types/enums";

const handle = (schema: AnyZodObject) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedBody = schema.parse(req.body);
      req.body.validated = validatedBody;
      next();
    } catch (err) {
      next(
        throwUnprocessableEntityError(
          "Request body data is invalid. Check all fields and try again",
          (err as any).issues,
          SpentAPIExceptionCodes.VALIDATION_ERROR
        )
      );
    }
  };
};

export default { handle };
