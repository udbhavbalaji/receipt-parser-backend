import { Request, Response, NextFunction } from "express";

import { generate } from "../utils";
import db, { Receipt } from "../prisma";
import { SpentController } from ".";
import {
  SpentAPINullResponse,
  SpentAPIObjectResponse,
  SpentAPIStringResponse,
  HTTPStatusCodes,
  ReceiptRequest,
} from "../types";

const handleAddReceipt: SpentController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<SpentAPIStringResponse> => {
  const receipt = req.body.validated as ReceiptRequest;
  const userId = req.headers.user_id as string;

  const receiptId = generate.receiptID(receipt);

  const updatedReceipt = { ...receipt, userId, receiptId };

  const { items, ...processedReceipt } = updatedReceipt;

  await db.receipt.add(processedReceipt, items);

  const response: SpentAPIStringResponse = {
    status: HTTPStatusCodes.CREATED,
    type: "string",
    body: "Created",
  };

  return response;
};

const handleGetReceipt: SpentController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<SpentAPIObjectResponse<Receipt>> => {
  const receiptId = req.params.receipt_id as string;
  const userId = req.headers.user_id as string;

  const receipt = await db.receipt.findFirstOrThrow({
    where: {
      receiptId,
      userId,
    },
  });

  const response: SpentAPIObjectResponse<Receipt> = {
    status: HTTPStatusCodes.OK,
    type: "object",
    body: { ...receipt },
  };

  return response;
};

const handleSpendingSummary: SpentController = (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<SpentAPINullResponse> => {
  const response: SpentAPINullResponse = {
    status: HTTPStatusCodes.NOT_IMPLEMENTED,
    type: "null",
    body: null,
  };

  return Promise.resolve(response);
};

export default { handleAddReceipt, handleSpendingSummary, handleGetReceipt };
