import bodyParser from "body-parser";
import express, { Application } from "express";
import cors from "cors";

import apiRoutes from "./routes";
import { error } from "./controllers";

const CreateExpressApp = (): Application => {
  const app: Application = express();

  app.use(bodyParser.json());
  app.use(cors());

  app.use("/api", apiRoutes);

  app.use(error.controller);

  return app;
};

export default CreateExpressApp;
