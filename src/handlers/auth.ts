import { Request, Response, NextFunction } from "express";

const handle = (ignoreTokenExpiry: boolean = false) => {
  return (req: Request, res: Response, next: NextFunction) => {};
};

export default { handle };
