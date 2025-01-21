import express, { Application } from "express";
import bodyParser from "body-parser";
import cors from "cors";

import apiRouter from "./router";
import { errorController } from "./controllers";

const CreateSpentApp = (): Application => {
  const app: Application = express();

  app.use(bodyParser.json());
  app.use(cors());

  app.use("/api", apiRouter);

  app.use(errorController);

  return app;
};

export default CreateSpentApp;
