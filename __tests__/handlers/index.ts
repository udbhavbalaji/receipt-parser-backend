import bodyParser from "body-parser";
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import axios2 from "axios";
import { secrets } from "../../src/constants";
import SpentAPIException from "../../src/errors";

export const CreateExpressTestApp = () => {
  const app = express();

  app.use(bodyParser.json());
  app.use(cors());

  return app;
};

const axios = axios2.create({
  baseURL: "http://localhost:8000/api",
  validateStatus: (status) => true,
});

// export const TestErrorController = <T extends SpentAPIException>(
//   err: SpentAPIException | Error,
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   if (err instanceof SpentAPIException && err.name) {
//   // if (err instanceof SpentAPIException && err.name === "BadRequestError") {
//     res.status(err.statusCode).json({
//       message: err.message,
//       type: "error",
//       status: err.statusCode,
//       errorCode: err.errorCode,
//     });
//   } else throw err;
// };

export const TestErrorController =
  (expErrName: string) =>
  (
    err: SpentAPIException | Error,
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    if (err instanceof SpentAPIException && err.name === expErrName) {
      res.status(err.statusCode).json({
        message: err.message,
        type: "error",
        status: err.statusCode,
        errorCode: err.errorCode,
      });
    } else throw err;
  };

export default axios;
