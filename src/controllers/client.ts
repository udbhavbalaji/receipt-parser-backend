import { Request, Response, NextFunction } from "express";
import { ReceiptRequest } from "src/types/request";
import { generate } from "src/utils";
import { HTTPStatusCodes } from "src/types/enums";
import db from "../prisma";
import { SpentController } from "./auth";

const handleAddReceipt: SpentController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const receipt = req.body.validated as ReceiptRequest;
  const userId = req.headers.user_id as string;

  const receiptId = generate.receiptID(receipt);

  const updatedReceipt = { ...receipt, userId, receiptId };

  const { items, ...processedReceipt } = updatedReceipt;

  await db.receipt.add(processedReceipt, items);

  return { status: HTTPStatusCodes.CREATED };
};

const handleGetReceipt: SpentController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const receiptId = req.params.receipt_id as string;
  const userId = req.headers.user_id as string;

  const receipt = await db.receipt.findFirstOrThrow({
    where: {
      receiptId,
      userId,
    },
  });

  return { status: HTTPStatusCodes.OK, responseBody: { ...receipt } };
};

const handleSpendingSummary: SpentController = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  return Promise.resolve({ status: HTTPStatusCodes.NOT_IMPLEMENTED });
};

export default { handleAddReceipt, handleSpendingSummary, handleGetReceipt };
