import { Request, Response, NextFunction } from "express";
import { AnyZodObject } from "zod";

import { SpentAPIExceptionCodes } from "../types";
import { messages } from "../constants";
import { UnprocessableEntityError } from "../errors";

const validationHandler = (schema: AnyZodObject) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedBody = schema.parse(req.body);
      req.body.validated = validatedBody;
      next();
    } catch (err) {
      next(
        new UnprocessableEntityError(
          messages.error.ZodError,
          SpentAPIExceptionCodes.VALIDATION_ERROR,
          (err as any).issues
        )
      );
    }
  };
};

export default validationHandler;
