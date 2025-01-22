import { Request, Response, NextFunction, RequestHandler } from "express";
import {
  throwBadRequestError,
  throwForbiddenError,
  throwUnauthorizedActionError,
} from "../errors";
import { HTTPStatusCodes, SpentAPIExceptionCodes } from "../types/enums";
import { generate, verify } from "../utils";
import { messages } from "src/constants";
import db from "../prisma";
import { LoginStatus } from "@prisma/client";

export type SpentController = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<{ status: HTTPStatusCodes; responseBody?: Record<string, any> }>;

const handleRegister: SpentController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const validatedUserDetails = req.body.validated;

  const userExists = await db.user.exists({
    email: validatedUserDetails.email,
  });

  if (userExists) {
    throw throwBadRequestError(
      messages.info.UserAlreadyExists,
      SpentAPIExceptionCodes.ALREADY_EXISTS
    );
  }

  const initials = `${validatedUserDetails.firstName[0].toUpperCase()}${validatedUserDetails.lastName[0].toUpperCase()}`;

  const userId = generate.userID(initials);

  const user = { ...validatedUserDetails, userId: userId };

  await db.user.create({ data: { ...user } });

  return { status: HTTPStatusCodes.OK };
};

const handleLogin: SpentController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body.validated;

  const user = await db.user.loginCheck(email);

  if (user.loggedIn === LoginStatus.LOGGED_IN) {
    throw throwForbiddenError(
      messages.info.UserAlreadyLoggedIn,
      SpentAPIExceptionCodes.USER_ALREADY_LOGGED_IN,
      user.lastGeneratedToken
    );
  }

  const isPasswordValid = await verify.password(password, user.password);

  if (!isPasswordValid) {
    throw throwUnauthorizedActionError(
      messages.error.InvalidCredentialsError,
      SpentAPIExceptionCodes.INCORRECT_PASSWORD
    );
  }

  const token = generate.JWToken(user.userId);

  await db.user.logIn(user.userId, token);

  return { status: HTTPStatusCodes.OK, responseBody: { token: token } };
};

const handleMe: SpentController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.headers.user_id as string;

  // const user = await db.user.getMe(userId);
  const user = await db.user.findFirstOrThrow({
    omit: {
      password: true,
      lastGeneratedToken: true,
      id: true,
    },
    where: {
      userId,
    },
  });

  return { status: HTTPStatusCodes.OK, responseBody: { user } };
};

const handleLogout: SpentController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.headers.user_id as string;

  await db.user.logOut(userId);

  return {
    status: HTTPStatusCodes.OK,
    responseBody: { message: messages.info.LogOut },
  };
};

const handleDelete: SpentController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.headers.user_id as string;

  await db.user.delete({ where: { userId: userId } });

  return { status: HTTPStatusCodes.NO_CONTENT };
};

export default {
  handleRegister,
  handleLogin,
  handleMe,
  handleLogout,
  handleDelete,
};
