import { Router } from "express";
import authRouter from "./auth";
import clientRouter from "./business";
import appVerification from "src/handlers/app-verification";

const rootRouter = Router();

rootRouter.use(appVerification.handle);

rootRouter.use("/auth", authRouter);
rootRouter.use("/client", clientRouter);

export default rootRouter;
