import { Router } from "express";

import handle from "../handlers";
import { client } from "../controllers";
import ReceiptRequestSchema from "../schema/receipt-request";

const clientRouter: Router = Router();

clientRouter.post(
  "/add-receipt",
  handle.appVerification,
  handle.auth(),
  handle.validation(ReceiptRequestSchema),
  handle.errors(client.handleAddReceipt)
);

clientRouter.post(
  "/get-receipt",
  handle.appVerification,
  handle.auth(),
  handle.errors(client.handleGetReceipt)
);

export default clientRouter;
