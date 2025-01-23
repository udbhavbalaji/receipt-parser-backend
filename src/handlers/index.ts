import { RequestHandler } from "express";

import auth from "./auth";
import error from "./error";
import validation from "./validation";
import verifyApp from "./app-verification";
import { SpentController } from "../controllers";

export type AuthHandler = (ignoreTokenExpiry?: boolean) => RequestHandler;
export type ErrorHandler = (method: SpentController) => RequestHandler;

export { auth, error, validation, verifyApp };
