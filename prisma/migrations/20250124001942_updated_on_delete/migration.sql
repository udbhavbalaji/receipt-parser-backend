-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Category" (
    "name" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Category_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("userId") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Category" ("name", "userId") SELECT "name", "userId" FROM "Category";
DROP TABLE "Category";
ALTER TABLE "new_Category" RENAME TO "Category";
CREATE TABLE "new_Expense" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" TEXT NOT NULL,
    "receiptId" TEXT NOT NULL,
    "categoryName" TEXT NOT NULL,
    "subCategoryName" TEXT NOT NULL,
    "merchantName" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'CAD',
    "total" REAL NOT NULL,
    CONSTRAINT "Expense_categoryName_fkey" FOREIGN KEY ("categoryName") REFERENCES "Category" ("name") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Expense_subCategoryName_fkey" FOREIGN KEY ("subCategoryName") REFERENCES "SubCategory" ("name") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Expense_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("userId") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Expense_receiptId_fkey" FOREIGN KEY ("receiptId") REFERENCES "Receipt" ("receiptId") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Expense_merchantName_fkey" FOREIGN KEY ("merchantName") REFERENCES "Merchant" ("name") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Expense" ("categoryName", "currency", "date", "id", "merchantName", "receiptId", "subCategoryName", "total", "userId") SELECT "categoryName", "currency", "date", "id", "merchantName", "receiptId", "subCategoryName", "total", "userId" FROM "Expense";
DROP TABLE "Expense";
ALTER TABLE "new_Expense" RENAME TO "Expense";
CREATE UNIQUE INDEX "Expense_receiptId_key" ON "Expense"("receiptId");
CREATE TABLE "new_Merchant" (
    "name" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "categoryName" TEXT NOT NULL,
    "subCategoryName" TEXT NOT NULL,
    CONSTRAINT "Merchant_categoryName_fkey" FOREIGN KEY ("categoryName") REFERENCES "Category" ("name") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Merchant_subCategoryName_fkey" FOREIGN KEY ("subCategoryName") REFERENCES "SubCategory" ("name") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Merchant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("userId") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Merchant" ("categoryName", "name", "subCategoryName", "userId") SELECT "categoryName", "name", "subCategoryName", "userId" FROM "Merchant";
DROP TABLE "Merchant";
ALTER TABLE "new_Merchant" RENAME TO "Merchant";
CREATE TABLE "new_SubCategory" (
    "name" TEXT NOT NULL PRIMARY KEY,
    "categoryName" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "SubCategory_categoryName_fkey" FOREIGN KEY ("categoryName") REFERENCES "Category" ("name") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "SubCategory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("userId") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_SubCategory" ("categoryName", "name", "userId") SELECT "categoryName", "name", "userId" FROM "SubCategory";
DROP TABLE "SubCategory";
ALTER TABLE "new_SubCategory" RENAME TO "SubCategory";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
