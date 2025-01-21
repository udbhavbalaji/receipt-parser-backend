import { Request, Response, NextFunction } from "express";

import { messages } from "../constants";
import {
  BadRequestError,
  ForbiddenError,
  UnauthorizedActionError,
} from "../errors";
import { SpentAPIExceptionCodes, HTTPStatusCodes } from "../types";
import { generate, verify } from "../utils";
import db, { LoginStatus } from "../prisma";

const handleRegister = (req: Request, res: Response, next: NextFunction) => {
  const validatedUserDetails = req.body.validated;

  return db.user
    .exists({ email: validatedUserDetails.email })
    .then((exists) => {
      if (exists) {
        throw new BadRequestError(
          messages.info.UserAlreadyExists,
          SpentAPIExceptionCodes.ALREADY_EXISTS
        );
      }

      return `${validatedUserDetails.firstName[0].toUpperCase()}${validatedUserDetails.lastName[0].toUpperCase()}`;
    })
    .then((initials) => generate.userID(initials))
    .then((userId) => {
      return { ...validatedUserDetails, userId: userId };
    })
    .then((user) => db.user.create({ data: { ...user } }))
    .then(() => {
      return { status: HTTPStatusCodes.CREATED };
    });
};

const handleLogin = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body.validated;

  return db.user
    .loginCheck(email)
    .then((user) => {
      if (user.loggedIn === LoginStatus.LOGGED_IN) {
        throw new ForbiddenError(
          messages.info.UserAlreadyLoggedIn,
          SpentAPIExceptionCodes.USER_ALREADY_LOGGED_IN,
          user.lastGeneratedToken
        );
      }

      return verify
        .password(password, user.password)
        .then((isPasswordValid) => {
          if (!isPasswordValid) {
            throw new UnauthorizedActionError(
              messages.error.InvalidCredentialsError,
              SpentAPIExceptionCodes.INCORRECT_PASSWORD
            );
          }
          return user;
        });
    })
    .then((user) => {
      const token = generate.JWToken(user.userId);

      return db.user.logIn(user.userId, token).then(() => {
        return { status: HTTPStatusCodes.OK, responseBody: { token } };
      });
    });
};

const handleMe = (req: Request, res: Response, next: NextFunction) => {
  const userId = req.headers.user_id as string;

  return db.user.getMe(userId).then((user) => {
    return { status: HTTPStatusCodes.OK, responseBody: { user } };
  });
};

const handleLogout = (req: Request, res: Response, next: NextFunction) => {
  const userId = req.headers.user_id as string;

  return db.user.logOut(userId).then(() => {
    return {
      status: HTTPStatusCodes.OK,
      responseBody: { message: messages.info.LogOut },
    };
  });
};

const handleDelete = (req: Request, res: Response, next: NextFunction) => {
  const userId = req.headers.user_id as string;

  return db.user
    .delete({
      where: {
        userId: userId,
      },
    })
    .then(() => {
      return { status: HTTPStatusCodes.NO_CONTENT };
    });
};
export default {
  handleRegister,
  handleLogin,
  handleMe,
  handleLogout,
  handleDelete,
};
