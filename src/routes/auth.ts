import { Router } from "express";
import { validation, error, auth, verifyApp } from "../handlers";
import { auth as authSchema } from "../schema";
import { auth as controller } from "../controllers";

const authRouter = Router();

authRouter.post(
  "/register",
  // verifyApp.handle,
  validation.handle(authSchema.registerSchema),
  error.handle(controller.handleRegister)
);

authRouter.put(
  "/login",
  // verifyApp.handle,
  validation.handle(authSchema.loginSchema),
  error.handle(controller.handleLogin)
);

authRouter.get(
  "/me",
  // verifyApp.handle,
  auth.handle(),
  error.handle(controller.handleMe)
);

authRouter.put(
  "/logout",
  // verifyApp.handle,
  auth.handle(true),
  error.handle(controller.handleLogout)
);

authRouter.delete(
  "/delete",
  verifyApp.handle,
  auth.handle(),
  error.handle(controller.handleDelete)
);

export default authRouter;
