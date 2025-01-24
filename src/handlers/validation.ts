import { AnyZodObject } from "zod";
import { Request, Response, NextFunction, RequestHandler } from "express";

import { throwUnprocessableEntityError } from "../errors";
import { SpentAPIExceptionCodes } from "../types/enums";
import { messages } from "../constants";

const handle: ValidationHandler =
  (schema: AnyZodObject): RequestHandler =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log(req.body);
      const validatedBody = schema.parse(req.body);
      req.body.validated = validatedBody;
      next();
    } catch (err) {
      next(
        throwUnprocessableEntityError(
          messages.error.ZodError,
          (err as any).issues,
          SpentAPIExceptionCodes.VALIDATION_ERROR
        )
      );
    }
  };

export type ValidationHandler = (schema: AnyZodObject) => RequestHandler;

export default { handle };
