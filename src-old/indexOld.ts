import bodyParser from "body-parser";
import express, { Application } from "express";
import cors from "cors";

import { secrets } from "./constants";
import apiRoutes from "./routes";
import { error } from "./controllers";

const app: Application = express();

app.use(bodyParser.json());
app.use(cors());

app.use("/api", apiRoutes);

app.use(error.controller);

app.listen(secrets.PORT, () => {
  console.log(
    "App listening on http://localhost:3000/endpoint/name\n\nTracking changes in repository"
  );
});
