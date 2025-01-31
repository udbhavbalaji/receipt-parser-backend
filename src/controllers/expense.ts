import {
  Category,
  Merchant,
  PrismaClient,
  SubCategory,
  User,
} from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import db from "src/prisma";
import {
  HTTPStatusCodes,
  SpentAPIArrayResponse,
  SpentAPIObjectResponse,
  SpentAPIStringResponse,
} from "src/types";

type ExpenseModelTypes = "category" | "subCategory" | "merchant";

const handleAdd = (model: ExpenseModelTypes) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<SpentAPIStringResponse> => {
    const validatedBody = req.body.validated;
    const userId = req.headers.user_id as string;

    const data = { ...validatedBody, userId };

    if (model === "merchant") {
      await db.merchant.create({ data: data });
    } else if (model === "category") {
      await db.category.create({ data: data });
    } else {
      await db.subCategory.create({ data: data });
    }

    const response: SpentAPIStringResponse = {
      status: HTTPStatusCodes.CREATED,
      type: "string",
      body: "Created",
    };

    return response;
  };
};

const handleGet = (model: ExpenseModelTypes) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<SpentAPIObjectResponse<Merchant | Category | SubCategory>> => {
    const userId = req.headers.user_id as string;
    const changeCase = await import("change-case");
    const id = req.params[`${changeCase.snakeCase(model)}_id`] as string;

    let data: Merchant | Category | SubCategory;

    if (model === "merchant") {
      data = await db.merchant.findFirstOrThrow({
        where: { name: id, userId },
      });
    } else if (model === "category") {
      data = await db.category.findFirstOrThrow({
        where: { name: id, userId },
      });
    } else {
      data = await db.subCategory.findFirstOrThrow({
        where: { name: id, userId },
      });
    }

    const response: SpentAPIObjectResponse<Merchant | Category | SubCategory> =
      {
        status: HTTPStatusCodes.OK,
        type: "object",
        body: data,
      };

    return response;
  };
};

const handleUpdate = (model: ExpenseModelTypes) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<SpentAPIStringResponse> => {
    const validatedBody = req.body.validated;
    const id = validatedBody[`${model}Id`] as string;

    const userId = req.headers.user_id as string;

    if (model === "merchant") {
      await db.merchant.update({
        where: { name: id, userId },
        data: validatedBody,
      });
    } else if (model === "category") {
      await db.category.update({
        where: { name: id, userId },
        data: validatedBody,
      });
    } else {
      await db.subCategory.update({
        where: { name: id, userId },
        data: validatedBody,
      });
    }

    const response: SpentAPIStringResponse = {
      status: HTTPStatusCodes.OK,
      type: "string",
      body: "Updated",
    };

    return response;
  };
};

const handleGetAll = (model: ExpenseModelTypes) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<SpentAPIArrayResponse<Merchant | Category | SubCategory>> => {
    const userId = req.headers.user_id as string;

    let data: Merchant[] | Category[] | SubCategory[];

    if (model === "merchant") {
      data = await db.merchant.findMany({
        where: { userId },
      });
    } else if (model === "category") {
      data = await db.category.findMany({
        where: { userId },
      });
    } else {
      data = await db.subCategory.findMany({
        where: { userId },
      });
    }

    const response: SpentAPIArrayResponse<Merchant | Category | SubCategory> = {
      status: HTTPStatusCodes.OK,
      type: "array",
      body: data,
    };

    return response;
  };
};

export default { handleAdd, handleGet, handleUpdate, handleGetAll };

// export default { handleAddCategory, handleGetCategory, handleAddMerchant, handleGetMerchant };
// export default {
//   handleAddMerchant,
//   handleGetMerchant,
//   handleUpdateMerchant,
//   handleGetMerchants,
//   handleAddCategory,
//   handleGetCategory,
//   handleUpdateCategory,
//   handleGetCategories,
//   handleAddSubCategory,
//   handleGetSubCategory,
//   handleUpdateSubCategory,
//   handleGetSubCategories,
// };
