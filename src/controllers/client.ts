import { Request, Response, NextFunction } from "express";
import { ReceiptDB } from "src/types/database";
import { ItemRequest, ReceiptRequest } from "src/types/request";
import { generate, transform } from "src/utils";
import { receipt as Receipt } from "../models";
import { HTTPStatusCodes } from "src/types/enums";

const handleAddReceipt = (req: Request, res: Response, next: NextFunction) => {
  const receipt = req.body.validated as ReceiptRequest;
  const userId = req.headers.user_id as string;

  const receiptId = generate.receiptID(receipt);

  return transform
    .camelToSnakeProperties({
      ["receiptId"]: receiptId,
      ["userId"]: userId,
      ...receipt,
    })
    .then((receipt) => {
      const items = receipt.items as ItemRequest[];
      delete receipt.items;

      const processedReceipt = receipt as ReceiptDB;

      return { processedReceipt, items };
    })
    .then(({ processedReceipt, items }) =>
      Receipt.create(processedReceipt, items)
    )
    .then(() => {
      return { status: HTTPStatusCodes.CREATED };
    });
};

const handleSpendingSummary = (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

export default { handleAddReceipt, handleSpendingSummary };
