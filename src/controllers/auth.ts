import { Request, Response, NextFunction } from "express";

import {
  throwBadRequestError,
  throwForbiddenError,
  throwUnauthorizedActionError,
} from "../errors";
import { generate, verify } from "../utils";
import { messages } from "../constants";
import db, { PublicUser, LoginStatus } from "../prisma";
import {
  SpentAPINullResponse,
  SpentAPIObjectResponse,
  SpentAPIStringResponse,
  HTTPStatusCodes,
  SpentAPIExceptionCodes,
} from "../types";
import { SpentController } from ".";

const handleRegister: SpentController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<SpentAPIStringResponse> => {
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

  const response: SpentAPIStringResponse = {
    status: HTTPStatusCodes.CREATED,
    type: "string",
    body: "Created",
  };

  return response;
};

const handleLogin: SpentController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<SpentAPIObjectResponse<{ token: string }>> => {
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

  const response: SpentAPIObjectResponse<{ token: string }> = {
    status: HTTPStatusCodes.OK,
    type: "object",
    body: { token: token },
  };

  return response;
};

const handleMe: SpentController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<SpentAPIObjectResponse<{ user: PublicUser }>> => {
  const userId = req.headers.user_id as string;

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

  const response: SpentAPIObjectResponse<{ user: PublicUser }> = {
    status: HTTPStatusCodes.OK,
    type: "object",
    body: { user },
  };

  return response;
};

const handleLogout: SpentController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<SpentAPIStringResponse> => {
  const userId = req.headers.user_id as string;

  await db.user.logOut(userId);

  const response: SpentAPIStringResponse = {
    status: HTTPStatusCodes.OK,
    type: "string",
    body: messages.info.LogOut,
  };

  return response;
};

const handleDelete: SpentController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<SpentAPINullResponse> => {
  const userId = req.headers.user_id as string;

  await db.user.delete({ where: { userId: userId } });

  const response: SpentAPINullResponse = {
    status: HTTPStatusCodes.NO_CONTENT,
    type: "null",
    body: null,
  };

  return response;
};

export default {
  handleRegister,
  handleLogin,
  handleMe,
  handleLogout,
  handleDelete,
};
