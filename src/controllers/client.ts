import { Request, Response, NextFunction } from "express";

const handleAddReceipt = (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

const handleSpendingSummary = (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

export default { handleAddReceipt, handleSpendingSummary };
