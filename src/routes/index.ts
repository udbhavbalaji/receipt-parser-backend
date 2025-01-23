import { Router } from "express";
import authRouter from "./auth";
import clientRouter from "./business";
import expenseRouter from "./expense";
import { verifyApp } from "../handlers";

const rootRouter = Router();

rootRouter.use(verifyApp.handle);

rootRouter.use("/auth", authRouter);
rootRouter.use("/client", clientRouter);
rootRouter.use('/expenses', expenseRouter)

export default rootRouter;
