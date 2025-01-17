import { Request, Response, NextFunction } from "express";
import { user } from "../models";
import { throwBadRequestError } from "../errors";
import { HTTPStatusCodes, SpentAPIExceptionCodes } from "../types/enums";
import { generate, transform } from "../utils";
import { UserDB } from "../types/database";
import { UserRequest } from "../types/request";

const handleRegisterUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const validatedUserDetails = req.body.validated;

  return user
    .getByEmail(validatedUserDetails.email)
    .then((user) => {
      if (user) {
        throw throwBadRequestError(
          "User already exists",
          SpentAPIExceptionCodes.ALREADY_EXISTS
        );
      }

      return `${validatedUserDetails.firstName[0].toUpperCase()}${validatedUserDetails.lastName[0].toUpperCase()}`;
    })
    .then((initials) => generate.userID(initials))
    .then((userId) => {
      return { ...validatedUserDetails, userId: userId };
    })
    .then(transform.camelToSnakeProperties<UserRequest, UserDB>)
    .then(user.create)
    .then(() => {
      res.sendStatus(HTTPStatusCodes.CREATED);
      // return { status: HTTPStatusCodes.CREATED };
    });
};

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
