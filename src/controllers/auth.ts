import { Request, Response, NextFunction } from "express";
import { user as User } from "../models";
import {
  throwBadRequestError,
  throwForbiddenError,
  throwUnauthorizedActionError,
} from "../errors";
import { HTTPStatusCodes, SpentAPIExceptionCodes } from "../types/enums";
import { generate, transform, verify } from "../utils";
import { UserDB } from "../types/database";
import { UserRequest } from "../types/request";
import { messages } from "src/constants";
import db from "src/config/prisma/database";
import { LoginStatus } from "@prisma/client";

const handleRegisterUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const validatedUserDetails = req.body.validated;

  return db.user
    .exists({ email: validatedUserDetails.email })
    .then((exists) => {
      if (exists) {
        throw throwBadRequestError(
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
        throw throwForbiddenError(
          messages.info.UserAlreadyLoggedIn,
          SpentAPIExceptionCodes.USER_ALREADY_LOGGED_IN,
          user.lastGeneratedToken
        );
      }

      return verify
        .password(password, user.password)
        .then((isPasswordValid) => {
          if (!isPasswordValid) {
            throw throwUnauthorizedActionError(
              messages.error.InvalidCredentialsError,
              SpentAPIExceptionCodes.INCORRECT_PASSWORD
            );
          }
          return user;
        });
    })
    .then((user) => {
      const token = generate.JWToken(user.userId);
      return { user, token };
    })
    .then(({ user, token }) => {
      return db.user.logIn(user.userId, token).then(() => {
        return { status: HTTPStatusCodes.OK, responseBody: { token: token } };
      });
    });
};

// const handleRegisterUser = (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   const validatedUserDetails = req.body.validated;

//   return User.getByEmail(validatedUserDetails.email)
//     .then((user) => {
//       if (user) {
//         throw throwBadRequestError(
//           messages.info.UserAlreadyExists,
//           SpentAPIExceptionCodes.ALREADY_EXISTS
//         );
//       }

//       return `${validatedUserDetails.firstName[0].toUpperCase()}${validatedUserDetails.lastName[0].toUpperCase()}`;
//     })
//     .then((initials) => generate.userID(initials))
//     .then((userId) => {
//       return { ...validatedUserDetails, userId: userId };
//     })
//     .then(transform.camelToSnakeProperties<UserRequest, UserDB>)
//     .then(User.create)
//     .then(() => {
//       // res.sendStatus(HTTPStatusCodes.CREATED);
//       return { status: HTTPStatusCodes.CREATED };
//     });
// };

// const handleLogin = (req: Request, res: Response, next: NextFunction) => {
//   const { email, password } = req.body.validated;

//   return User.getByEmail(email, [
//     "user_id",
//     "password",
//     "logged_in",
//     "last_generated_token",
//   ])
//     .then((user) => {
//       if (!user) {
//         throw throwBadRequestError(
//           messages.info.UserNotFound,
//           SpentAPIExceptionCodes.NOT_FOUND
//         );
//       } else if (user.logged_in === "Y") {
//         throw throwForbiddenError(
//           messages.info.UserAlreadyLoggedIn,
//           SpentAPIExceptionCodes.USER_ALREADY_LOGGED_IN,
//           user.last_generated_token
//         );
//       }

//       return user;
//     })
//     .then((user) => {
//       return verify.password(password, user.password).then((verified) => {
//         if (!verified) {
//           throw throwBadRequestError(
//             messages.error.InvalidCredentialsError,
//             SpentAPIExceptionCodes.INCORRECT_PASSWORD
//           );
//         }
//         return user;
//       });
//     })
//     .then((user) => {
//       const token = generate.JWToken(user.user_id);
//       return { user, token };
//     })
//     .then(({ user, token }) => {
//       return User.logIn(user.user_id, token).then(() => {
//         return token;
//       });
//     })
//     .then((token) => {
//       return { status: HTTPStatusCodes.OK, responseBody: { token: token } };
//     });
// };

const handleMe = (req: Request, res: Response, next: NextFunction) => {
  const userId = req.headers.user_id as string;

  return db.user.getMe(userId).then((user) => {
    return { status: HTTPStatusCodes.OK, responseBody: { user } };
  });
};

// const handleMe = (req: Request, res: Response, next: NextFunction) => {
//   const userId = req.headers.user_id as string;

//   return User.getByID(userId, [
//     "first_name",
//     "last_name",
//     "email",
//     "user_id",
//     "logged_in",
//   ])
//     .then((user) => {
//       if (!user) {
//         throw throwUnauthorizedActionError(
//           messages.warn.AuthHandlerMalfunction,
//           SpentAPIExceptionCodes.JWT_ERROR
//         );
//       }
//       return transform.snakeToCamelProperties(user);
//     })
//     .then((user) => {
//       return { status: HTTPStatusCodes.OK, responseBody: { user } };
//     });
// };

const handleLogout = (req: Request, res: Response, next: NextFunction) => {
  const userId = req.headers.user_id as string;

  return db.user.logOut(userId).then(() => {
    return {
      status: HTTPStatusCodes.OK,
      responseBody: { message: messages.info.LogOut },
    };
  });
};

// const handleLogout = (req: Request, res: Response, next: NextFunction) => {
//   const userId = req.headers.user_id as string;

//   return User.logOut(userId).then(() => {
//     return {
//       status: HTTPStatusCodes.OK,
//       responseBody: { message: messages.info.LogOut },
//     };
//   });
// };

const handleDelete = (req: Request, res: Response, next: NextFunction) => {
  const userId = req.headers.user_id as string;

  return db.user.deleteById(userId).then(() => {
    return {
      status: HTTPStatusCodes.NO_CONTENT,
    };
  });
};

// const handleDeleteUser = (req: Request, res: Response, next: NextFunction) => {
//   const userId = req.headers.user_id as string;

//   return User.deleteById(userId).then(() => {
//     return {
//       status: HTTPStatusCodes.NO_CONTENT,
//     };
//   });
// };

export default {
  handleRegisterUser,
  handleLogin,
  handleMe,
  handleLogout,
  handleDelete,
};
