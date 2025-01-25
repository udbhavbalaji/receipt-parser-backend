import { Router } from "express";
import { validation, error, auth, verifyApp } from "../handlers";
import { auth as authSchema } from "../schema";
import { auth as controller } from "../controllers";

const authRouter = Router();

authRouter.post(
  "/register",
  validation.handle(authSchema.registerSchema),
  error.handle(controller.handleRegister)
);

authRouter.put(
  "/login",
  validation.handle(authSchema.loginSchema),
  error.handle(controller.handleLogin)
);

authRouter.get("/me", auth.handle(), error.handle(controller.handleMe));

authRouter.put(
  "/logout",
  auth.handle(true),
  error.handle(controller.handleLogout)
);

authRouter.delete(
  "/delete",
  auth.handle(),
  error.handle(controller.handleDelete)
);

export default authRouter;
