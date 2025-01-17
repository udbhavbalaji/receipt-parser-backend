import { Request, Response, NextFunction } from "express";

const handleRegisterUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

const handleLogin = (req: Request, res: Response, next: NextFunction) => {};

const handleMe = (req: Request, res: Response, next: NextFunction) => {};

const handleLogout = (req: Request, res: Response, next: NextFunction) => {};

const handleDeleteUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

export default {
  handleRegisterUser,
  handleLogin,
  handleMe,
  handleLogout,
  handleDeleteUser,
};
