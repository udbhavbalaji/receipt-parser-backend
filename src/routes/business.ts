import { Router } from "express";
import { auth, error, validation, verifyApp } from "../handlers";
import { client as controller } from "../controllers";
import { receipt } from "../schema";

const businessRouter = Router();

businessRouter.post(
  "/add-receipt",
  verifyApp.handle,
  auth.handle(),
  validation.handle(receipt),
  error.handle(controller.handleAddReceipt)
);

businessRouter.get(
  "/spending-summary",
  verifyApp.handle,
  auth.handle(),
  error.handle(controller.handleSpendingSummary)
);

export default businessRouter;
