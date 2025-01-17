import { Request, Response, NextFunction } from "express";

const handle = (method: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {};
};

export default { handle };
