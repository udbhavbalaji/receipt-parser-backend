import { Request, Response, NextFunction } from "express";
import db from "src/prisma";
import { HTTPStatusCodes, ReceiptRequest } from "src/types";
import { generate } from "src/utils";

const handleAddReceipt = (req: Request, res: Response, next: NextFunction) => {
  const receiptReq = req.body.validated as ReceiptRequest;
  const userId = req.headers.user_id as string;

  const receiptId = generate.receiptID(receiptReq);

  const receipt = {
    ["receiptId"]: receiptId,
    ["userId"]: userId,
    ...receiptReq,
  };

  const { items, ...processedReceipt } = receipt;

  return db.receipt.add(processedReceipt, items).then(() => {
    return { status: HTTPStatusCodes.CREATED };
  });
};

const handleGetReceipt = (req: Request, res: Response, next: NextFunction) => {
  const receiptId = req.params.receipt_id as string;
  const userId = req.headers.user_id as string;

  return db.receipt.get(receiptId, userId).then((receipt) => {
    return { status: HTTPStatusCodes.OK, responseBody: { ...receipt } };
  });
};

export default { handleAddReceipt, handleGetReceipt };
