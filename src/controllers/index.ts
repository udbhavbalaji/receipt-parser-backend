import { Request, Response, NextFunction } from "express";

import auth from "./auth";
import client from "./client";
import error from "./error";
import expense from "./expense";
import { SpentAPISuccessResponse } from "../types";

export type SpentController = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<SpentAPISuccessResponse>;

export { auth, client, error, expense };
