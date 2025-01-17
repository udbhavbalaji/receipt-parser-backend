import { AnyZodObject } from "zod";
import { Request, Response, NextFunction } from "express";

const handle = (schema: AnyZodObject) => {
  return (req: Request, res: Response, next: NextFunction) => {};
};

export default { handle };
