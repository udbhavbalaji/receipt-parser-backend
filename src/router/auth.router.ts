import { Router } from "express";

import handle from "../handlers";
import { auth } from "../controllers";
import { RegisterRequestSchema, UserLoginSchema } from "../schema";

const authRouter: Router = Router();

authRouter.post(
  "/register",
  handle.appVerification,
  handle.validation(RegisterRequestSchema),
  handle.errors(auth.handleRegister)
);

authRouter.put(
  "/login",
  handle.appVerification,
  handle.validation(UserLoginSchema),
  handle.errors(auth.handleLogin)
);

authRouter.get(
  "/me",
  handle.appVerification,
  handle.auth(),
  handle.errors(auth.handleMe)
);

authRouter.put(
  "/logout",
  handle.appVerification,
  handle.auth(true),
  handle.errors(auth.handleLogout)
);

authRouter.delete(
  "/delete",
  handle.appVerification,
  handle.auth(),
  handle.errors(auth.handleDelete)
);

export default authRouter;
