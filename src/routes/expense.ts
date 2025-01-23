import { Router } from "express";
import { auth, error, validation } from "src/handlers";
import { expense as controller, expense } from "../controllers"

const expenseRouter = Router();

expenseRouter.use(auth.handle());

expenseRouter.post('/merchant/add', validation.handle(), error.handle(controller.handleAddMerchant));

expenseRouter.get('/merchant/:merchant_id', error.handle(controller.handleGetMerchant))

expenseRouter.put("/merchant/update", validation.handle(), error.handle(controller.handleUpdateMerchant))

expenseRouter.get('/merchants', error.handle(controller.handleGetMerchants))

expenseRouter.post('/category/add', validation.handle(), error.handle(controller.handleAddCategory));

expenseRouter.get('/category/:category_id', error.handle(controller.handleGetCategory));

expenseRouter.put('/category/update', validation.handle(), error.handle(controller.handleUpdateCategory));

expenseRouter.get("/categories", error.handle(controller.getCategories));

expenseRouter.post('/sub-category/add', validation.handle(), error.handle(controller.handleAddSubCategory));

expenseRouter.get('/sub-category/:category_id', error.handle(controller.handleGetSubCategory));

expenseRouter.put('/sub-category/update', validation.handle(), error.handle(controller.handleUpdateSubCategory));

expenseRouter.get("/sub-categories", error.handle(controller.getSubCategories));

export default expenseRouter;
