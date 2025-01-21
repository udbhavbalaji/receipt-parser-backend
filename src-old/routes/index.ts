import { Router } from "express";
import authRouter from "./auth";
import clientRouter from "./business";

const rootRouter = Router();

rootRouter.use("/auth", authRouter);
rootRouter.use("/client", clientRouter);

export default rootRouter;
