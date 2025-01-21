import { Router } from "express";

import authRouter from "./auth.router";
import clientRouter from "./client.router";

const apiRouter: Router = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/client", clientRouter);

export default apiRouter;
