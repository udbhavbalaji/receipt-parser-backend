import { Request, Response, NextFunction } from "express";
import { ReceiptDB } from "src/types/database";
import { ItemRequest, ReceiptRequest } from "src/types/request";
import { generate, transform } from "src/utils";
import { receipt as Receipt } from "../models";
import { HTTPStatusCodes, SpentAPIExceptionCodes } from "src/types/enums";
import { throwBadRequestError } from "src/errors";
import { messages } from "src/constants";

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

const handleGetReceipt = (req: Request, res: Response, next: NextFunction) => {
  const receiptId = req.params.receipt_id as string;
  const userId = req.headers.user_id as string;

  return Receipt.get(receiptId, userId)
    .then((receipt) => {
      if (!receipt) {
        throw throwBadRequestError(
          messages.info.ReceiptNotFound,
          SpentAPIExceptionCodes.NOT_FOUND
        );
      }
      return receipt;
    })
    .then(transform.snakeToCamelProperties)
    .then((receipt) => {
      return { status: HTTPStatusCodes.OK, responseBody: { ...receipt } };
    });
};

const handleSpendingSummary = (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

export default { handleAddReceipt, handleSpendingSummary, handleGetReceipt };
