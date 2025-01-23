import { Category, Merchant, PrismaClient, SubCategory, User } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import db from "src/prisma";
import { HTTPStatusCodes, SpentAPIStringResponse } from "src/types";

const handleAddMerchant = () => {};

const handleGetMerchant = () => {};

const handleUpdateMerchant = () => {};

const handleGetMerchants = () => {};

const handleAddCategory = () => {};

const handleGetCategory = () => {};

const handleUpdateCategory = () => {};

const handleGetCategories = () => {};

const handleAddSubCategory = () => {};

const handleGetSubCategory = () => {};

const handleUpdateSubCategory = () => {};

const handleGetSubCategories = () => {};

type ExpenseModelTypes = "category" | "subCategory" | "merchant";

const handleAdd = (model: ExpenseModelTypes) => {
    return async (req: Request, res: Response, next: NextFunction) => {
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



// export default { handleAddCategory, handleGetCategory, handleAddMerchant, handleGetMerchant };
export default {
    handleAddMerchant,
    handleGetMerchant,
    handleUpdateMerchant,
    handleGetMerchants,
    handleAddCategory,
    handleGetCategory,
    handleUpdateCategory,
    handleGetCategories,
    handleAddSubCategory,
    handleGetSubCategory,
    handleUpdateSubCategory,
    handleGetSubCategories
};
