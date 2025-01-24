import { Router } from "express";
import { auth, error, validation } from "src/handlers";
import { expense as controller } from "../controllers";
import { expense } from "src/schema";

const expenseRouter = Router();

expenseRouter.use(auth.handle());

expenseRouter.post(
  "/merchant/add",
  validation.handle(expense.merchantSchema),
  error.handle(controller.handleAdd("merchant"))
);

expenseRouter.get(
  "/merchant/:merchant_id",
  error.handle(controller.handleGet("merchant"))
);

expenseRouter.put(
  "/merchant/update",
  validation.handle(expense.merchantSchema),
  error.handle(controller.handleUpdate("merchant"))
);

expenseRouter.get(
  "/merchants",
  error.handle(controller.handleGetAll("merchant"))
);

expenseRouter.post(
  "/category/add",
  validation.handle(expense.categorySchema),
  error.handle(controller.handleAdd("category"))
);

expenseRouter.get(
  "/category/:category_id",
  error.handle(controller.handleGet("category"))
);

expenseRouter.put(
  "/category/update",
  validation.handle(expense.categorySchema),
  error.handle(controller.handleUpdate("category"))
);

expenseRouter.get(
  "/categories",
  error.handle(controller.handleGetAll("category"))
);

expenseRouter.post(
  "/sub-category/add",
  validation.handle(expense.subCategorySchema),
  error.handle(controller.handleAdd("subCategory"))
);

expenseRouter.get(
  "/sub-category/:sub_category_id",
  error.handle(controller.handleGet("subCategory"))
);

expenseRouter.put(
  "/sub-category/update",
  validation.handle(expense.subCategorySchema),
  error.handle(controller.handleUpdate("subCategory"))
);

expenseRouter.get(
  "/sub-categories",
  error.handle(controller.handleGetAll("subCategory"))
);

export default expenseRouter;
