import { Router } from "express";
import { validation, error, auth, verifyApp } from "../handlers";
import { login, register } from "../schema";
import { auth as controller } from "../controllers";

const authRouter = Router();

authRouter.post(
  "/register-user",
  verifyApp.handle,
  // validation.handle(register),
  error.handle(controller.handleRegisterUser)
);

authRouter.put(
  "/login",
  verifyApp.handle,
  validation.handle(login),
  error.handle(controller.handleLogin)
);

authRouter.get(
  "/me",
  verifyApp.handle,
  auth.handle(),
  error.handle(controller.handleMe)
);

authRouter.put(
  "/logout",
  verifyApp.handle,
  auth.handle(true),
  error.handle(controller.handleLogout)
);

authRouter.delete(
  "/delete",
  verifyApp.handle,
  auth.handle(),
  error.handle(controller.handleDeleteUser)
);

export default authRouter;
